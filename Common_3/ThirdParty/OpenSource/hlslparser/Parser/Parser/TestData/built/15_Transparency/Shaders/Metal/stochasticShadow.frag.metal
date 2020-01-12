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
    float2 ComputeMoments(float depth)
    {
        float2 moments;
        ((moments).x = depth);
        float2 pd = float2(dfdx(depth), dfdy(depth));
        ((moments).y = ((depth * depth) + (0.25 * dot(pd, pd))));
        return moments;
    };
    float hash(float3 p)
    {
        (p = fract(((p * float3(0.31830990)) + float3(0.1))));
        (p *= float3(17.0));
        return fract(((((p).x * (p).y) * (p).z) * (((p).x + (p).y) + (p).z)));
    };
    float noise(float3 x)
    {
        float3 p = floor(x);
        float3 f = fract(x);
        (f = ((f * f) * (float3(3.0) - (float3(2.0) * f))));
        return mix(mix(mix(hash((p + float3((float)0, (float)0, (float)0))), hash((p + float3((float)1, (float)0, (float)0))), (f).x), mix(hash((p + float3((float)0, (float)1, (float)0))), hash((p + float3((float)1, (float)1, (float)0))), (f).x), (f).y), mix(mix(hash((p + float3((float)0, (float)0, (float)1))), hash((p + float3((float)1, (float)0, (float)1))), (f).x), mix(hash((p + float3((float)0, (float)1, (float)1))), hash((p + float3((float)1, (float)1, (float)1))), (f).x), (f).y), (f).z);
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
        float4 RedVarianceShadowMap;
        float4 GreenVarianceShadowMap;
        float4 BlueVarianceShadowMap;
    };
    PSOutput main(VSOutput input)
    {
        Material mat = MaterialUniform.Materials[(input).MatID];
        float4 matColor = ((((mat).TextureFlags & uint(1)))?(MaterialTextures[(mat).AlbedoTexID].sample(LinearSampler, ((input).UV).xy)):((mat).Color));
        float3 p = (float4(1.0) - (mat).Transmission * float4(matColor.a)).xyz;
        float e = noise((((input).WorldPosition).xyz * float3(10000.0)));
        float3 normal = normalize(((input).Normal).xyz);
        float3 ld = float3(CameraUniform.camViewMat[2][0], CameraUniform.camViewMat[2][1], CameraUniform.camViewMat[2][2]);
        float s = saturate((((mat).RefractionRatio - 1.0) * 0.5));
        float g = ((2.0 * saturate((1.0 - pow(dot(normalize(normal), (-(ld).xyz)), ((128.0 * s) * s))))) - 1.0);
        (p = min((float3)float3(1.0),(float3)float3(1.0 + (g * pow(s, 0.2))) * p));
        PSOutput output;
        float2 moments = ComputeMoments(((input).Position).z);
        ((output).RedVarianceShadowMap = max((float2)moments,(float2)float2(e > (p).r)));
        ((output).GreenVarianceShadowMap = max((float2)moments,(float2)float2(e > (p).g)));
        ((output).BlueVarianceShadowMap = max((float2)moments,(float2)float2(e > (p).b)));
        return output;
    };

    Fragment_Shader(constant Uniforms_CameraUniform& CameraUniform, constant Uniforms_MaterialUniform& MaterialUniform, array<texture2d<float>, 8> MaterialTextures, sampler LinearSampler) :
        CameraUniform(CameraUniform), MaterialUniform(MaterialUniform), MaterialTextures(MaterialTextures), LinearSampler(LinearSampler)
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
    float4 SV_Target2 [[color(2)]];
};
struct ArgBuffer0
{
    sampler LinearSampler [[id(0)]];
    array<texture2d<float>, 8> MaterialTextures [[id(100)]];
};

struct ArgBuffer1
{
    constant Fragment_Shader::Uniforms_CameraUniform& CameraUniform [[id(1)]];
    constant Fragment_Shader::Uniforms_MaterialUniform& MaterialUniform [[id(2)]];
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
    Fragment_Shader main(argBuffer1.CameraUniform, argBuffer1.MaterialUniform, argBuffer0.MaterialTextures, argBuffer0.LinearSampler);
    Fragment_Shader::PSOutput result = main.main(input0);
    main_output output;
    output.SV_Target0 = result.RedVarianceShadowMap;
    output.SV_Target1 = result.GreenVarianceShadowMap;
    output.SV_Target2 = result.BlueVarianceShadowMap;
    return output;
}
