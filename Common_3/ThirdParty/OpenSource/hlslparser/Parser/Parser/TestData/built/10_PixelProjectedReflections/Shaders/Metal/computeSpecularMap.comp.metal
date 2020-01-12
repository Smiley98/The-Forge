#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

struct Compute_Shader
{
    float Pi = float(3.14159274);
    int SampleCount = 128;
    struct PrecomputeSkySpecularData
    {
        uint mipSize;
        float roughness;
    };
    struct Uniforms_RootConstant
    {
        uint mipSize;
        float roughness;
    };
    constant Uniforms_RootConstant& RootConstant;
    texturecube<float> srcTexture;
    texture2d_array<float, access::read_write> dstTexture;
    sampler skyboxSampler;
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
    float DistributionGGX(float3 N, float3 H, float roughness)
    {
        float a = (roughness * roughness);
        float a2 = (a * a);
        float NdotH = max((float)dot(N, H),(float)float(0.0));
        float NdotH2 = (NdotH * NdotH);
        float nom = a2;
        float denom = ((NdotH2 * (a2 - float(1.0))) + float(1.0));
        (denom = ((Pi * denom) * denom));
        return (nom / denom);
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
    void main(uint3 DTid)
    {
        uint3 threadPos = DTid;
        float mipRoughness = (RootConstant).roughness;
        uint mipSize = (RootConstant).mipSize;
        if (threadPos.x >= mipSize || ((threadPos).y >= mipSize))
        {
            return;
        }
        float2 texcoords = float2((float((float)(half(threadPos.x) + 0.5)) / float(mipSize)), (float((float)(half(threadPos.y) + 0.5)) / float(mipSize)));
        float3 sphereDir;
        if (threadPos.z <= uint(0))
        {
            (sphereDir = normalize(float3((float)0.5, (-((texcoords).y - float(0.5))), (-((texcoords).x - float(0.5))))));
        }
        else if (((threadPos).z <= uint(1)))
        {
            (sphereDir = normalize(float3((float)(-0.5), (-((texcoords).y - float(0.5))), ((texcoords).x - float(0.5)))));
        }
        else if (((threadPos).z <= uint(2)))
        {
            (sphereDir = normalize(float3(((texcoords).x - float(0.5)), (float)0.5, ((texcoords).y - float(0.5)))));
        }
        else if (((threadPos).z <= uint(3)))
        {
            (sphereDir = normalize(float3(((texcoords).x - float(0.5)), (float)(-0.5), (-((texcoords).y - float(0.5))))));
        }
        else if (((threadPos).z <= uint(4)))
        {
            (sphereDir = normalize(float3(((texcoords).x - float(0.5)), (-((texcoords).y - float(0.5))), (float)0.5)));
        }
        else if (((threadPos).z <= uint(5)))
        {
            (sphereDir = normalize(float3((-((texcoords).x - float(0.5))), (-((texcoords).y - float(0.5))), (float)(-0.5))));
        }
        float3 N = sphereDir;
        float3 R = N;
        float3 V = R;
        float totalWeight = float(0.0);
        float4 prefilteredColor = float4((float)0.0, (float)0.0, (float)0.0, (float)0.0);
        for (int i = 0; (i < SampleCount); (++i))
        {
            float2 Xi = Hammersley(uint(i), uint(SampleCount));
            float3 H = ImportanceSampleGGX(Xi, N, mipRoughness);
            float3 L = normalize(((float3(float(2.0) * dot(V, H)) * H) - V));
            float NdotL = max((float)dot(N, L),(float)float(0.0));
            if (NdotL > float(0.0))
            {
                float D = DistributionGGX(N, H, mipRoughness);
                float NdotH = max((float)dot(N, H),(float)float(0.0));
                float HdotV = max((float)dot(H, V),(float)float(0.0));
                float pdf = (((D * NdotH) / (float(4.0) * HdotV)) + float(0.00010000000));
                float saTexel = ((float(4.0) * Pi) / float(6.0 * half(mipSize) * half(mipSize)));
                float saSample = (float(1.0) / ((float((float)SampleCount) * pdf) + float(0.00010000000)));
                float mipLevel = float((((mipRoughness == float(0.0)))?(0.0):((float(0.5) * log2((saSample / saTexel))))));
                (prefilteredColor += (srcTexture.sample(skyboxSampler, L, level(mipLevel)) * float4(NdotL)));
                (totalWeight += NdotL);
            }
        }
        (prefilteredColor = (prefilteredColor / float4(totalWeight)));
        (dstTexture.write(prefilteredColor, uint3(threadPos).xy, uint3(threadPos).z));
    };

    Compute_Shader(constant Uniforms_RootConstant& RootConstant, texturecube<float> srcTexture, texture2d_array<float, access::read_write> dstTexture, sampler skyboxSampler) :
        RootConstant(RootConstant), srcTexture(srcTexture), dstTexture(dstTexture), skyboxSampler(skyboxSampler)
    {}
};
struct ArgBuffer0
{
    texturecube<float> srcTexture [[id(1)]];
    sampler skyboxSampler [[id(3)]];
};

struct ArgBuffer3
{
    texture2d_array<float, access::read_write> dstTexture [[id(2)]];
};
//[numthreads(16, 16, 1)]
kernel void stageMain(
    uint3 DTid [[thread_position_in_grid]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer3& argBuffer3 [[buffer(3)]],
    constant Compute_Shader::Uniforms_RootConstant& RootConstant)
{
    uint3 DTid0;
    DTid0 = DTid;
    Compute_Shader main(RootConstant, argBuffer0.srcTexture, argBuffer3.dstTexture, argBuffer0.skyboxSampler);
    return main.main(DTid0);
}
