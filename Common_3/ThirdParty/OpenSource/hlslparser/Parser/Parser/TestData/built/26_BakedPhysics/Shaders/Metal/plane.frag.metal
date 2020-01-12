#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct VSOutput
    {
        float4 Position;
        float2 TexCoord;
    };
    float4 main(VSOutput input)
    {
        float tol = 0.0025000000;
        float res = 0.05;
        float4 backgroundColor = float4(0.49, 0.64000000, 0.68, 1.0);
        float4 lineColor = float4(0.39, 0.41, 0.37, 1.0);
        float4 originColor = float4(0.0, 0.0, 0.0, 1.0);
        if (abs((((input).TexCoord).x - 0.5)) <= tol && (abs((((input).TexCoord).y - 0.5)) <= tol))
        {
            return originColor;
        }
        else if (((((fmod(((input).TexCoord).x, res) >= (res - tol)) || (fmod(((input).TexCoord).x, res) < tol)) || (fmod(((input).TexCoord).y, res) >= (res - tol))) || (fmod(((input).TexCoord).y, res) < tol)))
        {
            return lineColor;
        }
        else
        {
            return backgroundColor;
        }
    };

    Fragment_Shader()
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float2 TEXCOORD;
};


fragment float4 stageMain(
	main_input inputData [[stage_in]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.TexCoord = inputData.TEXCOORD;
    Fragment_Shader main;
    return main.main(input0);
}
