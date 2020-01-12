cbuffer cbExtendCamera : register(b0, space1)
{
    float4x4 viewMat;
    float4x4 projMat;
    float4x4 viewProjMat;
    float4x4 InvViewProjMat;
    float4 cameraWorldPos;
    float4 viewPortSize;
};

Texture2D<float4> SceneTexture : register(t1);
Texture2D<float4> SSRTexture : register(t2);
cbuffer cbProperties : register(b3, space1)
{
    uint renderMode;
    float useHolePatching;
    float useExpensiveHolePatching;
    float useNormalMap;
    float intensity;
    float useFadeEffect;
    float padding01;
    float padding02;
};

SamplerState nearestSampler : register(s4);
SamplerState bilinearSampler : register(s5);
struct VSOutput
{
    float4 Position : SV_POSITION;
    float2 uv : TEXCOORD0;
};
float4 main(VSOutput input) : SV_TARGET
{
    float4 outColor;
    float4 ssrColor = SSRTexture.Sample(nearestSampler, input.uv);
    if (renderMode == (uint )(0))
    {
        return SceneTexture.Sample(bilinearSampler, input.uv);
    }
    else if ((renderMode == (uint )(1)))
    {
        (outColor = float4(0.0, 0.0, 0.0, 0.0));
    }
    if (useHolePatching < (float )(0.5))
    {
        (outColor.w = (float )(1.0));
        if (ssrColor.w > (float )(0.0))
        {
            (outColor = ssrColor);
        }
    }
    else if ((ssrColor.w > (float )(0.0)))
    {
        float threshold = ssrColor.w;
        float minOffset = threshold;
        float4 neighborColor00 = SSRTexture.Sample(nearestSampler, (input.uv + float2(((float )(1.0) / viewPortSize.x), 0.0)));
        float4 neighborColorB00 = SSRTexture.Sample(bilinearSampler, (input.uv + float2(((float )(1.0) / viewPortSize.x), 0.0)));
        if (neighborColor00.w > (float )(0.0))
        {
            (minOffset = min(minOffset, neighborColor00.w));
        }
        float4 neighborColor01 = SSRTexture.Sample(nearestSampler, (input.uv - float2(((float )(1.0) / viewPortSize.x), 0.0)));
        float4 neighborColorB01 = SSRTexture.Sample(bilinearSampler, (input.uv - float2(((float )(1.0) / viewPortSize.x), 0.0)));
        if (neighborColor01.w > (float )(0.0))
        {
            (minOffset = min(minOffset, neighborColor01.w));
        }
        float4 neighborColor02 = SSRTexture.Sample(nearestSampler, (input.uv + float2(0.0, ((float )(1.0) / viewPortSize.y))));
        float4 neighborColorB02 = SSRTexture.Sample(bilinearSampler, (input.uv + float2(0.0, ((float )(1.0) / viewPortSize.y))));
        if (neighborColor02.w > (float )(0.0))
        {
            (minOffset = min(minOffset, neighborColor02.w));
        }
        float4 neighborColor03 = SSRTexture.Sample(nearestSampler, (input.uv - float2(0.0, ((float )(1.0) / viewPortSize.y))));
        float4 neighborColorB03 = SSRTexture.Sample(bilinearSampler, (input.uv - float2(0.0, ((float )(1.0) / viewPortSize.y))));
        if (neighborColor03.w > (float )(0.0))
        {
            (minOffset = min(minOffset, neighborColor03.w));
        }
        float4 neighborColor04 = SSRTexture.Sample(nearestSampler, (input.uv + float2(((float )(1.0) / viewPortSize.x), ((float )(1.0) / viewPortSize.y))));
        float4 neighborColorB04 = SSRTexture.Sample(bilinearSampler, (input.uv + float2(((float )(1.0) / viewPortSize.x), ((float )(1.0) / viewPortSize.y))));
        float4 neighborColor05 = SSRTexture.Sample(nearestSampler, (input.uv + float2(((float )(1.0) / viewPortSize.x), ((float )(-1.0) / viewPortSize.y))));
        float4 neighborColorB05 = SSRTexture.Sample(bilinearSampler, (input.uv + float2(((float )(1.0) / viewPortSize.x), ((float )(-1.0) / viewPortSize.y))));
        float4 neighborColor06 = SSRTexture.Sample(nearestSampler, (input.uv + float2(((float )(-1.0) / viewPortSize.x), ((float )(1.0) / viewPortSize.y))));
        float4 neighborColorB06 = SSRTexture.Sample(bilinearSampler, (input.uv + float2(((float )(-1.0) / viewPortSize.x), ((float )(1.0) / viewPortSize.y))));
        float4 neighborColor07 = SSRTexture.Sample(nearestSampler, (input.uv - float2(((float )(1.0) / viewPortSize.x), ((float )(1.0) / viewPortSize.y))));
        float4 neighborColorB07 = SSRTexture.Sample(bilinearSampler, (input.uv - float2(((float )(1.0) / viewPortSize.x), ((float )(1.0) / viewPortSize.y))));
        bool bUseExpensiveHolePatching = (useExpensiveHolePatching > (float )(0.5));
        if (bUseExpensiveHolePatching)
        {
            if (neighborColor04.w > (float )(0.0))
            {
                (minOffset = min(minOffset, neighborColor04.w));
            }
            if (neighborColor05.w > (float )(0.0))
            {
                (minOffset = min(minOffset, neighborColor05.w));
            }
            if (neighborColor06.w > (float )(0.0))
            {
                (minOffset = min(minOffset, neighborColor06.w));
            }
            if (neighborColor07.w > (float )(0.0))
            {
                (minOffset = min(minOffset, neighborColor07.w));
            }
        }
        float blendValue = (float )(0.5);
        if (bUseExpensiveHolePatching)
        {
            if (minOffset == neighborColor00.w)
            {
                (outColor = lerp(neighborColor00, neighborColorB00, (const float4 )(blendValue)));
            }
            else if ((minOffset == neighborColor01.w))
            {
                (outColor = lerp(neighborColor01, neighborColorB01, (const float4 )(blendValue)));
            }
            else if ((minOffset == neighborColor02.w))
            {
                (outColor = lerp(neighborColor02, neighborColorB02, (const float4 )(blendValue)));
            }
            else if ((minOffset == neighborColor03.w))
            {
                (outColor = lerp(neighborColor03, neighborColorB03, (const float4 )(blendValue)));
            }
            else if ((minOffset == neighborColor04.w))
            {
                (outColor = lerp(neighborColor04, neighborColorB04, (const float4 )(blendValue)));
            }
            else if ((minOffset == neighborColor05.w))
            {
                (outColor = lerp(neighborColor05, neighborColorB05, (const float4 )(blendValue)));
            }
            else if ((minOffset == neighborColor06.w))
            {
                (outColor = lerp(neighborColor06, neighborColorB06, (const float4 )(blendValue)));
            }
            else if ((minOffset == neighborColor07.w))
            {
                (outColor = lerp(neighborColor07, neighborColorB07, (const float4 )(blendValue)));
            }
        }
        else
        {
            if (minOffset == neighborColor00.w)
            {
                (outColor = lerp(neighborColor00, neighborColorB00, (const float4 )(blendValue)));
            }
            else if ((minOffset == neighborColor01.w))
            {
                (outColor = lerp(neighborColor01, neighborColorB01, (const float4 )(blendValue)));
            }
            else if ((minOffset == neighborColor02.w))
            {
                (outColor = lerp(neighborColor02, neighborColorB02, (const float4 )(blendValue)));
            }
            else if ((minOffset == neighborColor03.w))
            {
                (outColor = lerp(neighborColor03, neighborColorB03, (const float4 )(blendValue)));
            }
        }
        if (minOffset <= threshold)
        {
            (outColor.w = (float )(1.0));
        }
        else
        {
            (outColor.w = (float )(0.0));
        }
    }
    if (renderMode == (uint )(3))
    {
        if (ssrColor.w <= (float )(0.0))
        {
            (outColor = SceneTexture.Sample(bilinearSampler, input.uv));
        }
    }
    if (renderMode == (uint )(2))
    {
        (outColor = ((outColor * (float4 )(intensity)) + SceneTexture.Sample(bilinearSampler, input.uv)));
    }
    return outColor;
};

