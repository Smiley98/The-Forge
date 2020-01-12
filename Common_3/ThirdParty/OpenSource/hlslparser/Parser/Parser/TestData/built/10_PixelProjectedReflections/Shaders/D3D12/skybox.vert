cbuffer uniformBlock : register(b0, space1)
{
    float4x4 projView;
    float3 camPos;
};

struct VSInput
{
    float4 Position : POSITION;
};
struct VSOutput
{
    float4 Position : SV_POSITION;
    float3 pos : POSITION;
};
VSOutput main(VSInput input)
{
    VSOutput result;
    (result.Position = mul(projView, input.Position));
    (result.Position = result.Position.xyww);
    (result.pos = (float3 )(input.Position));
    return result;
};

