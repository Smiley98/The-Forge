TextureCube<float4> skyboxTex : register(t1);
SamplerState skyboxSampler : register(s2);
struct VSinput
{
    float4 Position : POSITION;
};
struct VSOutput
{
    float4 Position : SV_POSITION;
    float3 pos : POSITION;
};
float4 main(VSOutput input) : SV_TARGET
{
    float4 outColor = skyboxTex.Sample(skyboxSampler, input.pos);
    float inverseArg = (float )((half )(1) / 2.20000004);
    return float4(pow(outColor.r, inverseArg), pow(outColor.g, inverseArg), pow(outColor.b, inverseArg), 1.0);
};

