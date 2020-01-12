#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

struct Compute_Shader
{
    struct Data
    {
        uint mip;
        uint maxSize;
    };
    struct Uniforms_RootConstant
    {
        uint mip;
        uint maxSize;
    };
    constant Uniforms_RootConstant& RootConstant;
    texture2d<float> srcTexture;
    texture2d_array<float, access::read_write> dstTexture;
    sampler skyboxSampler;
    void main(uint3 DTid)
    {
        float2 invAtan = float2(0.1591, 0.31830000);
        float3 threadPos = float3(DTid);
        uint mip = (RootConstant).mip;
        {
            uint mipSize = ((RootConstant).maxSize >> mip);
            if (threadPos.x >= float(mipSize) || ((threadPos).y >= float(mipSize)))
            {
                return;
            }
            float2 texcoords = float2((float(((threadPos).x + float(0.5))) / float(mipSize)), (1.0 - (float(((threadPos).y + float(0.5))) / float(mipSize))));
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
                (sphereDir = normalize(float3(((texcoords).x - float(0.5)), (float)(-0.5), (-((texcoords).y - float(0.5))))));
            }
            else if (((threadPos).z <= float(3)))
            {
                (sphereDir = normalize(float3(((texcoords).x - float(0.5)), (float)0.5, ((texcoords).y - float(0.5)))));
            }
            else if (((threadPos).z <= float(4)))
            {
                (sphereDir = normalize(float3(((texcoords).x - float(0.5)), (-((texcoords).y - float(0.5))), (float)0.5)));
            }
            else if (((threadPos).z <= float(5)))
            {
                (sphereDir = normalize(float3((-((texcoords).x - float(0.5))), (-((texcoords).y - float(0.5))), (float)(-0.5))));
            }
            float2 panoUVs = float2(atan2((sphereDir).z, (sphereDir).x), asin((sphereDir).y));
            (panoUVs *= invAtan);
            (panoUVs += float2(0.5));
            (dstTexture.write(srcTexture.sample(skyboxSampler, panoUVs, level(float(mip))), uint3(uint3((uint)(threadPos).x, (uint)(threadPos).y, (uint)(threadPos).z)).xy, uint3(uint3((uint)(threadPos).x, (uint)(threadPos).y, (uint)(threadPos).z)).z));
        }
    };

    Compute_Shader(constant Uniforms_RootConstant& RootConstant, texture2d<float> srcTexture, texture2d_array<float, access::read_write> dstTexture, sampler skyboxSampler) :
        RootConstant(RootConstant), srcTexture(srcTexture), dstTexture(dstTexture), skyboxSampler(skyboxSampler)
    {}
};
struct ArgBuffer0
{
    texture2d<float> srcTexture [[id(1)]];
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
