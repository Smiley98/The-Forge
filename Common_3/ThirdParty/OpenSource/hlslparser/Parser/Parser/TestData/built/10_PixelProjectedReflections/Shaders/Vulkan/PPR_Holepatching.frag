#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec2 fragInput_TEXCOORD0;
layout(location = 0) out vec4 rast_FragData0; 

layout(row_major, set = 1, binding = 0) uniform cbExtendCamera
{
    mat4 viewMat;
    mat4 projMat;
    mat4 viewProjMat;
    mat4 InvViewProjMat;
    vec4 cameraWorldPos;
    vec4 viewPortSize;
};

layout(set = 0, binding = 1) uniform texture2D SceneTexture;
layout(set = 0, binding = 2) uniform texture2D SSRTexture;
layout(row_major, set = 1, binding = 3) uniform cbProperties
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

layout(set = 0, binding = 4) uniform sampler nearestSampler;
layout(set = 0, binding = 5) uniform sampler bilinearSampler;
struct VSOutput
{
    vec4 Position;
    vec2 uv;
};
vec4 HLSLmain(VSOutput input1)
{
    vec4 outColor;
    vec4 ssrColor = texture(sampler2D(SSRTexture, nearestSampler), (input1).uv);
    if((renderMode == uint(0)))
    {
        return texture(sampler2D(SceneTexture, bilinearSampler), (input1).uv);
    }
    else if ((renderMode == uint(1)))
    {
        (outColor = vec4(0.0, 0.0, 0.0, 0.0));
    }
    if((useHolePatching < float(0.5)))
    {
        ((outColor).w = float(1.0));
        if(((ssrColor).w > float(0.0)))
        {
            (outColor = ssrColor);
        }
    }
    else if (((ssrColor).w > float(0.0)))
    {
        float threshold = (ssrColor).w;
        float minOffset = threshold;
        vec4 neighborColor00 = texture(sampler2D(SSRTexture, nearestSampler), ((input1).uv + vec2((float(1.0) / (viewPortSize).x), 0.0)));
        vec4 neighborColorB00 = texture(sampler2D(SSRTexture, bilinearSampler), ((input1).uv + vec2((float(1.0) / (viewPortSize).x), 0.0)));
        if(((neighborColor00).w > float(0.0)))
        {
            (minOffset = min(minOffset, (neighborColor00).w));
        }
        vec4 neighborColor01 = texture(sampler2D(SSRTexture, nearestSampler), ((input1).uv - vec2((float(1.0) / (viewPortSize).x), 0.0)));
        vec4 neighborColorB01 = texture(sampler2D(SSRTexture, bilinearSampler), ((input1).uv - vec2((float(1.0) / (viewPortSize).x), 0.0)));
        if(((neighborColor01).w > float(0.0)))
        {
            (minOffset = min(minOffset, (neighborColor01).w));
        }
        vec4 neighborColor02 = texture(sampler2D(SSRTexture, nearestSampler), ((input1).uv + vec2(0.0, (float(1.0) / (viewPortSize).y))));
        vec4 neighborColorB02 = texture(sampler2D(SSRTexture, bilinearSampler), ((input1).uv + vec2(0.0, (float(1.0) / (viewPortSize).y))));
        if(((neighborColor02).w > float(0.0)))
        {
            (minOffset = min(minOffset, (neighborColor02).w));
        }
        vec4 neighborColor03 = texture(sampler2D(SSRTexture, nearestSampler), ((input1).uv - vec2(0.0, (float(1.0) / (viewPortSize).y))));
        vec4 neighborColorB03 = texture(sampler2D(SSRTexture, bilinearSampler), ((input1).uv - vec2(0.0, (float(1.0) / (viewPortSize).y))));
        if(((neighborColor03).w > float(0.0)))
        {
            (minOffset = min(minOffset, (neighborColor03).w));
        }
        vec4 neighborColor04 = texture(sampler2D(SSRTexture, nearestSampler), ((input1).uv + vec2((float(1.0) / (viewPortSize).x), (float(1.0) / (viewPortSize).y))));
        vec4 neighborColorB04 = texture(sampler2D(SSRTexture, bilinearSampler), ((input1).uv + vec2((float(1.0) / (viewPortSize).x), (float(1.0) / (viewPortSize).y))));
        vec4 neighborColor05 = texture(sampler2D(SSRTexture, nearestSampler), ((input1).uv + vec2((float(1.0) / (viewPortSize).x), (float((-1.0)) / (viewPortSize).y))));
        vec4 neighborColorB05 = texture(sampler2D(SSRTexture, bilinearSampler), ((input1).uv + vec2((float(1.0) / (viewPortSize).x), (float((-1.0)) / (viewPortSize).y))));
        vec4 neighborColor06 = texture(sampler2D(SSRTexture, nearestSampler), ((input1).uv + vec2((float((-1.0)) / (viewPortSize).x), (float(1.0) / (viewPortSize).y))));
        vec4 neighborColorB06 = texture(sampler2D(SSRTexture, bilinearSampler), ((input1).uv + vec2((float((-1.0)) / (viewPortSize).x), (float(1.0) / (viewPortSize).y))));
        vec4 neighborColor07 = texture(sampler2D(SSRTexture, nearestSampler), ((input1).uv - vec2((float(1.0) / (viewPortSize).x), (float(1.0) / (viewPortSize).y))));
        vec4 neighborColorB07 = texture(sampler2D(SSRTexture, bilinearSampler), ((input1).uv - vec2((float(1.0) / (viewPortSize).x), (float(1.0) / (viewPortSize).y))));
        bool bUseExpensiveHolePatching = (useExpensiveHolePatching > float(0.5));
        if(bUseExpensiveHolePatching)
        {
            if(((neighborColor04).w > float(0.0)))
            {
                (minOffset = min(minOffset, (neighborColor04).w));
            }
            if(((neighborColor05).w > float(0.0)))
            {
                (minOffset = min(minOffset, (neighborColor05).w));
            }
            if(((neighborColor06).w > float(0.0)))
            {
                (minOffset = min(minOffset, (neighborColor06).w));
            }
            if(((neighborColor07).w > float(0.0)))
            {
                (minOffset = min(minOffset, (neighborColor07).w));
            }
        }
        float blendValue = float(0.5);
        if(bUseExpensiveHolePatching)
        {
            if((minOffset == (neighborColor00).w))
            {
                (outColor = mix(neighborColor00, neighborColorB00, vec4(blendValue)));
            }
            else if ((minOffset == (neighborColor01).w))
            {
                (outColor = mix(neighborColor01, neighborColorB01, vec4(blendValue)));
            }
            else if ((minOffset == (neighborColor02).w))
            {
                (outColor = mix(neighborColor02, neighborColorB02, vec4(blendValue)));
            }
            else if ((minOffset == (neighborColor03).w))
            {
                (outColor = mix(neighborColor03, neighborColorB03, vec4(blendValue)));
            }
            else if ((minOffset == (neighborColor04).w))
            {
                (outColor = mix(neighborColor04, neighborColorB04, vec4(blendValue)));
            }
            else if ((minOffset == (neighborColor05).w))
            {
                (outColor = mix(neighborColor05, neighborColorB05, vec4(blendValue)));
            }
            else if ((minOffset == (neighborColor06).w))
            {
                (outColor = mix(neighborColor06, neighborColorB06, vec4(blendValue)));
            }
            else if ((minOffset == (neighborColor07).w))
            {
                (outColor = mix(neighborColor07, neighborColorB07, vec4(blendValue)));
            }
        }
        else
        {
            if((minOffset == (neighborColor00).w))
            {
                (outColor = mix(neighborColor00, neighborColorB00, vec4(blendValue)));
            }
            else if ((minOffset == (neighborColor01).w))
            {
                (outColor = mix(neighborColor01, neighborColorB01, vec4(blendValue)));
            }
            else if ((minOffset == (neighborColor02).w))
            {
                (outColor = mix(neighborColor02, neighborColorB02, vec4(blendValue)));
            }
            else if ((minOffset == (neighborColor03).w))
            {
                (outColor = mix(neighborColor03, neighborColorB03, vec4(blendValue)));
            }
        }
        if((minOffset <= threshold))
        {
            ((outColor).w = float(1.0));
        }
        else
        {
            ((outColor).w = float(0.0));
        }
    }
    if((renderMode == uint(3)))
    {
        if(((ssrColor).w <= float(0.0)))
        {
            (outColor = texture(sampler2D(SceneTexture, bilinearSampler), (input1).uv));
        }
    }
    if((renderMode == uint(2)))
    {
        (outColor = ((outColor * vec4(intensity)) + texture(sampler2D(SceneTexture, bilinearSampler), (input1).uv)));
    }
    return outColor;
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.uv = fragInput_TEXCOORD0;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
