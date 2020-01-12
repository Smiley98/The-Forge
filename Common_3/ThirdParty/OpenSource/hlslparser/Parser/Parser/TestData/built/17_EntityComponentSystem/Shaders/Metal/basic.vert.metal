#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Uniforms_RootConstant
    {
        float aspect;
    };
    constant Uniforms_RootConstant& RootConstant;
    struct InstanceData
    {
        float4 posScale;
        float4 colorIndex;
    };
    constant InstanceData* instanceBuffer;
    struct VSOutput
    {
        float4 pos;
        float3 color;
        float2 uv;
    };
    VSOutput main(uint vertexId, uint instanceId)
    {
        VSOutput result;
        float x = float(vertexId / uint(2));
        float y = float(vertexId & uint(1));
        (((result).pos).x = (((instanceBuffer[instanceId]).posScale).x + ((x - 0.5) * ((instanceBuffer[instanceId]).posScale).z)));
        (((result).pos).y = (((instanceBuffer[instanceId]).posScale).y + (((y - 0.5) * ((instanceBuffer[instanceId]).posScale).z) * RootConstant.aspect)));
        (((result).pos).z = 0.0);
        (((result).pos).w = 1.0);
        ((result).uv = float2(((x + ((instanceBuffer[instanceId]).colorIndex).w) / float(8)), (float(1) - y)));
        ((result).color = ((instanceBuffer[instanceId]).colorIndex).rgb);
        return result;
    };

    Vertex_Shader(constant Uniforms_RootConstant& RootConstant, constant InstanceData* instanceBuffer) :
        RootConstant(RootConstant), instanceBuffer(instanceBuffer)
    {}
};
struct main_output
{
    float4 SV_Position [[position]];
    float3 COLOR0;
    float2 TEXCOORD0;
};
struct ArgBuffer1
{
    constant Vertex_Shader::InstanceData* instanceBuffer [[id(0)]];
};

vertex main_output stageMain(
    uint vertexId [[vertex_id]],
    uint instanceId [[instance_id]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]],
    constant Vertex_Shader::Uniforms_RootConstant& RootConstant)
{
    uint vertexId0;
    vertexId0 = vertexId;
    uint instanceId0;
    instanceId0 = instanceId;
    Vertex_Shader main(RootConstant, argBuffer1.instanceBuffer);
    Vertex_Shader::VSOutput result = main.main(vertexId0, instanceId0);
    main_output output;
    output.SV_Position = result.pos;
    output.COLOR0 = result.color;
    output.TEXCOORD0 = result.uv;
    return output;
}
