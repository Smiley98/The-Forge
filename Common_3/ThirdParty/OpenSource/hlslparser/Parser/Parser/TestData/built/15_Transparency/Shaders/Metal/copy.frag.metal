#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct VSOutput
    {
        float4 Position;
        float4 UV;
    };
    texture2d<float> Source;
    sampler PointSampler;
    float4 main(VSOutput input)
    {
        return Source.sample(PointSampler, ((input).UV).xy);
    };

    Fragment_Shader(texture2d<float> Source, sampler PointSampler) :
        Source(Source), PointSampler(PointSampler)
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
    texture2d<float> Source [[id(0)]];
    sampler PointSampler [[id(0)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.UV = inputData.TEXCOORD0;
    Fragment_Shader main(argBuffer0.Source, argBuffer0.PointSampler);
    main_output output; output.tmp = main.main(input0);
    return output;
}
