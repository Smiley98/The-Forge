struct VSInput
{
    float2 Position : POSITION;
    float4 Color : COLOR;
};
struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 Color : COLOR;
};
VSOutput main(VSInput input)
{
    VSOutput result;
    (result.Position = float4(input.Position.x, input.Position.y, 0.0, 1.0));
    (result.Color = input.Color);
    return result;
};

