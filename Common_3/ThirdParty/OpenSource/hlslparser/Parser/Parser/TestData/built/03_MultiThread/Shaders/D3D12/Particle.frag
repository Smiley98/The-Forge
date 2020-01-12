cbuffer particleRootConstant : register(b1)
{
    float paletteFactor;
    uint data;
    uint textureIndex;
};

struct VSOutput
{
    float4 Position : SV_POSITION;
    float TexCoord : TEXCOORD;
};
SamplerState uSampler0 : register(s3);
Texture1D<float4> uTex0[5] : register(t11);
float4 main(VSOutput input) : SV_TARGET
{
    float4 ca = uTex0[textureIndex].Sample(uSampler0, input.TexCoord);
    float4 cb = uTex0[((textureIndex + (uint )(1)) % (uint )(5))].Sample(uSampler0, input.TexCoord);
    return ((float4 )(0.05) * lerp(ca, cb, (const float4 )(paletteFactor)));
};

