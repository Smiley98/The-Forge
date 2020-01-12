#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

struct Compute_Shader
{
    texture2d<float> shadowsRT;
    texture2d<float, access::read_write> outputRT;
    void main(uint3 Gid, uint3 DTid, uint3 GTid, uint GI)
    {
        float shadowFactor = (shadowsRT.read(((DTid).xy).xy)).x;
        (outputRT.write(shadowFactor, uint2((DTid).xy)));
    };

    Compute_Shader(texture2d<float> shadowsRT, texture2d<float, access::read_write> outputRT) :
        shadowsRT(shadowsRT), outputRT(outputRT)
    {}
};
struct ArgBuffer0
{
    texture2d<float> shadowsRT [[id(1)]];
    texture2d<float, access::read_write> outputRT [[id(2)]];
};
//[numthreads(8, 8, 1)]
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
    Compute_Shader main(argBuffer0.shadowsRT, argBuffer0.outputRT);
    return main.main(Gid0, DTid0, GTid0, GI0);
}
