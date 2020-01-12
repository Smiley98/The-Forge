struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 TexCoord : TEXCOORD;
};
SamplerState uSampler1 : register(s7);
Texture2D<float4> RightText : register(t1);
Texture2D<float4> LeftText : register(t2);
Texture2D<float4> TopText : register(t3);
Texture2D<float4> BotText : register(t4);
Texture2D<float4> FrontText : register(t5);
Texture2D<float4> BackText : register(t6);
float4 main(VSOutput input) : SV_TARGET
{
    float2 newtextcoord;
    float side = round(input.TexCoord.w);
    if (side == 1.0)
    {
        (newtextcoord = ((input.TexCoord.zy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(((float )(1) - newtextcoord.x), ((float )(1) - newtextcoord.y)));
        return RightText.Sample(uSampler1, newtextcoord);
    }
    else if ((side == 2.0))
    {
        (newtextcoord = ((input.TexCoord.zy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, ((float )(1) - newtextcoord.y)));
        return LeftText.Sample(uSampler1, newtextcoord);
    }
    else if ((side == 4.0))
    {
        (newtextcoord = ((input.TexCoord.xz / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, ((float )(1) - newtextcoord.y)));
        return BotText.Sample(uSampler1, newtextcoord);
    }
    else if ((side == 5.0))
    {
        (newtextcoord = ((input.TexCoord.xy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, ((float )(1) - newtextcoord.y)));
        return FrontText.Sample(uSampler1, newtextcoord);
    }
    else if ((side == 6.0))
    {
        (newtextcoord = ((input.TexCoord.xy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(((float )(1) - newtextcoord.x), ((float )(1) - newtextcoord.y)));
        return BackText.Sample(uSampler1, newtextcoord);
    }
    else
    {
        (newtextcoord = ((input.TexCoord.xz / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, newtextcoord.y));
        return TopText.Sample(uSampler1, newtextcoord);
    }
};

