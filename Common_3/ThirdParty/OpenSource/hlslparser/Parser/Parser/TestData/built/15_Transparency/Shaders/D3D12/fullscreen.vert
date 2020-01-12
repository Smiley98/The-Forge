struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 UV : TEXCOORD0;
};
VSOutput main(uint VertexID : SV_VertexID)
{
    VSOutput output;
    (output.UV = float4(((VertexID << (uint )(1)) & (uint )(2)), (VertexID & (uint )(2)), 0, 0));
    (output.Position = float4(((output.UV.xy * float2(2, -2)) + float2(-1, 1)), 0, 1));
    return output;
};

