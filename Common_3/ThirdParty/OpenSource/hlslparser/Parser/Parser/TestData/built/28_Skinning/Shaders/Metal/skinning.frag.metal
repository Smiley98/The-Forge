#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct VSOutput
    {
        float4 Position;
        float3 Normal;
        float2 UV;
    };
    texture2d<float> DiffuseTexture;
    sampler DefaultSampler;
    float4 main(VSOutput input)
    {
        float nDotl = saturate(((dot(normalize((input).Normal), float3((float)0, (float)1, (float)0)) + 1.0) * 0.5));
        float3 color = (DiffuseTexture.sample(DefaultSampler, (input).UV)).rgb;
        return float4((color * float3(nDotl)), 1.0);
    };

    Fragment_Shader(texture2d<float> DiffuseTexture, sampler DefaultSampler) :
        DiffuseTexture(DiffuseTexture), DefaultSampler(DefaultSampler)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float3 NORMAL;
    float2 TEXCOORD0;
};

struct ArgBuffer0
{
    texture2d<float> DiffuseTexture [[id(0)]];
    sampler DefaultSampler [[id(0)]];
};

fragment float4 stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.Normal = inputData.NORMAL;
    input0.UV = inputData.TEXCOORD0;
    Fragment_Shader main(argBuffer0.DiffuseTexture, argBuffer0.DefaultSampler);
    return main.main(input0);
}
