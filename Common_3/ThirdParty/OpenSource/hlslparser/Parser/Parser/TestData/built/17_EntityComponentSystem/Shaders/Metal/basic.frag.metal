#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct VSOutput
    {
        float4 pos;
        float3 color;
        float2 uv;
    };
    texture2d<float> uTexture0;
    sampler uSampler0;
    float4 main(VSOutput input)
    {
        float4 diffuse = uTexture0.sample(uSampler0, (input).uv);
        float lum = dot((diffuse).rgb, float3(0.333));
        ((diffuse).rgb = mix((diffuse).rgb, float3(lum), float3(0.8)));
        ((diffuse).rgb *= ((input).color).rgb);
        return diffuse;
    };

    Fragment_Shader(texture2d<float> uTexture0, sampler uSampler0) :
        uTexture0(uTexture0), uSampler0(uSampler0)
    {}
};

struct main_input
{
    float4 SV_Position [[position]];
    float3 COLOR0;
    float2 TEXCOORD0;
};

struct main_output { float4 tmp [[color(0)]]; };

struct ArgBuffer0
{
    texture2d<float> uTexture0 [[id(1)]];
    sampler uSampler0 [[id(2)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::VSOutput input0;
    input0.pos = inputData.SV_Position;
    input0.color = inputData.COLOR0;
    input0.uv = inputData.TEXCOORD0;
    Fragment_Shader main(argBuffer0.uTexture0, argBuffer0.uSampler0);
    main_output output; output.tmp = main.main(input0);
    return output;
}
