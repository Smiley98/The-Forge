cbuffer SkyboxUniformBlock : register(b0, space1)
{
    float4x4 vp;
};

struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 TexCoord : TEXCOORD;
};
VSOutput main(float4 Position : POSITION)
{
    VSOutput result;
    float4 p = float4(Position.xyz, 1.0);
    float4x4 m = vp;
    (p = mul(m, p));
    (result.Position = p.xyww);
    (result.TexCoord = Position);
    return result;
};

