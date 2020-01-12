#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
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
    struct Uniforms_LightUniformBlock
    {
        float4x4 lightViewProj;
        float4 lightDirection;
        float4 lightColor;
    };
    constant Uniforms_LightUniformBlock& LightUniformBlock;
    struct Uniforms_CameraUniform
    {
        float4x4 camViewProj;
        float4x4 camViewMat;
        float4 camClipInfo;
        float4 camPosition;
    };
    constant Uniforms_CameraUniform& CameraUniform;
    struct Uniforms_MaterialUniform
    {
        array<Material, 128> Materials;
    };
    constant Uniforms_MaterialUniform& MaterialUniform;
    array<texture2d<float>, 8> MaterialTextures;
    sampler LinearSampler;
    texture2d<float> VSM;
    sampler VSMSampler;
    float ChebyshevUpperBound(float2 moments, float t)
    {
        float p = float(t <= (moments).x);
        float variance = ((moments).y - ((moments).x * (moments).x));
        (variance = max((float)variance,(float)0.0010000000));
        float d = (t - (moments).x);
        float pMax = (variance / (variance + (d * d)));
        return max((float)p,(float)pMax);
    };
    float3 ShadowContribution(float2 shadowMapPos, float distanceToLight)
    {
        float2 moments = (VSM.sample(VSMSampler, shadowMapPos)).xy;
        float3 shadow = float3(ChebyshevUpperBound(moments, distanceToLight));
        return shadow;
    };
    float4 Shade(uint matID, float2 uv, float3 worldPos, float3 normal)
    {
        float nDotl = dot(normal, (-(LightUniformBlock.lightDirection).xyz));
        Material mat = MaterialUniform.Materials[matID];
        float4 matColor = ((((mat).TextureFlags & uint(1)))?(MaterialTextures[(mat).AlbedoTexID].sample(LinearSampler, uv)):((mat).Color));
        float3 viewVec = normalize((worldPos - (CameraUniform.camPosition).xyz));
        if (nDotl < 0.05)
        {
            (nDotl = 0.05);
        }
        float3 diffuse = (((LightUniformBlock.lightColor).xyz * (matColor).xyz) * float3(nDotl));
        float3 specular = ((LightUniformBlock.lightColor).xyz * float3(pow(saturate(dot(reflect((-(LightUniformBlock.lightDirection).xyz), normal), viewVec)), 10.0)));
        float3 finalColor = saturate((diffuse + (specular * float3(0.5))));
        float4 shadowMapPos = ((LightUniformBlock.lightViewProj)*(float4(worldPos, 1.0)));
        ((shadowMapPos).y = (-(shadowMapPos).y));
        ((shadowMapPos).xy = (((shadowMapPos).xy + float2(1.0)) * float2(0.5)));
        if (clamp((shadowMapPos).x, 0.010000000, 0.99) == (shadowMapPos).x && (clamp((shadowMapPos).y, 0.010000000, 0.99) == (shadowMapPos).y) && ((shadowMapPos).z > 0.0))
        {
            float3 lighting = ShadowContribution((shadowMapPos).xy, (shadowMapPos).z);
            (finalColor *= lighting);
        }
        return float4(finalColor, (matColor).a);
    };
    struct VSOutput
    {
        float4 Position;
        float4 WorldPosition;
        float4 Normal;
        float4 UV;
        uint MatID;
    };
    struct PSOutput
    {
        float4 Accumulation;
        float4 Modulation;
    };
    float WeightFunction(float alpha, float depth)
    {
        float tmp = (1.0 - (depth * 0.99));
        (tmp *= ((tmp * tmp) * 10000.0));
        return clamp((alpha * tmp), 0.0010000000, 150.0);
    };
    PSOutput main(VSOutput input)
    {
        PSOutput output;
        float3 transmission = ((MaterialUniform.Materials[(input).MatID]).Transmission).xyz;
        float collimation = (MaterialUniform.Materials[(input).MatID]).Collimation;
        float4 finalColor = Shade((input).MatID, ((input).UV).xy, ((input).WorldPosition).xyz, normalize(((input).Normal).xyz));
        float d = (((input).Position).z / ((input).Position).w);
        float4 premultipliedColor = float4(((finalColor).rgb * float3(finalColor.a)), (finalColor).a);
        float coverage = (finalColor).a;
        (((output).Modulation).rgb = (float3(coverage) * (float3(1.0) - transmission)));
        (coverage *= (1.0 - ((((transmission).r + (transmission).g) + (transmission).b) * (1.0 / 3.0))));
        float w = WeightFunction(coverage, d);
        ((output).Accumulation = (float4((premultipliedColor).rgb, coverage) * float4(w)));
        (((output).Modulation).a = 0.0);
        return output;
    };

    Fragment_Shader(constant Uniforms_LightUniformBlock& LightUniformBlock, constant Uniforms_CameraUniform& CameraUniform, constant Uniforms_MaterialUniform& MaterialUniform, array<texture2d<float>, 8> MaterialTextures, sampler LinearSampler, texture2d<float> VSM, sampler VSMSampler) :
        LightUniformBlock(LightUniformBlock), CameraUniform(CameraUniform), MaterialUniform(MaterialUniform), MaterialTextures(MaterialTextures), LinearSampler(LinearSampler), VSM(VSM), VSMSampler(VSMSampler)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 POSITION0;
    float4 NORMAL0;
    float4 TEXCOORD0;
    uint MAT_ID;
};

struct main_output
{
    float4 SV_Target0 [[color(0)]];
    float4 SV_Target1 [[color(1)]];
};
struct ArgBuffer0
{
    sampler LinearSampler [[id(0)]];
    texture2d<float> VSM [[id(1)]];
    sampler VSMSampler [[id(2)]];
    array<texture2d<float>, 8> MaterialTextures [[id(100)]];
};

struct ArgBuffer1
{
    constant Fragment_Shader::Uniforms_CameraUniform& CameraUniform [[id(1)]];
    constant Fragment_Shader::Uniforms_MaterialUniform& MaterialUniform [[id(2)]];
    constant Fragment_Shader::Uniforms_LightUniformBlock& LightUniformBlock [[id(3)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.WorldPosition = inputData.POSITION0;
    input0.Normal = inputData.NORMAL0;
    input0.UV = inputData.TEXCOORD0;
    input0.MatID = inputData.MAT_ID;
    Fragment_Shader main(argBuffer1.LightUniformBlock, argBuffer1.CameraUniform, argBuffer1.MaterialUniform, argBuffer0.MaterialTextures, argBuffer0.LinearSampler, argBuffer0.VSM, argBuffer0.VSMSampler);
    Fragment_Shader::PSOutput result = main.main(input0);
    main_output output;
    output.SV_Target0 = result.Accumulation;
    output.SV_Target1 = result.Modulation;
    return output;
}
