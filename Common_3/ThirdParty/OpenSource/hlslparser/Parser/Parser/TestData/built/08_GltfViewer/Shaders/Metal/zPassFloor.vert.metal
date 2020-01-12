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
    struct VSInput
    {
        float3 Position;
        float2 TexCoord;
    };
    struct PsIn
    {
        float4 Position;
    };
    PsIn main(VSInput input)
    {
        PsIn output;
        float4 inPos = float4(float3(((input).Position).xyz), 1.0);
        ((output).Position = ((ShadowUniformBuffer.ViewProjMat)*(((cbPerProp.world)*(inPos)))));
        return output;
    };

    Vertex_Shader(constant Uniforms_ShadowUniformBuffer& ShadowUniformBuffer, constant Uniforms_cbPerProp& cbPerProp) :
        ShadowUniformBuffer(ShadowUniformBuffer), cbPerProp(cbPerProp)
    {}
};

struct main_input
{
    float3 POSITION [[attribute(0)]];
    float2 TEXCOORD0 [[attribute(1)]];
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
    Vertex_Shader::VSInput input0;
    input0.Position = inputData.POSITION;
    input0.TexCoord = inputData.TEXCOORD0;
    Vertex_Shader main(argBuffer1.ShadowUniformBuffer, argBuffer3.cbPerProp);
    Vertex_Shader::PsIn result = main.main(input0);
    main_output output;
    output.SV_Position = result.Position;
    return output;
}
