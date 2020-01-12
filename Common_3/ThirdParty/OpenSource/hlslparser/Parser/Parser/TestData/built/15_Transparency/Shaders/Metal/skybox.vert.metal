#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Uniforms_SkyboxUniformBlock
    {
        float4x4 vp;
    };
    constant Uniforms_SkyboxUniformBlock& SkyboxUniformBlock;
    struct VSOutput
    {
        float4 Position;
        float4 TexCoord;
    };
    VSOutput main(float4 Position)
    {
        VSOutput result;
        float4 p = float4((Position).xyz, (float)1.0);
        float4x4 m = SkyboxUniformBlock.vp;
        (p = ((m)*(p)));
        ((result).Position = (p).xyww);
        ((result).TexCoord = Position);
        return result;
    };

    Vertex_Shader(constant Uniforms_SkyboxUniformBlock& SkyboxUniformBlock) :
        SkyboxUniformBlock(SkyboxUniformBlock)
    {}
};

struct main_input
{
    float4 POSITION [[attribute(0)]];
};

struct main_output
{
    float4 SV_POSITION [[position]];
    float4 TEXCOORD;
};
struct ArgBuffer1
{
    constant Vertex_Shader::Uniforms_SkyboxUniformBlock& SkyboxUniformBlock [[id(0)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    float4 Position0 = inputData.POSITION;
    Vertex_Shader main(argBuffer1.SkyboxUniformBlock);
    Vertex_Shader::VSOutput result = main.main(Position0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.TEXCOORD = result.TexCoord;
    return output;
}
