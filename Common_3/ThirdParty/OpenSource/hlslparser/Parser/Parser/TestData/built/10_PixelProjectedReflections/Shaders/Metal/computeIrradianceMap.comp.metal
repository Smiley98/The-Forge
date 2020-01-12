#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

struct Compute_Shader
{
    const float Pi = float(3.14159274);
    float SampleDelta = float(0.025);
    texturecube<float> srcTexture;
    texture2d_array<float, access::read_write> dstTexture;
    sampler skyboxSampler;
    float4 computeIrradiance(float3 N)
    {
        float4 irradiance = float4((float)0.0, (float)0.0, (float)0.0, (float)0.0);
        float3 up = float3((float)0.0, (float)1.0, (float)0.0);
        float3 right = cross(up, N);
        (up = cross(N, right));
        float nrSamples = float(0.0);
        for (float phi = float(0.0); (phi < (float(2.0) * Pi)); (phi += SampleDelta))
        {
            for (float theta = float(0.0); (theta < (float(0.5) * Pi)); (theta += SampleDelta))
            {
                float3 tangentSample = float3((sin(theta) * cos(phi)), (sin(theta) * sin(phi)), cos(theta));
                float3 sampleVec = (((float3(tangentSample.x) * right) + (float3(tangentSample.y) * up)) + (float3(tangentSample.z) * N));
                float4 sampledValue = srcTexture.sample(skyboxSampler, sampleVec, level(float(0)));
                (irradiance += float4((((sampledValue).rgb * float3(cos(theta))) * float3(sin(theta))), (sampledValue).a));
                (nrSamples++);
            }
        }
        return ((float4(Pi) * irradiance) * float4(float(1.0) / float(nrSamples)));
    };
    void main(uint3 DTid)
    {
        float3 threadPos = float3(DTid);
        uint pixelOffset = uint(0);
        for (uint i = uint(0); (float(i) < (threadPos).z); (++i))
        {
            (pixelOffset += uint(32 * 32));
        }
        float2 texcoords = float2((float(((threadPos).x + float(0.5))) / 32.0), (float(((threadPos).y + float(0.5))) / 32.0));
        float3 sphereDir;
        if (threadPos.z <= float(0))
        {
            (sphereDir = normalize(float3((float)0.5, (-((texcoords).y - float(0.5))), (-((texcoords).x - float(0.5))))));
        }
        else if (((threadPos).z <= float(1)))
        {
            (sphereDir = normalize(float3((float)(-0.5), (-((texcoords).y - float(0.5))), ((texcoords).x - float(0.5)))));
        }
        else if (((threadPos).z <= float(2)))
        {
            (sphereDir = normalize(float3(((texcoords).x - float(0.5)), (float)0.5, ((texcoords).y - float(0.5)))));
        }
        else if (((threadPos).z <= float(3)))
        {
            (sphereDir = normalize(float3(((texcoords).x - float(0.5)), (float)(-0.5), (-((texcoords).y - float(0.5))))));
        }
        else if (((threadPos).z <= float(4)))
        {
            (sphereDir = normalize(float3(((texcoords).x - float(0.5)), (-((texcoords).y - float(0.5))), (float)0.5)));
        }
        else if (((threadPos).z <= float(5)))
        {
            (sphereDir = normalize(float3((-((texcoords).x - float(0.5))), (-((texcoords).y - float(0.5))), (float)(-0.5))));
        }
        uint pixelId = uint(float(pixelOffset) + ((threadPos).y * float(32)) + (threadPos).x);
        float4 irradiance = computeIrradiance(sphereDir);
        (dstTexture.write(irradiance, uint3(int3((int3)threadPos)).xy, uint3(int3((int3)threadPos)).z));
    };

    Compute_Shader(texturecube<float> srcTexture, texture2d_array<float, access::read_write> dstTexture, sampler skyboxSampler) :
        srcTexture(srcTexture), dstTexture(dstTexture), skyboxSampler(skyboxSampler)
    {}
};
struct ArgBuffer0
{
    texturecube<float> srcTexture [[id(0)]];
    texture2d_array<float, access::read_write> dstTexture [[id(2)]];
    sampler skyboxSampler [[id(3)]];
};
//[numthreads(16, 16, 1)]
kernel void stageMain(
    uint3 DTid [[thread_position_in_grid]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    uint3 DTid0;
    DTid0 = DTid;
    Compute_Shader main(argBuffer0.srcTexture, argBuffer0.dstTexture, argBuffer0.skyboxSampler);
    return main.main(DTid0);
}
