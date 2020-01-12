#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

struct Compute_Shader
{
    texture2d<float> albedobuffer;
    texture2d<float> lightbuffer;
    texture2d<float, access::read_write> outputRT;
    void main(uint3 Gid, uint3 DTid, uint3 GTid, uint GI)
    {
        float3 albedo = (albedobuffer.read(((DTid).xy).xy)).xyz;
        (albedo = pow(abs(albedo), float3(2.20000004)));
        float3 diffuse = (lightbuffer.read(((DTid).xy).xy)).xyz;
        (outputRT.write(float4((diffuse * albedo), (float)0), uint2((DTid).xy)));
    };

    Compute_Shader(texture2d<float> albedobuffer, texture2d<float> lightbuffer, texture2d<float, access::read_write> outputRT) :
        albedobuffer(albedobuffer), lightbuffer(lightbuffer), outputRT(outputRT)
    {}
};
struct ArgBuffer0
{
    texture2d<float> albedobuffer [[id(0)]];
    texture2d<float> lightbuffer [[id(1)]];
    texture2d<float, access::read_write> outputRT [[id(2)]];
};
//[numthreads(16, 16, 1)]
kernel void stageMain(
    uint3 Gid [[threadgroup_position_in_grid]],
    uint3 DTid [[thread_position_in_grid]],
    uint3 GTid [[thread_position_in_threadgroup]],
    uint GI [[thread_index_in_threadgroup]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    uint3 Gid0;
    Gid0 = Gid;
    uint3 DTid0;
    DTid0 = DTid;
    uint3 GTid0;
    GTid0 = GTid;
    uint GI0;
    GI0 = GI;
    Compute_Shader main(argBuffer0.albedobuffer, argBuffer0.lightbuffer, argBuffer0.outputRT);
    return main.main(Gid0, DTid0, GTid0, GI0);
}
