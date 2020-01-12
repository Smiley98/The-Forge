Texture2D<float4> sceneTexture : register(t6);
SamplerState clampMiplessLinearSampler : register(s7);
struct VSOutput
{
    float4 Position : SV_POSITION;
    float2 TexCoord : TEXCOORD;
};
float4 main(VSOutput input) : SV_TARGET
{
    return sceneTexture.Sample(clampMiplessLinearSampler, input.TexCoord);
};

