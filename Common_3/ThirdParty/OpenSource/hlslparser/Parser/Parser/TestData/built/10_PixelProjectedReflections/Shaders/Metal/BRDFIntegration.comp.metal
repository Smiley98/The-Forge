#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

struct Compute_Shader
{
    float Pi = float(3.14159274);
    float SampleCount = float(128);
    float RadicalInverse_VdC(uint bits)
    {
        (bits = ((bits << uint(16)) | (bits >> uint(16))));
        (bits = (((bits & 1431655765u) << uint(1)) | ((bits & 2863311530u) >> uint(1))));
        (bits = (((bits & 858993459u) << uint(2)) | ((bits & 3435973836u) >> uint(2))));
        (bits = (((bits & 252645135u) << uint(4)) | ((bits & 4042322160u) >> uint(4))));
        (bits = (((bits & 16711935u) << uint(8)) | ((bits & 4278255360u) >> uint(8))));
        return (float((float)bits) * 2.328306e-10);
    };
    float2 Hammersley(uint i, uint N)
    {
        return float2((float((float)i) / float((float)N)), RadicalInverse_VdC(i));
    };
    float3 ImportanceSampleGGX(float2 Xi, float3 N, float roughness)
    {
        float a = (roughness * roughness);
        float phi = ((float(2.0) * Pi) * (Xi).x);
        float cosTheta = sqrt(((float(1.0) - (Xi).y) / (float(1.0) + (((a * a) - float(1.0)) * (Xi).y))));
        float sinTheta = sqrt((float(1.0) - (cosTheta * cosTheta)));
        float3 H;
        ((H).x = (cos(phi) * sinTheta));
        ((H).y = (sin(phi) * sinTheta));
        ((H).z = cosTheta);
        float3 up = (((abs((N).z) < float(0.9990000)))?(float3((float)0.0, (float)0.0, (float)1.0)):(float3((float)1.0, (float)0.0, (float)0.0)));
        float3 tangent = normalize(cross(up, N));
        float3 bitangent = cross(N, tangent);
        float3 sampleVec = (((tangent * float3(H.x)) + (bitangent * float3(H.y))) + (N * float3(H.z)));
        return normalize(sampleVec);
    };
    float GeometrySchlickGGX(float NdotV, float roughness)
    {
        float a = roughness;
        float k = ((a * a) / float(2.0));
        float nom = NdotV;
        float denom = ((NdotV * (float(1.0) - k)) + k);
        return (nom / denom);
    };
    float GeometrySmith(float3 N, float3 V, float3 L, float roughness)
    {
        float NdotV = max((float)dot(N, V),(float)float(0.0));
        float NdotL = max((float)dot(N, L),(float)float(0.0));
        float ggx2 = GeometrySchlickGGX(NdotV, roughness);
        float ggx1 = GeometrySchlickGGX(NdotL, roughness);
        return (ggx1 * ggx2);
    };
    float2 IntegrateBRDF(float NdotV, float roughness)
    {
        float3 V;
        ((V).x = sqrt((float(1.0) - (NdotV * NdotV))));
        ((V).y = float(0.0));
        ((V).z = NdotV);
        float A = float(0.0);
        float B = float(0.0);
        float3 N = float3((float)0.0, (float)0.0, (float)1.0);
        for (int i = 0; (float(i) < SampleCount); (++i))
        {
            float2 Xi = Hammersley(uint(i), uint(SampleCount));
            float3 H = ImportanceSampleGGX(Xi, N, roughness);
            float3 L = normalize(((float3(float(2.0) * dot(V, H)) * H) - V));
            float NdotL = max((float)L.z,(float)float(0.0));
            float NdotH = max((float)H.z,(float)float(0.0));
            float VdotH = max((float)dot(V, H),(float)float(0.0));
            if (NdotL > float(0.0))
            {
                float G = GeometrySmith(N, V, L, roughness);
                float G_Vis = ((G * VdotH) / (NdotH * NdotV));
                float Fc = pow((float(1.0) - VdotH), float(5.0));
                (A += ((float(1.0) - Fc) * G_Vis));
                (B += (Fc * G_Vis));
            }
        }
        (A /= float(SampleCount));
        (B /= float(SampleCount));
        return float2(A, B);
    };
    const float PI = float(3.14159274);
    texture2d<float, access::read_write> dstTexture;
    void main(uint3 DTid)
    {
        float2 texcoords = float2((float((float)(half(DTid.x) + 0.5)) / 512.0), (float(1.0) - (float((float)(half(DTid.y) + 0.5)) / 512.0)));
        float4 output = float4(IntegrateBRDF((texcoords).x, (texcoords).y), (float)0.0, (float)0.0);
        (dstTexture.write((output).xy, uint2((DTid).xy)));
    };

    Compute_Shader(texture2d<float, access::read_write> dstTexture) :
        dstTexture(dstTexture)
    {}
};
struct ArgBuffer0
{
    texture2d<float, access::read_write> dstTexture [[id(0)]];
};
//[numthreads(16, 16, 1)]
kernel void stageMain(
    uint3 DTid [[thread_position_in_grid]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    uint3 DTid0;
    DTid0 = DTid;
    Compute_Shader main(argBuffer0.dstTexture);
    return main.main(DTid0);
}
