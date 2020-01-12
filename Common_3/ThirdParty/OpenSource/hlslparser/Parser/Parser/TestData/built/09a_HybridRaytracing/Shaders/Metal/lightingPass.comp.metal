#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

struct Compute_Shader
{
    struct Uniforms_cbPerPass
    {
        float4x4 projView;
        float4x4 invProjView;
        float4 rtSize;
        float4 lightDir;
        float4 cameraPos;
    };
    constant Uniforms_cbPerPass& cbPerPass;
    texture2d<float> normalbuffer;
    texture2d<float> shadowbuffer;
    texture2d<float, access::read_write> outputRT;
    void main(uint3 Gid, uint3 DTid, uint3 GTid, uint GI)
    {
        const float lightIntensity = float(5);
        const float3 lightColour = float3((float)1, (float)1, (float)0.5);
        float3 normal = (normalbuffer.read(((DTid).xy).xy)).xyz;
        float NdotL = saturate(dot(normal, (cbPerPass.lightDir).xyz));
        float shadowFactor = (shadowbuffer.read(((DTid).xy).xy)).x;
        float ambient = mix(float(0.5), float(0.2), (((normal).y * float(0.5)) + float(0.5)));
        float3 diffuse = ((float3(lightIntensity * shadowFactor * NdotL) * lightColour) + float3(ambient));
        (outputRT.write(float4(diffuse, (float)1), uint2((DTid).xy)));
    };

    Compute_Shader(constant Uniforms_cbPerPass& cbPerPass, texture2d<float> normalbuffer, texture2d<float> shadowbuffer, texture2d<float, access::read_write> outputRT) :
        cbPerPass(cbPerPass), normalbuffer(normalbuffer), shadowbuffer(shadowbuffer), outputRT(outputRT)
    {}
};
struct ArgBuffer0
{
    texture2d<float> normalbuffer [[id(1)]];
    texture2d<float> shadowbuffer [[id(2)]];
    texture2d<float, access::read_write> outputRT [[id(3)]];
};

struct ArgBuffer1
{
    constant Compute_Shader::Uniforms_cbPerPass& cbPerPass [[id(0)]];
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
    Compute_Shader main(argBuffer1.cbPerPass, argBuffer0.normalbuffer, argBuffer0.shadowbuffer, argBuffer0.outputRT);
    return main.main(Gid0, DTid0, GTid0, GI0);
}
