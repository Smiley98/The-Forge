cbuffer SceneConstantBuffer : register(b0, space1)
{
    float4x4 orthProjMatrix;
    float2 mousePosition;
    float2 resolution;
    float time;
    uint renderMode;
    uint laneSize;
    uint padding;
};

struct PSInput
{
    float4 position : SV_POSITION;
    float2 uv : TEXCOORD;
};
Texture2D<float4> g_texture : register(t1);
SamplerState g_sampler : register(s2);
float4 main(PSInput input) : SV_TARGET
{
    float aspectRatio = (resolution.x / resolution.y);
    float magnifiedFactor = 6.0;
    float magnifiedAreaSize = 0.05;
    float magnifiedAreaBorder = 0.0050000000;
    float2 normalizedPixelPos = input.uv;
    float2 normalizedMousePos = (mousePosition / resolution);
    float2 diff = abs((normalizedPixelPos - normalizedMousePos));
    float4 color = g_texture.Sample(g_sampler, normalizedPixelPos);
    if (diff.x < (magnifiedAreaSize + magnifiedAreaBorder) && (diff.y < ((magnifiedAreaSize + magnifiedAreaBorder) * aspectRatio)))
    {
        (color = float4(0.0, 1.0, 1.0, 1.0));
    }
    if (diff.x < magnifiedAreaSize && (diff.y < (magnifiedAreaSize * aspectRatio)))
    {
        (color = g_texture.Sample(g_sampler, (normalizedMousePos + ((normalizedPixelPos - normalizedMousePos) / (float2 )(magnifiedFactor)))));
    }
    return color;
};

