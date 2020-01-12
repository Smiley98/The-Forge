struct VSInput
{
    uint VertexID : SV_VertexID;
};
struct VSOutput
{
    float4 Position : SV_POSITION;
    float2 TexCoord : TEXCOORD;
};
VSOutput main(VSInput input)
{
    VSOutput Out;
    float4 position;
    (position.x = (float )(((input.VertexID == (uint )(1))?(3.0):(-1.0))));
    (position.y = (float )(((input.VertexID == (uint )(0))?(-3.0):(1.0))));
    (position.zw = (float2 )(1.0));
    (Out.Position = position);
    (Out.TexCoord = ((position.xy * float2(0.5, -0.5)) + (float2 )(0.5)));
    return Out;
};

