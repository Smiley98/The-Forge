#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

inline float rcp(float x) {
    return 1.0f / x;
}
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
    texture2d<float> depthBuffer;
    texture2d<float> normalBuffer;
    texture2d<float, access::read_write> outputRT;
    void main(uint3 Gid, uint3 DTid, uint3 GTid, uint GI)
    {
        bool collision = false;
        int offsetToNextNode = 1;
        float depth = (depthBuffer.read(((DTid).xy).xy)).x;
        float3 normal = (normalBuffer.read(((DTid).xy).xy)).xyz;
        float NdotL = dot(normal, (cbPerPass.lightDir).xyz);
        if (depth < float(1) && (NdotL > float(0)))
        {
            float2 uv = (float2(DTid.xy) * (cbPerPass.rtSize).zw);
            float4 clipPos = float4(((float2(2) * uv) - float2(1)), depth, (float)1);
            ((clipPos).y = (-(clipPos).y));
            float4 worldPos = ((cbPerPass.invProjView)*(clipPos));
            ((worldPos).xyz /= float3(worldPos.w));
            float3 rayDir = (cbPerPass.lightDir).xyz;
            float3 rayDirInv = rcp(rayDir);
            ((worldPos).xyz += (float3(5) * normal));
            float t = float(0);
            float2 bCoord = float2(0);
            int dataOffset = 0;
            bool done = false;
            while ((offsetToNextNode != 0)) {
                float4 element0 = (BVHTree[(dataOffset++)]).xyzw;
                float4 element1 = (BVHTree[(dataOffset++)]).xyzw;
                (offsetToNextNode = int((int)(element0).w));
                (collision = false);
                if (offsetToNextNode < 0)
                {
                    float3 bboxMin = (element0).xyz;
                    float3 bboxMax = (element1).xyz;
                    (collision = RayIntersectsBox((worldPos).xyz, rayDirInv, (bboxMin).xyz, (bboxMax).xyz));
                    if ((!collision))
                    {
                        (dataOffset += int(abs(float(offsetToNextNode))));
                    }
                }
                else if ((offsetToNextNode > 0))
                {
                    float4 element2 = (BVHTree[(dataOffset++)]).xyzw;
                    float3 vertex0 = (element0).xyz;
                    float3 vertex1MinusVertex0 = (element1).xyz;
                    float3 vertex2MinusVertex0 = (element2).xyz;
                    (collision = RayTriangleIntersect((worldPos).xyz, rayDir, (vertex0).xyz, (vertex1MinusVertex0).xyz, (vertex2MinusVertex0).xyz, t, bCoord));
                    if (collision)
                    {
                        break;
                    }
                }
            }
        }
        (outputRT.write((float(1) - float((float)collision)), uint2((DTid).xy)));
    };

    Compute_Shader(constant Uniforms_cbPerPass& cbPerPass, texture2d<float> depthBuffer, texture2d<float> normalBuffer, texture2d<float, access::read_write> outputRT) :
        cbPerPass(cbPerPass), depthBuffer(depthBuffer), normalBuffer(normalBuffer), outputRT(outputRT)
    {}
};
struct ArgBuffer0
{
    texture2d<float> depthBuffer [[id(1)]];
    texture2d<float> normalBuffer [[id(2)]];
    texture2d<float, access::read_write> outputRT [[id(4)]];
};

struct ArgBuffer1
{
    constant Compute_Shader::Uniforms_cbPerPass& cbPerPass [[id(0)]];
};
//[numthreads(8, 8, 1)]
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
    Compute_Shader main(argBuffer1.cbPerPass, argBuffer0.depthBuffer, argBuffer0.normalBuffer, argBuffer0.outputRT);
    return main.main(Gid0, DTid0, GTid0, GI0);
}
