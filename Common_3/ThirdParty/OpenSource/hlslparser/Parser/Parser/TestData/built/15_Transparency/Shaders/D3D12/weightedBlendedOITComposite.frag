struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 UV : Texcoord0;
};
SamplerState PointSampler : register(s0);
Texture2D<float4> AccumulationTexture : register(t0);
Texture2D<float4> RevealageTexture : register(t1);
float MaxComponent(float4 v)
{
    return max(max(max(v.x, v.y), v.z), v.w);
};

float4 main(VSOutput input) : SV_Target
{
    float revealage = RevealageTexture.Sample(PointSampler, input.UV.xy).r;
    clip(((1.0 - revealage) - 0.000010000000));
    float4 accumulation = AccumulationTexture.Sample(PointSampler, input.UV.xy);
    if (isinf(MaxComponent(abs(accumulation))))
    {
        (accumulation.rgb = (float3 )(accumulation.a));
    }
    float3 averageColor = (accumulation.rgb / (float3 )(max(accumulation.a, 0.000010000000)));
    return float4(averageColor, (1.0 - revealage));
};

