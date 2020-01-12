cbuffer uniformBlock : register(b0, space1)
{
    float4x4 mvp;
    float4x4 toWorld[20];
    float4 color[20];
    float3 lightPosition;
    float3 lightColor;
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
    float4x4 m = mvp;
    (p = mul(m, p));
    (result.Position = p.xyww);
    (result.TexCoord = float4(Position.x, Position.y, Position.z, Position.w));
    return result;
};

