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
        float4 Revealage;
    };
    struct Uniforms_WBOITSettings
    {
        float opacitySensitivity = float(3.0);
        float weightBias = float(5.0);
        float precisionScalar = float(10000.0);
        float maximumWeight = float(20.0);
        float maximumColorValue = float(1000.0);
        float additiveSensitivity = float(10.0);
        float emissiveSensitivityValue = 0.5;
    };
    constant Uniforms_WBOITSettings& WBOITSettings;
    void weighted_oit_process(thread float4(& accum), thread float(& revealage), thread float(& emissive_weight), float4 premultiplied_alpha_color, float raw_emissive_luminance, float view_depth, float current_camera_exposure)
    {
        float relative_emissive_luminance = (raw_emissive_luminance * current_camera_exposure);
        const float emissive_sensitivity = (float(1.0) / WBOITSettings.emissiveSensitivityValue);
        float clamped_emissive = saturate(relative_emissive_luminance);
        float clamped_alpha = saturate((premultiplied_alpha_color).a);
        float a = saturate(((clamped_alpha * WBOITSettings.opacitySensitivity) + (clamped_emissive * emissive_sensitivity)));
        const float canonical_near_z = float(0.5);
        const float canonical_far_z = float(300.0);
        float range = (canonical_far_z - canonical_near_z);
        float canonical_depth = saturate(((canonical_far_z / range) - ((canonical_far_z * canonical_near_z) / (view_depth * range))));
        float b = (float(1.0) - canonical_depth);
        float3 clamped_color = min((float3)premultiplied_alpha_color.rgb,(float3)float3(WBOITSettings.maximumColorValue));
        float w = (((WBOITSettings.precisionScalar * b) * b) * b);
        (w += WBOITSettings.weightBias);
        (w = min((float)w,(float)WBOITSettings.maximumWeight));
        (w *= ((a * a) * a));
        (accum = float4((clamped_color * float3(w)), w));
        (revealage = clamped_alpha);
        (emissive_weight = (saturate((relative_emissive_luminance * WBOITSettings.additiveSensitivity)) / 8.0));
    };
    PSOutput main(VSOutput input)
    {
        PSOutput output;
        float4 finalColor = Shade((input).MatID, ((input).UV).xy, ((input).WorldPosition).xyz, normalize(((input).Normal).xyz));
        float d = (((input).Position).z / ((input).Position).w);
        float4 premultipliedColor = float4(((finalColor).rgb * float3(finalColor.a)), (finalColor).a);
        float emissiveLuminance = dot((finalColor).rgb, float3(0.21260000, 0.71520000, 0.072200000));
        ((output).Revealage = float4(0.0));
        weighted_oit_process((output).Accumulation, ((output).Revealage).x, ((output).Revealage).w, premultipliedColor, emissiveLuminance, d, 1.0);
        return output;
    };

    Fragment_Shader(constant Uniforms_LightUniformBlock& LightUniformBlock, constant Uniforms_CameraUniform& CameraUniform, constant Uniforms_MaterialUniform& MaterialUniform, array<texture2d<float>, 8> MaterialTextures, sampler LinearSampler, texture2d<float> VSM, sampler VSMSampler, constant Uniforms_WBOITSettings& WBOITSettings) :
        LightUniformBlock(LightUniformBlock), CameraUniform(CameraUniform), MaterialUniform(MaterialUniform), MaterialTextures(MaterialTextures), LinearSampler(LinearSampler), VSM(VSM), VSMSampler(VSMSampler), WBOITSettings(WBOITSettings)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 POSITION;
    float4 NORMAL;
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
    constant Fragment_Shader::Uniforms_WBOITSettings& WBOITSettings [[id(4)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.WorldPosition = inputData.POSITION;
    input0.Normal = inputData.NORMAL;
    input0.UV = inputData.TEXCOORD0;
    input0.MatID = inputData.MAT_ID;
    Fragment_Shader main(argBuffer1.LightUniformBlock, argBuffer1.CameraUniform, argBuffer1.MaterialUniform, argBuffer0.MaterialTextures, argBuffer0.LinearSampler, argBuffer0.VSM, argBuffer0.VSMSampler, argBuffer1.WBOITSettings);
    Fragment_Shader::PSOutput result = main.main(input0);
    main_output output;
    output.SV_Target0 = result.Accumulation;
    output.SV_Target1 = result.Revealage;
    return output;
}
