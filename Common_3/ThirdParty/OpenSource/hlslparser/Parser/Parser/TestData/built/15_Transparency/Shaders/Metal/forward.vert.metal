#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Material
    {
        float4 Color;
        float4 Transmission;
        float RefractionRatio;
        float Collimation;
        float2 Padding;
        uint TextureFlags;
        uint AlbedoTexID;
        uint MetallicTexID;
        uint RoughnessTexID;
        uint EmissiveTexID;
        uint3 Padding2;
    };
    struct ObjectInfo
    {
        float4x4 toWorld;
        float4x4 normalMat;
        uint matID;
    };
    struct Uniforms_DrawInfoRootConstant
    {
        uint baseInstance = uint(0);
    };
    constant Uniforms_DrawInfoRootConstant& DrawInfoRootConstant;
    struct Uniforms_ObjectUniformBlock
    {
        array<ObjectInfo, 128> objectInfo;
    };
    constant Uniforms_ObjectUniformBlock& ObjectUniformBlock;
    struct Uniforms_CameraUniform
    {
        float4x4 camViewProj;
        float4x4 camViewMat;
        float4 camClipInfo;
        float4 camPosition;
    };
    constant Uniforms_CameraUniform& CameraUniform;
    struct VSInput
    {
        float4 Position;
        float3 Normal;
        float2 UV;
    };
    struct VSOutput
    {
        float4 Position;
        float4 WorldPosition;
        float4 Normal;
        float4 UV;
        uint MatID;
    };
    VSOutput main(VSInput input, uint InstanceID)
    {
        VSOutput output;
        uint instanceID = (InstanceID + DrawInfoRootConstant.baseInstance);
        ((output).UV = ((input).UV).xyyy);
        ((output).Normal = normalize((((ObjectUniformBlock.objectInfo[instanceID]).normalMat)*(float4(((input).Normal).xyz, (float)0)))));
        ((output).WorldPosition = (((ObjectUniformBlock.objectInfo[instanceID]).toWorld)*((input).Position)));
        ((output).Position = ((CameraUniform.camViewProj)*((output).WorldPosition)));
        ((output).MatID = (ObjectUniformBlock.objectInfo[instanceID]).matID);
        return output;
    };

    Vertex_Shader(constant Uniforms_DrawInfoRootConstant& DrawInfoRootConstant, constant Uniforms_ObjectUniformBlock& ObjectUniformBlock, constant Uniforms_CameraUniform& CameraUniform) :
        DrawInfoRootConstant(DrawInfoRootConstant), ObjectUniformBlock(ObjectUniformBlock), CameraUniform(CameraUniform)
    {}
};

struct main_input
{
    float4 POSITION [[attribute(0)]];
    float3 NORMAL [[attribute(1)]];
    float2 TEXCOORD0 [[attribute(2)]];
};

struct main_output
{
    float4 SV_POSITION [[position]];
    float4 POSITION0;
    float4 NORMAL0;
    float4 TEXCOORD0;
    uint MAT_ID;
};
struct ArgBuffer0
{
    constant Vertex_Shader::Uniforms_DrawInfoRootConstant& DrawInfoRootConstant [[id(0)]];
};

struct ArgBuffer1
{
    constant Vertex_Shader::Uniforms_ObjectUniformBlock& ObjectUniformBlock [[id(0)]];
    constant Vertex_Shader::Uniforms_CameraUniform& CameraUniform [[id(1)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    uint InstanceID [[instance_id]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    uint InstanceID0;
    InstanceID0 = InstanceID;
    Vertex_Shader::VSInput input0;
    input0.Position = inputData.POSITION;
    input0.Normal = inputData.NORMAL;
    input0.UV = inputData.TEXCOORD0;
    Vertex_Shader main(DrawInfoRootConstant, argBuffer1.ObjectUniformBlock, argBuffer1.CameraUniform);
    Vertex_Shader::VSOutput result = main.main(input0, InstanceID0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.POSITION0 = result.WorldPosition;
    output.NORMAL0 = result.Normal;
    output.TEXCOORD0 = result.UV;
    output.MAT_ID = result.MatID;
    return output;
}
