struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 TexCoord : TEXCOORD;
};
SamplerState uSkyboxSampler : register(s10);
Texture2D<float4> RightText : register(t4);
Texture2D<float4> LeftText : register(t5);
Texture2D<float4> TopText : register(t6);
Texture2D<float4> BotText : register(t7);
Texture2D<float4> FrontText : register(t8);
Texture2D<float4> BackText : register(t9);
float4 main(VSOutput input) : SV_TARGET
{
    float2 newtextcoord;
    float side = round(input.TexCoord.w);
    if (side == 1.0)
    {
        (newtextcoord = ((input.TexCoord.zy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(((float )(1) - newtextcoord.x), ((float )(1) - newtextcoord.y)));
        return RightText.Sample(uSkyboxSampler, newtextcoord);
    }
    else if ((side == 2.0))
    {
        (newtextcoord = ((input.TexCoord.zy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, ((float )(1) - newtextcoord.y)));
        return LeftText.Sample(uSkyboxSampler, newtextcoord);
    }
    else if ((side == 4.0))
    {
        (newtextcoord = ((input.TexCoord.xz / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, ((float )(1) - newtextcoord.y)));
        return BotText.Sample(uSkyboxSampler, newtextcoord);
    }
    else if ((side == 5.0))
    {
        (newtextcoord = ((input.TexCoord.xy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, ((float )(1) - newtextcoord.y)));
        return FrontText.Sample(uSkyboxSampler, newtextcoord);
    }
    else if ((side == 6.0))
    {
        (newtextcoord = ((input.TexCoord.xy / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(((float )(1) - newtextcoord.x), ((float )(1) - newtextcoord.y)));
        return BackText.Sample(uSkyboxSampler, newtextcoord);
    }
    else
    {
        (newtextcoord = ((input.TexCoord.xz / (float2 )(20)) + (float2 )(0.5)));
        (newtextcoord = float2(newtextcoord.x, newtextcoord.y));
        return TopText.Sample(uSkyboxSampler, newtextcoord);
    }
};

