struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 UV : TEXCOORD0;
};
Texture2D<float4> Source : register(t0);
SamplerState PointSampler : register(s0);
float4 main(VSOutput input) : SV_Target
{
    return Source.Sample(PointSampler, input.UV.xy);
};

