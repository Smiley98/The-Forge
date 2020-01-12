#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct VSOutput
    {
        float4 Position;
        float4 TexCoord;
    };
    sampler uSkyboxSampler;
    texture2d<float> RightText;
    texture2d<float> LeftText;
    texture2d<float> TopText;
    texture2d<float> BotText;
    texture2d<float> FrontText;
    texture2d<float> BackText;
    float4 main(VSOutput input)
    {
        float2 newtextcoord;
        float side = round(((input).TexCoord).w);
        if (side == 1.0)
        {
            (newtextcoord = ((((input).TexCoord).zy / float2(20)) + float2(0.5)));
            (newtextcoord = float2((float(1) - (newtextcoord).x), (float(1) - (newtextcoord).y)));
            return RightText.sample(uSkyboxSampler, newtextcoord);
        }
        else if ((side == 2.0))
        {
            (newtextcoord = ((((input).TexCoord).zy / float2(20)) + float2(0.5)));
            (newtextcoord = float2((newtextcoord).x, (float(1) - (newtextcoord).y)));
            return LeftText.sample(uSkyboxSampler, newtextcoord);
        }
        else if ((side == 4.0))
        {
            (newtextcoord = ((((input).TexCoord).xz / float2(20)) + float2(0.5)));
            (newtextcoord = float2((newtextcoord).x, (float(1) - (newtextcoord).y)));
            return BotText.sample(uSkyboxSampler, newtextcoord);
        }
        else if ((side == 5.0))
        {
            (newtextcoord = ((((input).TexCoord).xy / float2(20)) + float2(0.5)));
            (newtextcoord = float2((newtextcoord).x, (float(1) - (newtextcoord).y)));
            return FrontText.sample(uSkyboxSampler, newtextcoord);
        }
        else if ((side == 6.0))
        {
            (newtextcoord = ((((input).TexCoord).xy / float2(20)) + float2(0.5)));
            (newtextcoord = float2((float(1) - (newtextcoord).x), (float(1) - (newtextcoord).y)));
            return BackText.sample(uSkyboxSampler, newtextcoord);
        }
        else
        {
            (newtextcoord = ((((input).TexCoord).xz / float2(20)) + float2(0.5)));
            (newtextcoord = float2((newtextcoord).x, (newtextcoord).y));
            return TopText.sample(uSkyboxSampler, newtextcoord);
        }
    };

    Fragment_Shader(sampler uSkyboxSampler, texture2d<float> RightText, texture2d<float> LeftText, texture2d<float> TopText, texture2d<float> BotText, texture2d<float> FrontText, texture2d<float> BackText) :
        uSkyboxSampler(uSkyboxSampler), RightText(RightText), LeftText(LeftText), TopText(TopText), BotText(BotText), FrontText(FrontText), BackText(BackText)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 TEXCOORD;
};

struct ArgBuffer0
{
    texture2d<float> RightText [[id(4)]];
    texture2d<float> LeftText [[id(5)]];
    texture2d<float> TopText [[id(6)]];
    texture2d<float> BotText [[id(7)]];
    texture2d<float> FrontText [[id(8)]];
    texture2d<float> BackText [[id(9)]];
    sampler uSkyboxSampler [[id(10)]];
};

fragment float4 stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.TexCoord = inputData.TEXCOORD;
    Fragment_Shader main(argBuffer0.uSkyboxSampler, argBuffer0.RightText, argBuffer0.LeftText, argBuffer0.TopText, argBuffer0.BotText, argBuffer0.FrontText, argBuffer0.BackText);
    return main.main(input0);
}
