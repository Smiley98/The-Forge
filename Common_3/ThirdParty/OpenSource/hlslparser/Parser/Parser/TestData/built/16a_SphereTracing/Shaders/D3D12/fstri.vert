const static float2 positions[3] = {float2(-1.0, 1.0), float2(-1.0, -3.0), float2(3.0, 1.0)};
float4 main(uint index : SV_VertexID) : SV_POSITION
{
    return float4(positions[index], 0.0, 1.0);
};

