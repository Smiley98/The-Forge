Texture2D<float4> sceneTexture : register(t6);
SamplerState clampMiplessLinearSampler : register(s7);
cbuffer FXAARootConstant : register(b21)
{
    float2 ScreenSize;
    uint Use;
    uint padding00;
};

float rgb2luma(float3 rgb)
{
    return sqrt(dot(rgb, float3(0.299, 0.587, 0.114)));
};

float3 FXAA(float2 UV, int2 Pixel)
{
    float QUALITY[12] = {0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 2.0, 2.0, 2.0, 2.0, 4.0, 8.0};
    float3 colorCenter = sceneTexture.Load(int3(Pixel.x, Pixel.y, 0), int2(0, 0)).rgb;
    float lumaCenter = rgb2luma(colorCenter);
    float lumaD = rgb2luma(sceneTexture.Load(int3(Pixel.x, Pixel.y, 0), int2(0, -1)).rgb);
    float lumaU = rgb2luma(sceneTexture.Load(int3(Pixel.x, Pixel.y, 0), int2(0, 1)).rgb);
    float lumaL = rgb2luma(sceneTexture.Load(int3(Pixel.x, Pixel.y, 0), int2(-1, 0)).rgb);
    float lumaR = rgb2luma(sceneTexture.Load(int3(Pixel.x, Pixel.y, 0), int2(1, 0)).rgb);
    float lumaMin = min(lumaCenter, min(min(lumaD, lumaU), min(lumaL, lumaR)));
    float lumaMax = max(lumaCenter, max(max(lumaD, lumaU), max(lumaL, lumaR)));
    float lumaRange = (lumaMax - lumaMin);
    if (lumaRange < max((const float )(0.0312), (lumaMax * (float )(0.125))))
    {
        return sceneTexture.Sample(clampMiplessLinearSampler, UV).rgb;
    }
    float lumaDL = rgb2luma(sceneTexture.Load(int3(Pixel.x, Pixel.y, 0), int2(-1, -1)).rgb);
    float lumaUR = rgb2luma(sceneTexture.Load(int3(Pixel.x, Pixel.y, 0), int2(1, 1)).rgb);
    float lumaUL = rgb2luma(sceneTexture.Load(int3(Pixel.x, Pixel.y, 0), int2(-1, 1)).rgb);
    float lumaDR = rgb2luma(sceneTexture.Load(int3(Pixel.x, Pixel.y, 0), int2(1, -1)).rgb);
    float lumaDownUp = (lumaD + lumaU);
    float lumaLeftRight = (lumaL + lumaR);
    float lumaLeftCorners = (lumaDL + lumaUL);
    float lumaDownCorners = (lumaDL + lumaDR);
    float lumaRightCorners = (lumaDR + lumaUR);
    float lumaUpCorners = (lumaUR + lumaUL);
    float edgeHorizontal = ((abs((((float )(-2.0) * lumaL) + lumaLeftCorners)) + (abs((((float )(-2.0) * lumaCenter) + lumaDownUp)) * (float )(2.0))) + abs((((float )(-2.0) * lumaR) + lumaRightCorners)));
    float edgeVertical = ((abs((((float )(-2.0) * lumaU) + lumaUpCorners)) + (abs((((float )(-2.0) * lumaCenter) + lumaLeftRight)) * (float )(2.0))) + abs((((float )(-2.0) * lumaD) + lumaDownCorners)));
    float isHorizontal = (((edgeHorizontal >= edgeVertical))?(0.0):(1.0));
    float luma1 = lerp(lumaD, lumaL, isHorizontal);
    float luma2 = lerp(lumaU, lumaR, isHorizontal);
    float gradient1 = (luma1 - lumaCenter);
    float gradient2 = (luma2 - lumaCenter);
    bool is1Steepest = (abs(gradient1) >= abs(gradient2));
    float gradientScaled = ((float )(0.25) * max(abs(gradient1), abs(gradient2)));
    float2 inverseScreenSize = float2(((float )(1.0) / ScreenSize.x), ((float )(1.0) / ScreenSize.y));
    float stepLength = lerp(inverseScreenSize.y, inverseScreenSize.x, isHorizontal);
    float lumaLocalAverage = (float )(0.0);
    if (is1Steepest)
    {
        (stepLength = -stepLength);
        (lumaLocalAverage = ((float )(0.5) * (luma1 + lumaCenter)));
    }
    else
    {
        (lumaLocalAverage = ((float )(0.5) * (luma2 + lumaCenter)));
    }
    float2 currentUv = UV;
    if (isHorizontal < 0.5)
    {
        (currentUv.y += (stepLength * (float )(0.5)));
    }
    else
    {
        (currentUv.x += (stepLength * (float )(0.5)));
    }
    float2 offset = lerp(float2(inverseScreenSize.x, 0.0), float2(0.0, inverseScreenSize.y), (const float2 )(isHorizontal));
    float2 uv1 = (currentUv - offset);
    float2 uv2 = (currentUv + offset);
    float lumaEnd1 = rgb2luma(sceneTexture.Sample(clampMiplessLinearSampler, uv1).rgb);
    float lumaEnd2 = rgb2luma(sceneTexture.Sample(clampMiplessLinearSampler, uv2).rgb);
    (lumaEnd1 -= lumaLocalAverage);
    (lumaEnd2 -= lumaLocalAverage);
    bool reached1 = (abs(lumaEnd1) >= gradientScaled);
    bool reached2 = (abs(lumaEnd2) >= gradientScaled);
    bool reachedBoth = (reached1 && reached2);
    if (!reached1)
    {
        (uv1 -= offset);
    }
    if (!reached2)
    {
        (uv2 += offset);
    }
    if (!reachedBoth)
    {
        [unroll]
        for (int i = 2; (i < 12); ++i)
        {
            if (!reached1)
            {
                (lumaEnd1 = rgb2luma(sceneTexture.Sample(clampMiplessLinearSampler, uv1).rgb));
                (lumaEnd1 = (lumaEnd1 - lumaLocalAverage));
            }
            if (!reached2)
            {
                (lumaEnd2 = rgb2luma(sceneTexture.Sample(clampMiplessLinearSampler, uv2).rgb));
                (lumaEnd2 = (lumaEnd2 - lumaLocalAverage));
            }
            (reached1 = (abs(lumaEnd1) >= gradientScaled));
            (reached2 = (abs(lumaEnd2) >= gradientScaled));
            (reachedBoth = (reached1 && reached2));
            if (!reached1)
            {
                (uv1 -= (offset * (float2 )(QUALITY[i])));
            }
            if (!reached2)
            {
                (uv2 += (offset * (float2 )(QUALITY[i])));
            }
            if (reachedBoth)
            {
                break;
            }
        }
    }
    float distance1 = lerp((UV.x - uv1.x), (UV.y - uv1.y), isHorizontal);
    float distance2 = lerp((uv2.x - UV.x), (uv2.y - UV.y), isHorizontal);
    bool isDirection1 = (distance1 < distance2);
    float distanceFinal = min(distance1, distance2);
    float edgeThickness = (distance1 + distance2);
    float pixelOffset = ((-distanceFinal / edgeThickness) + (float )(0.5));
    bool isLumaCenterSmaller = (lumaCenter < lumaLocalAverage);
    bool correctVariation = ((((isDirection1)?(lumaEnd1):(lumaEnd2)) < (float )(0.0)) != isLumaCenterSmaller);
    float finalOffset = ((correctVariation)?(pixelOffset):(0.0));
    float lumaAverage = ((float )(1.0 / 12.0) * ((((float )(2.0) * (lumaDownUp + lumaLeftRight)) + lumaLeftCorners) + lumaRightCorners));
    float subPixelOffset1 = clamp((abs((lumaAverage - lumaCenter)) / lumaRange), (const float )(0.0), (const float )(1.0));
    float subPixelOffset2 = (((((float )(-2.0) * subPixelOffset1) + (float )(3.0)) * subPixelOffset1) * subPixelOffset1);
    float subPixelOffsetFinal = ((subPixelOffset2 * subPixelOffset2) * (float )(0.75));
    (finalOffset = max(finalOffset, subPixelOffsetFinal));
    float2 finalUv = UV;
    if (isHorizontal < 0.5)
    {
        (finalUv.y += (finalOffset * stepLength));
    }
    else
    {
        (finalUv.x += (finalOffset * stepLength));
    }
    return sceneTexture.Sample(clampMiplessLinearSampler, finalUv).rgb;
};

struct PSIn
{
    float4 Position : SV_POSITION;
    float2 TexCoord : TEXCOORD;
};
float4 main(PSIn input) : SV_TARGET
{
    float3 result = float3(0.0, 0.0, 0.0);
    if (Use)
    {
        (result = FXAA(input.TexCoord, int2((input.TexCoord * ScreenSize))));
    }
    else
    {
        (result = sceneTexture.Sample(clampMiplessLinearSampler, input.TexCoord).rgb);
    }
    return float4(result.r, result.g, result.b, 1.0);
};

