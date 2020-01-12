#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct VSOutput
    {
        float4 Position;
        float4 UV;
    };
    sampler PointSampler;
    texture2d<float> AccumulationTexture;
    texture2d<float> ModulationTexture;
    texture2d<float> BackgroundTexture;
    float MaxComponent(float3 v)
    {
        return max((float)max((float)v.x,(float)v.y),(float)v.z);
    };
    float MinComponent(float3 v)
    {
        return min((float)min((float)v.x,(float)v.y),(float)v.z);
    };
    float4 main(VSOutput input)
    {
        float4 modulationAndDiffusion = ModulationTexture.sample(PointSampler, ((input).UV).xy);
        float3 modulation = (modulationAndDiffusion).rgb;
        if (MinComponent(modulation) == 1.0)
        {
            return BackgroundTexture.sample(PointSampler, ((input).UV).xy);
        }
        float4 accumulation = AccumulationTexture.sample(PointSampler, ((input).UV).xy);
        if (isinf((accumulation).a))
        {
            ((accumulation).a = MaxComponent((accumulation).xyz));
        }
        if (isinf(MaxComponent((accumulation).xyz)))
        {
            (accumulation = float4(1.0));
        }
        const float epsilon = 0.0010000000;
        ((accumulation).rgb *= (float3(0.5) + (max((float3)modulation,(float3)float3(epsilon)) / float3(2.0 * max((float)epsilon,(float)MaxComponent(modulation))))));
        float2 delta = float2(0.0);
        float3 background = float3(0.0);
        (background = (BackgroundTexture.sample(PointSampler, ((input).UV).xy, level(0.0))).rgb);
        return float4(((background * modulation) + (((float3(1.0) - modulation) * (accumulation).rgb) / float3(max((float)accumulation.a,(float)0.000010000000)))), 1.0);
    };

    Fragment_Shader(sampler PointSampler, texture2d<float> AccumulationTexture, texture2d<float> ModulationTexture, texture2d<float> BackgroundTexture) :
        PointSampler(PointSampler), AccumulationTexture(AccumulationTexture), ModulationTexture(ModulationTexture), BackgroundTexture(BackgroundTexture)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 TEXCOORD0;
};

struct main_output { float4 tmp [[color(0)]]; };

struct ArgBuffer0
{
    sampler PointSampler [[id(0)]];
    texture2d<float> AccumulationTexture [[id(0)]];
    texture2d<float> ModulationTexture [[id(1)]];
    texture2d<float> BackgroundTexture [[id(2)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.UV = inputData.TEXCOORD0;
    Fragment_Shader main(argBuffer0.PointSampler, argBuffer0.AccumulationTexture, argBuffer0.ModulationTexture, argBuffer0.BackgroundTexture);
    main_output output; output.tmp = main.main(input0);
    return output;
}
