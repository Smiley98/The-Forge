#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct VSOutput
    {
        float4 Position;
        float4 Color;
    };
    float4 main(VSOutput In)
    {
        return (In).Color;
    };

    Fragment_Shader()
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 COLOR;
};

struct main_output { float4 tmp [[color(0)]]; };


fragment main_output stageMain(
	main_input inputData [[stage_in]])
{
    Fragment_Shader::VSOutput In0;
    In0.Position = inputData.SV_POSITION;
    In0.Color = inputData.COLOR;
    Fragment_Shader main;
    main_output output; output.tmp = main.main(In0);
    return output;
}
