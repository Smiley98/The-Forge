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
    texture2d<float> RevealageTexture;
    float4 main(VSOutput input)
    {
        float revealage = float(1.0);
        float additiveness = float(0.0);
        float4 accum = float4((float)0.0, (float)0.0, (float)0.0, (float)0.0);
        float4 temp = RevealageTexture.sample(PointSampler, ((input).UV).xy);
        (revealage = (temp).r);
        (additiveness = (temp).w);
        (accum = AccumulationTexture.sample(PointSampler, ((input).UV).xy));
        float3 average_color = ((accum).rgb / float3(max((float)accum.a,(float)float(0.000010000000))));
        float emissive_amplifier = (additiveness * 8.0);
        (emissive_amplifier = mix((emissive_amplifier * float(0.25)), emissive_amplifier, revealage));
        (emissive_amplifier += saturate(((float(1.0) - revealage) * float(2.0))));
        (average_color *= float3(max((float)emissive_amplifier,(float)float(1.0))));
        if (any(float3(isinf((accum).rgb))))
        {
            (average_color = float3(100.0));
        }
        return float4(average_color, (float(1.0) - revealage));
    };

    Fragment_Shader(sampler PointSampler, texture2d<float> AccumulationTexture, texture2d<float> RevealageTexture) :
        PointSampler(PointSampler), AccumulationTexture(AccumulationTexture), RevealageTexture(RevealageTexture)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 Texcoord0;
};

struct main_output { float4 tmp [[color(0)]]; };

struct ArgBuffer0
{
    sampler PointSampler [[id(0)]];
    texture2d<float> AccumulationTexture [[id(0)]];
    texture2d<float> RevealageTexture [[id(1)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.UV = inputData.Texcoord0;
    Fragment_Shader main(argBuffer0.PointSampler, argBuffer0.AccumulationTexture, argBuffer0.RevealageTexture);
    main_output output; output.tmp = main.main(input0);
    return output;
}
