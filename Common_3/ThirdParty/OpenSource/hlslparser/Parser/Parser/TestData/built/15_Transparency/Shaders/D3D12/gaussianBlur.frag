struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 UV : TEXCOORD0;
};
cbuffer RootConstant
{
    float axis;
};

Texture2D<float4> Source : register(t0);
SamplerState LinearSampler : register(s0);
float4 main(VSOutput input) : SV_Target
{
    const int StepCount = 2;
    const float Weights[2] = {0.44908, 0.05092};
    const float Offsets[2] = {0.53805, 2.0627799};
    uint2 dim;
    Source.GetDimensions(dim[0], dim[1]);
    float2 stepSize = float2(((1.0 - axis) / (float )(dim[0])), (axis / (float )(dim[1])));
    float4 output = (float4 )(0.0);
    [unroll]
    for (int i = 0; (i < StepCount); ++i)
    {
        float2 offset = ((float2 )(Offsets[i]) * stepSize);
        (output += (Source.Sample(LinearSampler, (input.UV.xy + offset)) * (float4 )(Weights[i])));
        (output += (Source.Sample(LinearSampler, (input.UV.xy - offset)) * (float4 )(Weights[i])));
    }
    return output;
};

