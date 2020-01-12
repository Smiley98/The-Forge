#include <metal_stdlib>
using namespace metal;

inline float3x3 matrix_ctor(float4x4 m)
{
        return float3x3(m[0].xyz, m[1].xyz, m[2].xyz);
}
struct Fragment_Shader
{
    struct Uniforms_cbObject
    {
        float4x4 worldMat;
        float roughness;
        float metalness;
        int pbrMaterials;
    };
    constant Uniforms_cbObject& cbObject;
    struct Uniforms_cbTextureRootConstants
    {
        uint albedoMap;
        uint normalMap;
        uint metallicMap;
        uint roughnessMap;
        uint aoMap;
    };
    constant Uniforms_cbTextureRootConstants& cbTextureRootConstants;
    sampler defaultSampler;
    array<texture2d<float>, 256> textureMaps;
    float3 reconstructNormal(float4 sampleNormal)
    {
        float3 tangentNormal;
        ((tangentNormal).xy = (((sampleNormal).rg * float2(2)) - float2(1)));
        ((tangentNormal).z = sqrt((float(1) - saturate(dot((tangentNormal).xy, (tangentNormal).xy)))));
        return tangentNormal;
    };
    float3 getNormalFromMap(float3 pos, float3 normal, float2 uv)
    {
        float3 tangentNormal = reconstructNormal(textureMaps[cbTextureRootConstants.normalMap].sample(defaultSampler, uv));
        float3 Q1 = dfdx(pos);
        float3 Q2 = dfdy(pos);
        float2 st1 = dfdx(uv);
        float2 st2 = dfdy(uv);
        float3 N = normalize(normal);
        float3 T = normalize(((Q1 * float3(st2.y)) - (Q2 * float3(st1.y))));
        float3 B = (-normalize(cross(N, T)));
        float3x3 TBN = float3x3(T, B, N);
        float3 res = ((tangentNormal)*(TBN));
        return res;
    };
    struct PsIn
    {
        float4 position;
        float3 normal;
        float3 pos;
        float2 uv;
    };
    struct PSOut
    {
        float4 albedo;
        float4 normal;
        float4 specular;
    };
    PSOut main(PsIn input)
    {
        PSOut Out;
        float alpha = (textureMaps[cbTextureRootConstants.albedoMap].sample(defaultSampler, (input).uv)).a;
        if (alpha < float(0.5))
        {
            discard_fragment();
        }
        float3 albedo = float3(0.5, 0.0, 0.0);
        float _roughness = cbObject.roughness;
        float _metalness = cbObject.metalness;
        float ao = 1.0;
        float3 N = normalize((input).normal);
        if (cbObject.pbrMaterials != (-1))
        {
            (N = getNormalFromMap((input).pos, (input).normal, (input).uv));
            (albedo = pow((textureMaps[cbTextureRootConstants.albedoMap].sample(defaultSampler, (input).uv)).rgb, float3((float)2.20000004, (float)2.20000004, (float)2.20000004)));
            (_metalness = (textureMaps[cbTextureRootConstants.metallicMap].sample(defaultSampler, (input).uv)).r);
            (_roughness = (textureMaps[cbTextureRootConstants.roughnessMap].sample(defaultSampler, (input).uv)).r);
            (ao = (textureMaps[cbTextureRootConstants.aoMap].sample(defaultSampler, (input).uv, level(float(0)))).r);
        }
        if (cbObject.pbrMaterials == 2)
        {
            (albedo = float3(0.7, 0.7, 0.7));
            (_roughness = cbObject.roughness);
            (_metalness = cbObject.metalness);
            (ao = 1.0);
        }
        ((Out).albedo = float4(albedo, alpha));
        ((Out).normal = float4(N, _metalness));
        ((Out).specular = float4(_roughness, ao, (input).uv));
        return Out;
    };

    Fragment_Shader(constant Uniforms_cbObject& cbObject, constant Uniforms_cbTextureRootConstants& cbTextureRootConstants, sampler defaultSampler, array<texture2d<float>, 256> textureMaps) :
        cbObject(cbObject), cbTextureRootConstants(cbTextureRootConstants), defaultSampler(defaultSampler), textureMaps(textureMaps)
    {}
};

struct main_input
{
    float4 SV_Position [[position]];
    float3 TEXCOORD0;
    float3 TEXCOORD1;
    float2 TEXCOORD2;
};

struct main_output
{
    float4 SV_Target0 [[color(0)]];
    float4 SV_Target1 [[color(1)]];
    float4 SV_Target2 [[color(2)]];
};
struct ArgBuffer0
{
    sampler defaultSampler [[id(2)]];
};

struct ArgBuffer3
{
    constant Fragment_Shader::Uniforms_cbObject& cbObject [[id(1)]];
};

struct ArgBuffer10
{
    array<texture2d<float>, 256> textureMaps [[id(3)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer3& argBuffer3 [[buffer(3)]],
    constant ArgBuffer10& argBuffer10 [[buffer(10)]],
    constant Fragment_Shader::Uniforms_cbTextureRootConstants& cbTextureRootConstants)
{
    Fragment_Shader::PsIn input0;
    input0.position = inputData.SV_Position;
    input0.normal = inputData.TEXCOORD0;
    input0.pos = inputData.TEXCOORD1;
    input0.uv = inputData.TEXCOORD2;
    Fragment_Shader main(argBuffer3.cbObject, cbTextureRootConstants, argBuffer0.defaultSampler, argBuffer10.textureMaps);
    Fragment_Shader::PSOut result = main.main(input0);
    main_output output;
    output.SV_Target0 = result.albedo;
    output.SV_Target1 = result.normal;
    output.SV_Target2 = result.specular;
    return output;
}
