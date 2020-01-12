struct PsIn
{
    float4 position : SV_Position;
    float2 texCoord : TEXCOORD;
};
PsIn main(uint VertexID : SV_VertexID)
{
    PsIn Out;
    float4 position;
    (position.x = (float )(((VertexID == (uint )(2))?(3.0):(-1.0))));
    (position.y = (float )(((VertexID == (uint )(0))?(-3.0):(1.0))));
    (position.zw = (float2 )(1.0));
    (Out.position = position);
    (Out.texCoord = ((position.xy * float2(0.5, -0.5)) + (float2 )(0.5)));
    return Out;
};

