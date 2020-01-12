#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct VSInput
    {
        float3 Position;
        float2 Uv;
    };
    struct VSOutput
    {
        float4 Position;
        float2 uv;
    };
    VSOutput main(VSInput input)
    {
        VSOutput result;
        ((result).Position = float4((input).Position, (float)1.0));
        ((result).uv = (input).Uv);
        return result;
    };

    Vertex_Shader()
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
    float2 TEXCOORD0;
};

vertex main_output stageMain(
	main_input inputData [[stage_in]])
{
    Vertex_Shader::VSInput input0;
    input0.Position = inputData.POSITION;
    input0.Uv = inputData.TEXCOORD0;
    Vertex_Shader main;
    Vertex_Shader::VSOutput result = main.main(input0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.TEXCOORD0 = result.uv;
    return output;
}
