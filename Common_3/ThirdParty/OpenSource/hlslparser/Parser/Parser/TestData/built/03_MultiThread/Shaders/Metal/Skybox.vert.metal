#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Uniforms_uniformBlock
    {
        float4x4 mvp;
    };
    constant Uniforms_uniformBlock& uniformBlock;
    struct VSOutput
    {
        float4 Position;
        float4 TexCoord;
    };
    VSOutput main(float4 Position)
    {
        VSOutput result;
        float4 p = float4(((Position).x * float(9)), ((Position).y * float(9)), ((Position).z * float(9)), (float)1.0);
        (p = ((uniformBlock.mvp)*(p)));
        ((result).Position = (p).xyww);
        ((result).TexCoord = float4((Position).x, (Position).y, (Position).z, (Position).w));
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
    float4 TEXCOORD;
};
struct ArgBuffer1
{
    constant Vertex_Shader::Uniforms_uniformBlock& uniformBlock [[id(0)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    float4 Position0 = inputData.POSITION;
    Vertex_Shader main(argBuffer1.uniformBlock);
    Vertex_Shader::VSOutput result = main.main(Position0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.TEXCOORD = result.TexCoord;
    return output;
}
