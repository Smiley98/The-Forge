#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct VSOutput
    {
        float4 Position;
        float4 Color;
    };
    VSOutput main(float2 Position, float4 Color)
    {
        VSOutput result;
        ((result).Position = float4((Position).x, (Position).y, 0.0, 1.0));
        ((result).Color = Color);
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
    float2 Position0 = inputData.POSITION;
    float4 Color0 = inputData.COLOR;
    Vertex_Shader main;
    Vertex_Shader::VSOutput result = main.main(Position0, Color0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.COLOR = result.Color;
    return output;
}
