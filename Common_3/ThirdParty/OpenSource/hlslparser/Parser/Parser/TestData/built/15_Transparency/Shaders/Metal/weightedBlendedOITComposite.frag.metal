#include <metal_stdlib>
using namespace metal;

inline void clip(float x) {
    if (x < 0.0) discard_fragment();
}
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
    float MaxComponent(float4 v)
    {
        return max((float)max((float)max((float)v.x,(float)v.y),(float)v.z),(float)v.w);
    };
    float4 main(VSOutput input)
    {
        float revealage = (RevealageTexture.sample(PointSampler, ((input).UV).xy)).r;
        clip(((1.0 - revealage) - 0.000010000000));
        float4 accumulation = AccumulationTexture.sample(PointSampler, ((input).UV).xy);
        if (isinf(MaxComponent(abs(accumulation))))
        {
            ((accumulation).rgb = float3(accumulation.a));
        }
        float3 averageColor = ((accumulation).rgb / float3(max((float)accumulation.a,(float)0.000010000000)));
        return float4(averageColor, (1.0 - revealage));
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
