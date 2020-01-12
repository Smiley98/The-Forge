Texture2D<float4> sceneTexture : register(t6);
SamplerState clampMiplessLinearSampler : register(s7);
cbuffer cbPerFrame : register(b3, space1)
{
    float4x4 worldMat;
    float4x4 projViewMat;
    float4 screenSize;
};

struct VSOutput
{
    float4 Position : SV_POSITION;
    float2 TexCoord : TEXCOORD;
};
float4 main(VSOutput input) : SV_TARGET
{
    float4 src = sceneTexture.Sample(clampMiplessLinearSampler, input.TexCoord);
    if (screenSize.a > (float )(0.5))
    {
        float2 uv = input.TexCoord;
        float2 coord = (((uv - (float2 )(0.5)) * (float2 )(screenSize.x / screenSize.y)) * (float2 )(2.0));
        float rf = (sqrt(dot(coord, coord)) * (float )(0.2));
        float rf2_1 = ((rf * rf) + (float )(1.0));
        float e = ((float )(1.0) / (rf2_1 * rf2_1));
        return float4((src.rgb * (float3 )(e)), 1.0);
    }
    else
    {
        return float4(src.rgb, 1.0);
    }
};

