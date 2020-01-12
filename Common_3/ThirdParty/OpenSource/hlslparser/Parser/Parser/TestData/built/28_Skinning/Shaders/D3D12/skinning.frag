struct VSOutput
{
    float4 Position : SV_POSITION;
    float3 Normal : NORMAL;
    float2 UV : TEXCOORD0;
};
Texture2D<float4> DiffuseTexture : register(t0);
SamplerState DefaultSampler : register(s0);
float4 main(VSOutput input) : SV_TARGET
{
    float nDotl = saturate(((dot(normalize(input.Normal), float3(0, 1, 0)) + 1.0) * 0.5));
    float3 color = DiffuseTexture.Sample(DefaultSampler, input.UV).rgb;
    return float4((color * (float3 )(nDotl)), 1.0);
};

