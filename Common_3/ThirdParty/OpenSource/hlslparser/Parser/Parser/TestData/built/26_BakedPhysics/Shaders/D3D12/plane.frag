struct VSOutput
{
    float4 Position : SV_POSITION;
    float2 TexCoord : TEXCOORD;
};
float4 main(VSOutput input) : SV_TARGET
{
    float tol = 0.0025000000;
    float res = 0.05;
    float4 backgroundColor = float4(0.49, 0.64000000, 0.68, 1.0);
    float4 lineColor = float4(0.39, 0.41, 0.37, 1.0);
    float4 originColor = float4(0.0, 0.0, 0.0, 1.0);
    if (abs((input.TexCoord.x - 0.5)) <= tol && (abs((input.TexCoord.y - 0.5)) <= tol))
    {
        return originColor;
    }
    else if (((((fmod(input.TexCoord.x, res) >= (res - tol)) || (fmod(input.TexCoord.x, res) < tol)) || (fmod(input.TexCoord.y, res) >= (res - tol))) || (fmod(input.TexCoord.y, res) < tol)))
    {
        return lineColor;
    }
    else
    {
        return backgroundColor;
    }
};

