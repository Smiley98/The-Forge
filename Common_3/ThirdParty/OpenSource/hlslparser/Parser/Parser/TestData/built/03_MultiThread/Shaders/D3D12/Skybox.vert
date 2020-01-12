cbuffer uniformBlock : register(b0, space1)
{
    float4x4 mvp;
};

struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 TexCoord : TEXCOORD;
};
VSOutput main(float4 Position : POSITION)
{
    VSOutput result;
    float4 p = float4((Position.x * (float )(9)), (Position.y * (float )(9)), (Position.z * (float )(9)), 1.0);
    (p = mul(mvp, p));
    (result.Position = p.xyww);
    (result.TexCoord = float4(Position.x, Position.y, Position.z, Position.w));
    return result;
};

