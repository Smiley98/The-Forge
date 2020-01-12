struct VSInput
{
    float3 Position : POSITION;
    float2 Uv : TEXCOORD0;
};
struct VSOutput
{
    float4 Position : SV_POSITION;
    float2 uv : TEXCOORD0;
};
VSOutput main(VSInput input)
{
    VSOutput result;
    (result.Position = float4(input.Position, 1.0));
    (result.uv = input.Uv);
    return result;
};

