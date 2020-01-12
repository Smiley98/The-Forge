struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 TexCoord : TEXCOORD;
};
Texture2D<float4> RightText : register(t0);
Texture2D<float4> LeftText : register(t1);
Texture2D<float4> TopText : register(t2);
Texture2D<float4> BotText : register(t3);
Texture2D<float4> FrontText : register(t4);
Texture2D<float4> BackText : register(t5);
SamplerState SkySampler : register(s0);
float4 main(VSOutput input) : SV_TARGET
{
    float2 newtextcoord;
    float side = round(input.TexCoord.w);
    if (side == 1.0)
    {
        (newtextcoord = ((input.TexCoord.zy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(((float )(1) - newtextcoord.x), ((float )(1) - newtextcoord.y)));
        return RightText.Sample(SkySampler, newtextcoord);
    }
    else if ((side == 2.0))
    {
        (newtextcoord = ((input.TexCoord.zy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, ((float )(1) - newtextcoord.y)));
        return LeftText.Sample(SkySampler, newtextcoord);
    }
    else if ((side == 4.0))
    {
        (newtextcoord = ((input.TexCoord.xz / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, ((float )(1) - newtextcoord.y)));
        return BotText.Sample(SkySampler, newtextcoord);
    }
    else if ((side == 5.0))
    {
        (newtextcoord = ((input.TexCoord.xy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, ((float )(1) - newtextcoord.y)));
        return FrontText.Sample(SkySampler, newtextcoord);
    }
    else if ((side == 6.0))
    {
        (newtextcoord = ((input.TexCoord.xy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(((float )(1) - newtextcoord.x), ((float )(1) - newtextcoord.y)));
        return BackText.Sample(SkySampler, newtextcoord);
    }
    else
    {
        (newtextcoord = ((input.TexCoord.xz / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, newtextcoord.y));
        return TopText.Sample(SkySampler, newtextcoord);
    }
};

