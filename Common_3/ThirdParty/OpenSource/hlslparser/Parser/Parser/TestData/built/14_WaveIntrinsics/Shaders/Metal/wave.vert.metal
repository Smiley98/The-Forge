#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Uniforms_SceneConstantBuffer
    {
        float4x4 orthProjMatrix;
        float2 mousePosition;
        float2 resolution;
        float time;
        uint renderMode;
        uint laneSize;
        uint padding;
    };
    constant Uniforms_SceneConstantBuffer& SceneConstantBuffer;
    struct PSInput
    {
        float4 position;
        float4 color;
    };
    PSInput main(float3 position, float4 color)
    {
        PSInput result;
        ((result).position = ((SceneConstantBuffer.orthProjMatrix)*(float4(position, 1.0))));
        ((result).color = color);
        return result;
    };

    Vertex_Shader(constant Uniforms_SceneConstantBuffer& SceneConstantBuffer) :
        SceneConstantBuffer(SceneConstantBuffer)
    {}
};

struct main_input
{
    float3 POSITION [[attribute(0)]];
    float4 COLOR [[attribute(1)]];
};

struct main_output
{
    float4 SV_POSITION [[position]];
    float4 COLOR;
};
struct ArgBuffer1
{
    constant Vertex_Shader::Uniforms_SceneConstantBuffer& SceneConstantBuffer [[id(0)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    float3 position0 = inputData.POSITION;
    float4 color0 = inputData.COLOR;
    Vertex_Shader main(argBuffer1.SceneConstantBuffer);
    Vertex_Shader::PSInput result = main.main(position0, color0);
    main_output output;
    output.SV_POSITION = result.position;
    output.COLOR = result.color;
    return output;
}
