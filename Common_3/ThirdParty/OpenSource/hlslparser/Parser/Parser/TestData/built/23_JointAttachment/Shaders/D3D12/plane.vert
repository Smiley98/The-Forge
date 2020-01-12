cbuffer uniformBlock : register(b0, space3)
{
    float4x4 mvp;
    float4x4 toWorld;
};

struct VSInput
{
    float4 Position : POSITION;
    float2 TexCoord : TEXCOORD0;
};
struct VSOutput
{
    float4 Position : SV_POSITION;
    float2 TexCoord : TEXCOORD;
};
VSOutput main(VSInput input)
{
    VSOutput result;
    float4x4 tempMat = mul(mvp, toWorld);
    (result.Position = mul(tempMat, input.Position));
    (result.TexCoord = input.TexCoord);
    return result;
};

