struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 UV : TEXCOORD0;
};
SamplerState PointSampler : register(s0);
SamplerState LinearSampler : register(s1);
Texture2D<float4> AccumulationTexture : register(t0);
Texture2D<float4> ModulationTexture : register(t1);
Texture2D<float4> BackgroundTexture : register(t2);
float MaxComponent(float3 v)
{
    return max(max(v.x, v.y), v.z);
};

float MinComponent(float3 v)
{
    return min(min(v.x, v.y), v.z);
};

float4 main(VSOutput input) : SV_Target
{
    float4 modulationAndDiffusion = ModulationTexture.Sample(PointSampler, input.UV.xy);
    float3 modulation = modulationAndDiffusion.rgb;
    if (MinComponent(modulation) == 1.0)
    {
        return BackgroundTexture.Sample(PointSampler, input.UV.xy);
    }
    float4 accumulation = AccumulationTexture.Sample(PointSampler, input.UV.xy);
    if (isinf(accumulation.a))
    {
        (accumulation.a = MaxComponent(accumulation.xyz));
    }
    if (isinf(MaxComponent(accumulation.xyz)))
    {
        (accumulation = (float4 )(1.0));
    }
    const float epsilon = 0.0010000000;
    (accumulation.rgb *= ((float3 )(0.5) + (max(modulation, (const float3 )(epsilon)) / (float3 )(2.0 * max(epsilon, MaxComponent(modulation))))));
    float2 delta = (float2 )(0.0);
    float3 background = (float3 )(0.0);
    (background = BackgroundTexture.SampleLevel(PointSampler, input.UV.xy, 0.0).rgb);
    return float4(((background * modulation) + ((((float3 )(1.0) - modulation) * accumulation.rgb) / (float3 )(max(accumulation.a, 0.000010000000)))), 1.0);
};

