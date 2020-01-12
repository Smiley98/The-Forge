#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct VSOutput
    {
        float4 Position;
        float4 UV;
    };
    struct Uniforms_RootConstant
    {
        float axis;
    };
    constant Uniforms_RootConstant& RootConstant;
    texture2d<float> Source;
    sampler LinearSampler;
    float4 main(VSOutput input)
    {
        const int StepCount = 2;
        const array<float, 2> Weights = { {0.44908, 0.05092} };
        const array<float, 2> Offsets = { {0.53805, 2.0627799} };
        uint2 dim;
        dim[0] = Source.get_width();
        dim[1] = Source.get_height();
        float2 stepSize = float2(((1.0 - RootConstant.axis) / float(dim[0])), (RootConstant.axis / float(dim[1])));
        float4 output = float4(0.0);
        for (int i = 0; (i < StepCount); (++i))
        {
            float2 offset = (float2(Offsets[i]) * stepSize);
            (output += (Source.sample(LinearSampler, (((input).UV).xy + offset)) * float4(Weights[i])));
            (output += (Source.sample(LinearSampler, (((input).UV).xy - offset)) * float4(Weights[i])));
        }
        return output;
    };

    Fragment_Shader(constant Uniforms_RootConstant& RootConstant, texture2d<float> Source, sampler LinearSampler) :
        RootConstant(RootConstant), Source(Source), LinearSampler(LinearSampler)
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
    sampler LinearSampler [[id(0)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant Fragment_Shader::Uniforms_RootConstant& RootConstant)
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.UV = inputData.TEXCOORD0;
    Fragment_Shader main(RootConstant, argBuffer0.Source, argBuffer0.LinearSampler);
    main_output output; output.tmp = main.main(input0);
    return output;
}
