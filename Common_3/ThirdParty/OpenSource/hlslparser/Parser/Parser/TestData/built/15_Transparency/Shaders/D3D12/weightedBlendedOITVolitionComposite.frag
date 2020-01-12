struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 UV : Texcoord0;
};
SamplerState PointSampler : register(s0);
Texture2D<float4> AccumulationTexture : register(t0);
Texture2D<float4> RevealageTexture : register(t1);
float4 main(VSOutput input) : SV_Target
{
    float revealage = (float )(1.0);
    float additiveness = (float )(0.0);
    float4 accum = float4(0.0, 0.0, 0.0, 0.0);
    float4 temp = RevealageTexture.Sample(PointSampler, input.UV.xy);
    (revealage = temp.r);
    (additiveness = temp.w);
    (accum = AccumulationTexture.Sample(PointSampler, input.UV.xy));
    float3 average_color = (accum.rgb / (float3 )(max(accum.a, (const float )(0.000010000000))));
    float emissive_amplifier = (additiveness * 8.0);
    (emissive_amplifier = lerp((emissive_amplifier * (float )(0.25)), emissive_amplifier, revealage));
    (emissive_amplifier += saturate((((float )(1.0) - revealage) * (float )(2.0))));
    (average_color *= (float3 )(max(emissive_amplifier, (const float )(1.0))));
    if (any((const float3 )(isinf(accum.rgb))))
    {
        (average_color = (float3 )(100.0));
    }
    return float4(average_color, ((float )(1.0) - revealage));
};

