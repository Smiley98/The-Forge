struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 UV : TEXCOORD0;
};
Texture2D<float4> Source : register(t0);
SamplerState PointSampler : register(s0);
float4 main(VSOutput input) : SV_Target
{
    float4 total = (float4 )(0.0);
    [unroll]
    for (int x = 0; (x < 4); ++x)
    {
        [unroll]
        for (int y = 0; (y < 4); ++y)
        {
            (total += (float4 )(Source.Load((const int3 )(uint3(((input.Position.xy * (float2 )(4)) + (float2 )(uint2(x, y))), 0)))));
        }
    }
    return (total / (float4 )(16.0));
};

