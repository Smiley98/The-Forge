cbuffer cbPerFrame : register(b3, space1)
{
    float4x4 worldMat;
    float4x4 projViewMat;
    float4 screenSize;
};

struct VSInput
{
    float3 Position : POSITION;
    float2 TexCoord : TEXCOORD0;
};
struct VSOutput
{
    float4 Position : SV_POSITION;
    float3 WorldPos : POSITION;
    float2 TexCoord : TEXCOORD;
};
VSOutput main(VSInput input)
{
    VSOutput Out;
    float4 worldPos = float4(input.Position, 1.0);
    (worldPos = mul(worldMat, worldPos));
    (Out.Position = mul(projViewMat, worldPos));
    (Out.WorldPos = worldPos.xyz);
    (Out.TexCoord = input.TexCoord);
    return Out;
};

