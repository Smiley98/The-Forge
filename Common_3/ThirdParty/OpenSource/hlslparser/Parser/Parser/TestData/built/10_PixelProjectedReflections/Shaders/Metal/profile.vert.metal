#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct VSInput
    {
        float2 Position;
        float4 Color;
    };
    struct VSOutput
    {
        float4 Position;
        float4 Color;
    };
    VSOutput main(VSInput input)
    {
        VSOutput result;
        ((result).Position = float4(((input).Position).x, ((input).Position).y, 0.0, 1.0));
        ((result).Color = (input).Color);
        return result;
    };

    Vertex_Shader()
    {}
};

struct main_input
{
    float2 POSITION [[attribute(0)]];
    float4 COLOR [[attribute(1)]];
};

struct main_output
{
    float4 SV_POSITION [[position]];
    float4 COLOR;
};

vertex main_output stageMain(
	main_input inputData [[stage_in]])
{
    Vertex_Shader::VSInput input0;
    input0.Position = inputData.POSITION;
    input0.Color = inputData.COLOR;
    Vertex_Shader main;
    Vertex_Shader::VSOutput result = main.main(input0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.COLOR = result.Color;
    return output;
}
