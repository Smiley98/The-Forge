#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

struct Compute_Shader
{
    texture2d<float, access::read_write> outputTexture;
    struct Uniforms_uniformBlock
    {
        float4x4 mvp;
        float4 c_diffuse;
        float4 c_mu;
        float c_epsilon;
        float zoom;
        int c_width;
        int c_height;
        int c_renderSoftShadows;
    };
    constant Uniforms_uniformBlock& uniformBlock;
    float4 quatSq(float4 q)
    {
        float4 r;
        ((r).x = (((q).x * (q).x) - dot((q).yzw, (q).yzw)));
        ((r).yzw = (float3(float(2) * (q).x) * (q).yzw));
        return r;
    };
    float3 normEstimate(float3 p, float4 c)
    {
        float3 N;
        float4 qP = float4(p, (float)0);
        float gradX, gradY, gradZ;
        float4 gx1 = (qP - float4(0.00010000000, (float)0, (float)0, (float)0));
        float4 gx2 = (qP + float4(0.00010000000, (float)0, (float)0, (float)0));
        float4 gy1 = (qP - float4((float)0, 0.00010000000, (float)0, (float)0));
        float4 gy2 = (qP + float4((float)0, 0.00010000000, (float)0, (float)0));
        float4 gz1 = (qP - float4((float)0, (float)0, 0.00010000000, (float)0));
        float4 gz2 = (qP + float4((float)0, (float)0, 0.00010000000, (float)0));
        for (int i = 0; (i < 10); (i++))
        {
            (gx1 = (quatSq(gx1) + c));
            (gx2 = (quatSq(gx2) + c));
            (gy1 = (quatSq(gy1) + c));
            (gy2 = (quatSq(gy2) + c));
            (gz1 = (quatSq(gz1) + c));
            (gz2 = (quatSq(gz2) + c));
        }
        (gradX = (length(gx2) - length(gx1)));
        (gradY = (length(gy2) - length(gy1)));
        (gradZ = (length(gz2) - length(gz1)));
        (N = normalize(float3(gradX, gradY, gradZ)));
        return N;
    };
    float intersectQJulia(thread float3(& rO), float3 rD, float4 c, float epsilon)
    {
        float dist;
        float rd = 0.0;
        (dist = epsilon);
        while (((dist >= epsilon) && (rd < float(3.0)))) {
            float4 z = float4(rO, (float)0);
            float4 zp = float4((float)1, (float)0, (float)0, (float)0);
            float zd = 0.0;
            uint count = uint(0);
            while (((zd < float(10)) && (count < uint(10)))) {
                (zp = (float4(2.0) * quatMult(z, zp)));
                (z = (quatSq(z) + c));
                (zd = dot(z, z));
                (count++);
            }
            float normZ = length(z);
            (dist = (((0.5 * normZ) * log(normZ)) / length(zp)));
            (rO += (rD * float3(dist)));
            (rd = dot(rO, rO));
        }
        return dist;
    };
    float3 Phong(float3 light, float3 eye, float3 pt, float3 N)
    {
        float3 diffuse = float3((float)1.0, (float)0.45, (float)0.25);
        const int specularExponent = 10;
        const float specularity = float(0.45);
        float3 L = normalize((light - pt));
        float3 E = normalize((eye - pt));
        float NdotL = dot(N, L);
        float3 R = (L - (float3(float(2) * NdotL) * N));
        (diffuse = ((uniformBlock.c_diffuse).xyz + (abs(N) * float3(0.3))));
        return ((diffuse * float3(max((float)NdotL,(float)float(0)))) + float3(specularity * pow(max((float)dot(E, R),(float)float(0)), float(specularExponent))));
    };
    float3 intersectSphere(float3 rO, float3 rD)
    {
        float B, C, d, t0, t1, t;
        (B = (float(2) * dot(rO, rD)));
        (C = (dot(rO, rO) - float(3.0)));
        (d = sqrt(((B * B) - (float(4) * C))));
        (t0 = (((-B) + d) * float(0.5)));
        (t1 = (((-B) - d) * float(0.5)));
        (t = min((float)t0,(float)t1));
        (rO += (float3(t) * rD));
        return rO;
    };
    float4 QJulia(float3 rO, float3 rD, float4 mu, float epsilon, float3 eye, float3 light, bool renderShadows)
    {
        const float4 backgroundColor = float4((float)0.3, (float)0.3, (float)0.3, (float)0);
        float4 color;
        (color = backgroundColor);
        (rD = normalize(rD));
        (rO = intersectSphere(rO, rD));
        float dist = intersectQJulia(rO, rD, mu, epsilon);
        if (dist < epsilon)
        {
            float3 N = normEstimate(rO, mu);
            ((color).rgb = Phong(light, rD, rO, N));
            ((color).a = float(1));
            if (renderShadows == true)
            {
                float3 L = normalize((light - rO));
                (rO += ((N * float3(epsilon)) * float3(2.0)));
                (dist = intersectQJulia(rO, L, mu, epsilon));
                if (dist < epsilon)
                {
                    ((color).rgb *= float3(0.4));
                }
            }
        }
        return color;
    };
    void main(uint3 Gid, uint3 DTid, uint3 GTid, uint GI)
    {
        float4 coord = float4(float(DTid.x), float(DTid.y), 0.0, 0.0);
        float2 size = float2(float(uniformBlock.c_width), float(uniformBlock.c_height));
        float scale = min((float)size.x,(float)size.y);
        float2 halfvec = float2(0.5, 0.5);
        float2 position = (((((coord).xy - (halfvec * size)) / float2(scale)) * float2(3.0)) * float2(uniformBlock.zoom));
        float4 light = float4(1.5, 0.5, 4.0, 0.0);
        float4 eye = float4(0.0, 0.0, 4.0, 0.0);
        float4 ray = float4((position).x, (position).y, 0.0, 0.0);
        (light = ((light)*(uniformBlock.mvp)));
        (eye = ((eye)*(uniformBlock.mvp)));
        (ray = ((ray)*(uniformBlock.mvp)));
        float3 rO = (eye).xyz;
        float3 rD = ((ray).xyz - rO);
        float4 color = QJulia(rO, rD, uniformBlock.c_mu, uniformBlock.c_epsilon, (eye).xyz, (light).xyz, bool(uniformBlock.c_renderSoftShadows));
        (outputTexture.write(color, uint2((DTid).xy)));
    };

    Compute_Shader(texture2d<float, access::read_write> outputTexture, constant Uniforms_uniformBlock& uniformBlock) :
        outputTexture(outputTexture), uniformBlock(uniformBlock)
    {}
};
struct ArgBuffer0
{
    texture2d<float, access::read_write> outputTexture [[id(1)]];
};

struct ArgBuffer1
{
    constant Compute_Shader::Uniforms_uniformBlock& uniformBlock [[id(0)]];
};
//[numthreads(16, 16, 1)]
kernel void stageMain(
    uint3 Gid [[threadgroup_position_in_grid]],
    uint3 DTid [[thread_position_in_grid]],
    uint3 GTid [[thread_position_in_threadgroup]],
    uint GI [[thread_index_in_threadgroup]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    uint3 Gid0;
    Gid0 = Gid;
    uint3 DTid0;
    DTid0 = DTid;
    uint3 GTid0;
    GTid0 = GTid;
    uint GI0;
    GI0 = GI;
    Compute_Shader main(argBuffer0.outputTexture, argBuffer1.uniformBlock);
    return main.main(Gid0, DTid0, GTid0, GI0);
}
