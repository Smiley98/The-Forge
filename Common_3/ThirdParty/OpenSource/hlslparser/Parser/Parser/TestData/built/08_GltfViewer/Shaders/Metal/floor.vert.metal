#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Uniforms_cbPerFrame
    {
        float4x4 worldMat;
        float4x4 projViewMat;
        float4 screenSize;
    };
    constant Uniforms_cbPerFrame& cbPerFrame;
    struct VSInput
    {
        float3 Position;
        float2 TexCoord;
    };
    struct VSOutput
    {
        float4 Position;
        float3 WorldPos;
        float2 TexCoord;
    };
    VSOutput main(VSInput input)
    {
        VSOutput Out;
        float4 worldPos = float4((input).Position, 1.0);
        (worldPos = ((cbPerFrame.worldMat)*(worldPos)));
        ((Out).Position = ((cbPerFrame.projViewMat)*(worldPos)));
        ((Out).WorldPos = (worldPos).xyz);
        ((Out).TexCoord = (input).TexCoord);
        return Out;
    };

    Vertex_Shader(constant Uniforms_cbPerFrame& cbPerFrame) :
        cbPerFrame(cbPerFrame)
    {}
};

struct main_input
{
    float3 POSITION [[attribute(0)]];
    float2 TEXCOORD0 [[attribute(1)]];
};

struct main_output
{
    float4 SV_POSITION [[position]];
    float3 POSITION;
    float2 TEXCOORD;
};
struct ArgBuffer1
{
    constant Vertex_Shader::Uniforms_cbPerFrame& cbPerFrame [[id(3)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Vertex_Shader::VSInput input0;
    input0.Position = inputData.POSITION;
    input0.TexCoord = inputData.TEXCOORD0;
    Vertex_Shader main(argBuffer1.cbPerFrame);
    Vertex_Shader::VSOutput result = main.main(input0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.POSITION = result.WorldPos;
    output.TEXCOORD = result.TexCoord;
    return output;
}
