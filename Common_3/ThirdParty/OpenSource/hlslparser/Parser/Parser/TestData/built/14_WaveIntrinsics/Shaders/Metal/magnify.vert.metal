#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct PSInput
    {
        float4 position;
        float2 uv;
    };
    PSInput main(float3 position, float2 uv)
    {
        PSInput result;
        ((result).position = float4(position, 1.0));
        ((result).uv = uv);
        return result;
    };

    Vertex_Shader()
    {}
};

struct main_input
{
    float3 POSITION [[attribute(0)]];
    float2 TEXCOORD [[attribute(1)]];
};

struct main_output
{
    float4 SV_POSITION [[position]];
    float2 TEXCOORD;
};

vertex main_output stageMain(
	main_input inputData [[stage_in]])
{
    float3 position0 = inputData.POSITION;
    float2 uv0 = inputData.TEXCOORD;
    Vertex_Shader main;
    Vertex_Shader::PSInput result = main.main(position0, uv0);
    main_output output;
    output.SV_POSITION = result.position;
    output.TEXCOORD = result.uv;
    return output;
}
