#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct Uniforms_cbExtendCamera
    {
        float4x4 viewMat;
        float4x4 projMat;
        float4x4 viewProjMat;
        float4x4 InvViewProjMat;
        float4 cameraWorldPos;
        float4 viewPortSize;
    };
    constant Uniforms_cbExtendCamera& cbExtendCamera;
    texture2d<float> SceneTexture;
    texture2d<float> SSRTexture;
    struct Uniforms_cbProperties
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
    constant Uniforms_cbProperties& cbProperties;
    sampler nearestSampler;
    sampler bilinearSampler;
    struct VSOutput
    {
        float4 Position;
        float2 uv;
    };
    float4 main(VSOutput input)
    {
        float4 outColor;
        float4 ssrColor = SSRTexture.sample(nearestSampler, (input).uv);
        if (cbProperties.renderMode == uint(0))
        {
            return SceneTexture.sample(bilinearSampler, (input).uv);
        }
        else if ((cbProperties.renderMode == uint(1)))
        {
            (outColor = float4((float)0.0, (float)0.0, (float)0.0, (float)0.0));
        }
        if (cbProperties.useHolePatching < float(0.5))
        {
            ((outColor).w = float(1.0));
            if (ssrColor.w > float(0.0))
            {
                (outColor = ssrColor);
            }
        }
        else if (((ssrColor).w > float(0.0)))
        {
            float threshold = (ssrColor).w;
            float minOffset = threshold;
            float4 neighborColor00 = SSRTexture.sample(nearestSampler, ((input).uv + float2((float(1.0) / (cbExtendCamera.viewPortSize).x), (float)0.0)));
            float4 neighborColorB00 = SSRTexture.sample(bilinearSampler, ((input).uv + float2((float(1.0) / (cbExtendCamera.viewPortSize).x), (float)0.0)));
            if (neighborColor00.w > float(0.0))
            {
                (minOffset = min((float)minOffset,(float)neighborColor00.w));
            }
            float4 neighborColor01 = SSRTexture.sample(nearestSampler, ((input).uv - float2((float(1.0) / (cbExtendCamera.viewPortSize).x), (float)0.0)));
            float4 neighborColorB01 = SSRTexture.sample(bilinearSampler, ((input).uv - float2((float(1.0) / (cbExtendCamera.viewPortSize).x), (float)0.0)));
            if (neighborColor01.w > float(0.0))
            {
                (minOffset = min((float)minOffset,(float)neighborColor01.w));
            }
            float4 neighborColor02 = SSRTexture.sample(nearestSampler, ((input).uv + float2((float)0.0, (float(1.0) / (cbExtendCamera.viewPortSize).y))));
            float4 neighborColorB02 = SSRTexture.sample(bilinearSampler, ((input).uv + float2((float)0.0, (float(1.0) / (cbExtendCamera.viewPortSize).y))));
            if (neighborColor02.w > float(0.0))
            {
                (minOffset = min((float)minOffset,(float)neighborColor02.w));
            }
            float4 neighborColor03 = SSRTexture.sample(nearestSampler, ((input).uv - float2((float)0.0, (float(1.0) / (cbExtendCamera.viewPortSize).y))));
            float4 neighborColorB03 = SSRTexture.sample(bilinearSampler, ((input).uv - float2((float)0.0, (float(1.0) / (cbExtendCamera.viewPortSize).y))));
            if (neighborColor03.w > float(0.0))
            {
                (minOffset = min((float)minOffset,(float)neighborColor03.w));
            }
            float4 neighborColor04 = SSRTexture.sample(nearestSampler, ((input).uv + float2((float(1.0) / (cbExtendCamera.viewPortSize).x), (float(1.0) / (cbExtendCamera.viewPortSize).y))));
            float4 neighborColorB04 = SSRTexture.sample(bilinearSampler, ((input).uv + float2((float(1.0) / (cbExtendCamera.viewPortSize).x), (float(1.0) / (cbExtendCamera.viewPortSize).y))));
            float4 neighborColor05 = SSRTexture.sample(nearestSampler, ((input).uv + float2((float(1.0) / (cbExtendCamera.viewPortSize).x), (float((-1.0)) / (cbExtendCamera.viewPortSize).y))));
            float4 neighborColorB05 = SSRTexture.sample(bilinearSampler, ((input).uv + float2((float(1.0) / (cbExtendCamera.viewPortSize).x), (float((-1.0)) / (cbExtendCamera.viewPortSize).y))));
            float4 neighborColor06 = SSRTexture.sample(nearestSampler, ((input).uv + float2((float((-1.0)) / (cbExtendCamera.viewPortSize).x), (float(1.0) / (cbExtendCamera.viewPortSize).y))));
            float4 neighborColorB06 = SSRTexture.sample(bilinearSampler, ((input).uv + float2((float((-1.0)) / (cbExtendCamera.viewPortSize).x), (float(1.0) / (cbExtendCamera.viewPortSize).y))));
            float4 neighborColor07 = SSRTexture.sample(nearestSampler, ((input).uv - float2((float(1.0) / (cbExtendCamera.viewPortSize).x), (float(1.0) / (cbExtendCamera.viewPortSize).y))));
            float4 neighborColorB07 = SSRTexture.sample(bilinearSampler, ((input).uv - float2((float(1.0) / (cbExtendCamera.viewPortSize).x), (float(1.0) / (cbExtendCamera.viewPortSize).y))));
            bool bUseExpensiveHolePatching = (cbProperties.useExpensiveHolePatching > float(0.5));
            if (bUseExpensiveHolePatching)
            {
                if (neighborColor04.w > float(0.0))
                {
                    (minOffset = min((float)minOffset,(float)neighborColor04.w));
                }
                if (neighborColor05.w > float(0.0))
                {
                    (minOffset = min((float)minOffset,(float)neighborColor05.w));
                }
                if (neighborColor06.w > float(0.0))
                {
                    (minOffset = min((float)minOffset,(float)neighborColor06.w));
                }
                if (neighborColor07.w > float(0.0))
                {
                    (minOffset = min((float)minOffset,(float)neighborColor07.w));
                }
            }
            float blendValue = float(0.5);
            if (bUseExpensiveHolePatching)
            {
                if (minOffset == (neighborColor00).w)
                {
                    (outColor = mix(neighborColor00, neighborColorB00, float4(blendValue)));
                }
                else if ((minOffset == (neighborColor01).w))
                {
                    (outColor = mix(neighborColor01, neighborColorB01, float4(blendValue)));
                }
                else if ((minOffset == (neighborColor02).w))
                {
                    (outColor = mix(neighborColor02, neighborColorB02, float4(blendValue)));
                }
                else if ((minOffset == (neighborColor03).w))
                {
                    (outColor = mix(neighborColor03, neighborColorB03, float4(blendValue)));
                }
                else if ((minOffset == (neighborColor04).w))
                {
                    (outColor = mix(neighborColor04, neighborColorB04, float4(blendValue)));
                }
                else if ((minOffset == (neighborColor05).w))
                {
                    (outColor = mix(neighborColor05, neighborColorB05, float4(blendValue)));
                }
                else if ((minOffset == (neighborColor06).w))
                {
                    (outColor = mix(neighborColor06, neighborColorB06, float4(blendValue)));
                }
                else if ((minOffset == (neighborColor07).w))
                {
                    (outColor = mix(neighborColor07, neighborColorB07, float4(blendValue)));
                }
            }
            else
            {
                if (minOffset == (neighborColor00).w)
                {
                    (outColor = mix(neighborColor00, neighborColorB00, float4(blendValue)));
                }
                else if ((minOffset == (neighborColor01).w))
                {
                    (outColor = mix(neighborColor01, neighborColorB01, float4(blendValue)));
                }
                else if ((minOffset == (neighborColor02).w))
                {
                    (outColor = mix(neighborColor02, neighborColorB02, float4(blendValue)));
                }
                else if ((minOffset == (neighborColor03).w))
                {
                    (outColor = mix(neighborColor03, neighborColorB03, float4(blendValue)));
                }
            }
            if (minOffset <= threshold)
            {
                ((outColor).w = float(1.0));
            }
            else
            {
                ((outColor).w = float(0.0));
            }
        }
        if (cbProperties.renderMode == uint(3))
        {
            if (ssrColor.w <= float(0.0))
            {
                (outColor = SceneTexture.sample(bilinearSampler, (input).uv));
            }
        }
        if (cbProperties.renderMode == uint(2))
        {
            (outColor = ((outColor * float4(cbProperties.intensity)) + SceneTexture.sample(bilinearSampler, (input).uv)));
        }
        return outColor;
    };

    Fragment_Shader(constant Uniforms_cbExtendCamera& cbExtendCamera, texture2d<float> SceneTexture, texture2d<float> SSRTexture, constant Uniforms_cbProperties& cbProperties, sampler nearestSampler, sampler bilinearSampler) :
        cbExtendCamera(cbExtendCamera), SceneTexture(SceneTexture), SSRTexture(SSRTexture), cbProperties(cbProperties), nearestSampler(nearestSampler), bilinearSampler(bilinearSampler)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float2 TEXCOORD0;
};

struct ArgBuffer0
{
    texture2d<float> SceneTexture [[id(1)]];
    texture2d<float> SSRTexture [[id(2)]];
    sampler nearestSampler [[id(4)]];
    sampler bilinearSampler [[id(5)]];
};

struct ArgBuffer1
{
    constant Fragment_Shader::Uniforms_cbExtendCamera& cbExtendCamera [[id(0)]];
    constant Fragment_Shader::Uniforms_cbProperties& cbProperties [[id(3)]];
};

fragment float4 stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.uv = inputData.TEXCOORD0;
    Fragment_Shader main(argBuffer1.cbExtendCamera, argBuffer0.SceneTexture, argBuffer0.SSRTexture, argBuffer1.cbProperties, argBuffer0.nearestSampler, argBuffer0.bilinearSampler);
    return main.main(input0);
}
