struct VSInput
{
    float3 Position : POSITION;
    float2 TexCoord : TEXCOORD;
};
struct VSOutput
{
    float4 Position : SV_POSITION;
    float2 TexCoord : TEXCOORD;
};
VSOutput main(VSInput input)
{
    VSOutput Out;
    (Out.Position = float4(input.Position, 1.0));
    (Out.TexCoord = input.TexCoord);
    return Out;
};

