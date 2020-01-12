struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 Color : COLOR;
};
VSOutput main(float2 Position : POSITION, float4 Color : COLOR)
{
    VSOutput result;
    (result.Position = float4(Position.x, Position.y, 0.0, 1.0));
    (result.Color = Color);
    return result;
};

