#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Uniforms_uniformBlock
    {
        float4x4 vpMatrix;
        float4x4 modelMatrix;
    };
    constant Uniforms_uniformBlock& uniformBlock;
    struct Uniforms_boneMatrices
    {
        array<float4x4, 1024> boneMatrix;
    };
    constant Uniforms_boneMatrices& boneMatrices;
    struct Uniforms_boneOffsetMatrices
    {
        array<float4x4, 1024> boneOffsetMatrix;
    };
    constant Uniforms_boneOffsetMatrices& boneOffsetMatrices;
    struct VSInput
    {
        float3 Position;
        float3 Normal;
        float2 UV;
        float4 BoneWeights;
        uint4 BoneIndices;
    };
    struct VSOutput
    {
        float4 Position;
        float3 Normal;
        float2 UV;
    };
    VSOutput main(VSInput input)
    {
        VSOutput result;
        float4x4 boneTransform = (((boneMatrices.boneMatrix[(input).BoneIndices[0]])*(boneOffsetMatrices.boneOffsetMatrix[(input).BoneIndices[0]])) * (float4x4)(input).BoneWeights[0]);
        (boneTransform += (((boneMatrices.boneMatrix[(input).BoneIndices[1]])*(boneOffsetMatrices.boneOffsetMatrix[(input).BoneIndices[1]])) * (float4x4)(input).BoneWeights[1]));
        (boneTransform += (((boneMatrices.boneMatrix[(input).BoneIndices[2]])*(boneOffsetMatrices.boneOffsetMatrix[(input).BoneIndices[2]])) * (float4x4)(input).BoneWeights[2]));
        (boneTransform += (((boneMatrices.boneMatrix[(input).BoneIndices[3]])*(boneOffsetMatrices.boneOffsetMatrix[(input).BoneIndices[3]])) * (float4x4)(input).BoneWeights[3]));
        ((result).Position = ((boneTransform)*(float4((input).Position, 1.0))));
        ((result).Position = ((uniformBlock.modelMatrix)*((result).Position)));
        ((result).Position = ((uniformBlock.vpMatrix)*((result).Position)));
        ((result).Normal = normalize((((uniformBlock.modelMatrix)*(float4((input).Normal, 0.0)))).xyz));
        ((result).UV = (input).UV);
        return result;
    };

    Vertex_Shader(constant Uniforms_uniformBlock& uniformBlock, constant Uniforms_boneMatrices& boneMatrices, constant Uniforms_boneOffsetMatrices& boneOffsetMatrices) :
        uniformBlock(uniformBlock), boneMatrices(boneMatrices), boneOffsetMatrices(boneOffsetMatrices)
    {}
};

struct main_input
{
    float3 POSITION [[attribute(0)]];
    float3 NORMAL [[attribute(1)]];
    float2 TEXCOORD0 [[attribute(2)]];
    float4 TEXCOORD1 [[attribute(3)]];
    uint4 TEXCOORD2 [[attribute(4)]];
};

struct main_output
{
    float4 SV_POSITION [[position]];
    float3 NORMAL;
    float2 TEXCOORD0;
};
struct ArgBuffer0
{
    constant Vertex_Shader::Uniforms_boneOffsetMatrices& boneOffsetMatrices [[id(2)]];
};

struct ArgBuffer3
{
    constant Vertex_Shader::Uniforms_uniformBlock& uniformBlock [[id(0)]];
    constant Vertex_Shader::Uniforms_boneMatrices& boneMatrices [[id(1)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer3& argBuffer3 [[buffer(3)]])
{
    Vertex_Shader::VSInput input0;
    input0.Position = inputData.POSITION;
    input0.Normal = inputData.NORMAL;
    input0.UV = inputData.TEXCOORD0;
    input0.BoneWeights = inputData.TEXCOORD1;
    input0.BoneIndices = inputData.TEXCOORD2;
    Vertex_Shader main(argBuffer3.uniformBlock, argBuffer3.boneMatrices, argBuffer0.boneOffsetMatrices);
    Vertex_Shader::VSOutput result = main.main(input0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.NORMAL = result.Normal;
    output.TEXCOORD0 = result.UV;
    return output;
}
