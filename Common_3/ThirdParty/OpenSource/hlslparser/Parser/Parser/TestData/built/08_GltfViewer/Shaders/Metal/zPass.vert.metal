#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Uniforms_ShadowUniformBuffer
    {
        float4x4 ViewProjMat;
    };
    constant Uniforms_ShadowUniformBuffer& ShadowUniformBuffer;
    struct Uniforms_cbPerProp
    {
        float4x4 world;
        float4x4 InvTranspose;
        int unlit;
        int hasAlbedoMap;
        int hasNormalMap;
        int hasMetallicRoughnessMap;
        int hasAOMap;
        int hasEmissiveMap;
        float4 centerOffset;
        float4 posOffset;
        float2 uvOffset;
        float2 uvScale;
        float posScale;
        float padding0;
    };
    constant Uniforms_cbPerProp& cbPerProp;
    struct VsIn
    {
        uint4 position;
        int4 normal;
        uint2 texCoord;
        uint4 baseColor;
        uint2 metallicRoughness;
        uint2 alphaSettings;
    };
    struct PsIn
    {
        float4 Position;
    };
    PsIn main(VsIn input)
    {
        PsIn output;
        float unormPositionScale = (float((float)(1 << 16)) - 1.0);
        float4 inPos = (float4(((float3((float3)((input).position).xyz) / float3(unormPositionScale)) * float3(cbPerProp.posScale)), 1.0) + cbPerProp.posOffset);
        (inPos += cbPerProp.centerOffset);
        float4 worldPosition = ((cbPerProp.world)*(inPos));
        ((worldPosition).xyz /= float3(cbPerProp.posScale));
        ((output).Position = ((ShadowUniformBuffer.ViewProjMat)*(worldPosition)));
        return output;
    };

    Vertex_Shader(constant Uniforms_ShadowUniformBuffer& ShadowUniformBuffer, constant Uniforms_cbPerProp& cbPerProp) :
        ShadowUniformBuffer(ShadowUniformBuffer), cbPerProp(cbPerProp)
    {}
};

struct main_input
{
    uint4 POSITION [[attribute(0)]];
    int4 NORMAL [[attribute(1)]];
    uint2 TEXCOORD0 [[attribute(2)]];
    uint4 COLOR [[attribute(3)]];
    uint2 TEXCOORD1 [[attribute(4)]];
    uint2 TEXCOORD2 [[attribute(5)]];
};

struct main_output
{
    float4 SV_Position [[position]];
};
struct ArgBuffer1
{
    constant Vertex_Shader::Uniforms_ShadowUniformBuffer& ShadowUniformBuffer [[id(2)]];
};

struct ArgBuffer3
{
    constant Vertex_Shader::Uniforms_cbPerProp& cbPerProp [[id(1)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]],
    constant ArgBuffer3& argBuffer3 [[buffer(3)]])
{
    Vertex_Shader::VsIn input0;
    input0.position = inputData.POSITION;
    input0.normal = inputData.NORMAL;
    input0.texCoord = inputData.TEXCOORD0;
    input0.baseColor = inputData.COLOR;
    input0.metallicRoughness = inputData.TEXCOORD1;
    input0.alphaSettings = inputData.TEXCOORD2;
    Vertex_Shader main(argBuffer1.ShadowUniformBuffer, argBuffer3.cbPerProp);
    Vertex_Shader::PsIn result = main.main(input0);
    main_output output;
    output.SV_Position = result.Position;
    return output;
}
