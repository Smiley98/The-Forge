#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct Uniforms_cbTextureRootConstants
    {
        uint albedoMap;
        uint normalMap;
        uint metallicMap;
        uint roughnessMap;
        uint aoMap;
    };
    constant Uniforms_cbTextureRootConstants& cbTextureRootConstants;
    sampler samplerLinear;
    array<texture2d<float>, 256> textureMaps;
    struct PsIn
    {
        float3 normal;
        float3 pos;
        float2 uv;
    };
    struct PSOut
    {
        float4 albedo;
        float4 normal;
    };
    PSOut main(PsIn input)
    {
        PSOut Out = (PSOut)0;
        float3 albedo = (textureMaps[cbTextureRootConstants.albedoMap].sample(samplerLinear, (input).uv)).rgb;
        float3 N = normalize((input).normal);
        ((Out).albedo = float4(albedo, (float)1));
        ((Out).normal = float4(N, (float)0));
        return Out;
    };

    Fragment_Shader(constant Uniforms_cbTextureRootConstants& cbTextureRootConstants, sampler samplerLinear, array<texture2d<float>, 256> textureMaps) :
        cbTextureRootConstants(cbTextureRootConstants), samplerLinear(samplerLinear), textureMaps(textureMaps)
    {}
};

struct main_input
{
    float3 TEXCOORD0;
    float3 TEXCOORD1;
    float2 TEXCOORD2;
};

struct main_output
{
    float4 SV_Target0 [[color(0)]];
    float4 SV_Target1 [[color(1)]];
};
struct ArgBuffer0
{
    sampler samplerLinear [[id(2)]];
    array<texture2d<float>, 256> textureMaps [[id(3)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant Fragment_Shader::Uniforms_cbTextureRootConstants& cbTextureRootConstants)
{
    Fragment_Shader::PsIn input0;
    input0.normal = inputData.TEXCOORD0;
    input0.pos = inputData.TEXCOORD1;
    input0.uv = inputData.TEXCOORD2;
    Fragment_Shader main(cbTextureRootConstants, argBuffer0.samplerLinear, argBuffer0.textureMaps);
    Fragment_Shader::PSOut result = main.main(input0);
    main_output output;
    output.SV_Target0 = result.albedo;
    output.SV_Target1 = result.normal;
    return output;
}
