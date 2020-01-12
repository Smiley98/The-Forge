#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    texturecube<float> skyboxTex;
    sampler skyboxSampler;
    struct VSinput
    {
        float4 Position;
    };
    struct VSOutput
    {
        float4 Position;
        float3 pos;
    };
    float4 main(VSOutput input)
    {
        float4 outColor = skyboxTex.sample(skyboxSampler, (input).pos);
        float inverseArg = float(half(1) / 2.20000004);
        return float4(pow((outColor).r, inverseArg), pow((outColor).g, inverseArg), pow((outColor).b, inverseArg), 1.0);
    };

    Fragment_Shader(texturecube<float> skyboxTex, sampler skyboxSampler) :
        skyboxTex(skyboxTex), skyboxSampler(skyboxSampler)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float3 POSITION;
};

struct ArgBuffer0
{
    texturecube<float> skyboxTex [[id(1)]];
    sampler skyboxSampler [[id(2)]];
};

fragment float4 stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.pos = inputData.POSITION;
    Fragment_Shader main(argBuffer0.skyboxTex, argBuffer0.skyboxSampler);
    return main.main(input0);
}
