#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Uniforms_uniformBlock
    {
        float4x4 projView;
        float3 camPos;
    };
    constant Uniforms_uniformBlock& uniformBlock;
    struct VSInput
    {
        float4 Position;
    };
    struct VSOutput
    {
        float4 Position;
        float3 pos;
    };
    VSOutput main(VSInput input)
    {
        VSOutput result;
        ((result).Position = ((uniformBlock.projView)*((input).Position)));
        ((result).Position = ((result).Position).xyww);
        ((result).pos = (input.Position).xyz);
        return result;
    };

    Vertex_Shader(constant Uniforms_uniformBlock& uniformBlock) :
        uniformBlock(uniformBlock)
    {}
};

struct main_input
{
    float4 POSITION [[attribute(0)]];
};

struct main_output
{
    float4 SV_POSITION [[position]];
    float3 POSITION;
};
struct ArgBuffer1
{
    constant Vertex_Shader::Uniforms_uniformBlock& uniformBlock [[id(0)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Vertex_Shader::VSInput input0;
    input0.Position = inputData.POSITION;
    Vertex_Shader main(argBuffer1.uniformBlock);
    Vertex_Shader::VSOutput result = main.main(input0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.POSITION = result.pos;
    return output;
}
