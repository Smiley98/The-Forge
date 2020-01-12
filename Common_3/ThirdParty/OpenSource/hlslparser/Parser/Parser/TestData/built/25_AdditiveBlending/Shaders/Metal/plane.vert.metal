#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Uniforms_uniformBlock
    {
        float4x4 mvp;
        float4x4 toWorld;
    };
    constant Uniforms_uniformBlock& uniformBlock;
    struct VSInput
    {
        float4 Position;
        float2 TexCoord;
    };
    struct VSOutput
    {
        float4 Position;
        float2 TexCoord;
    };
    VSOutput main(VSInput input)
    {
        VSOutput result;
        float4x4 tempMat = ((uniformBlock.mvp)*(uniformBlock.toWorld));
        ((result).Position = ((tempMat)*((input).Position)));
        ((result).TexCoord = (input).TexCoord);
        return result;
    };

    Vertex_Shader(constant Uniforms_uniformBlock& uniformBlock) :
        uniformBlock(uniformBlock)
    {}
};

struct main_input
{
    float4 POSITION [[attribute(0)]];
    float2 TEXCOORD0 [[attribute(1)]];
};

struct main_output
{
    float4 SV_POSITION [[position]];
    float2 TEXCOORD;
};
struct ArgBuffer3
{
    constant Vertex_Shader::Uniforms_uniformBlock& uniformBlock [[id(0)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer3& argBuffer3 [[buffer(3)]])
{
    Vertex_Shader::VSInput input0;
    input0.Position = inputData.POSITION;
    input0.TexCoord = inputData.TEXCOORD0;
    Vertex_Shader main(argBuffer3.uniformBlock);
    Vertex_Shader::VSOutput result = main.main(input0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.TEXCOORD = result.TexCoord;
    return output;
}
