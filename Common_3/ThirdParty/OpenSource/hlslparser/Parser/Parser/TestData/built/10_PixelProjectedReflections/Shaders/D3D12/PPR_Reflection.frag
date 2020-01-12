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
RWStructuredBuffer<uint> IntermediateBuffer : register(u2);
Texture2D<float4> DepthTexture : register(t3);
struct PlaneInfo
{
    float4x4 rotMat;
    float4 centerPoint;
    float4 size;
};
cbuffer planeInfoBuffer : register(b4, space1)
{
    PlaneInfo planeInfo[4];
    uint numPlanes;
    uint pad00;
    uint pad01;
    uint pad02;
};

cbuffer cbProperties : register(b5, space1)
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

SamplerState defaultSampler : register(s6);
bool intersectPlane(in uint index, in float3 worldPos, in float2 fragUV, out float4 hitPos, out float2 relfectedUVonPlanar)
{
    PlaneInfo thisPlane = planeInfo[index];
    float4x4 thisPlanesMat = thisPlane.rotMat;
    (thisPlanesMat = transpose(thisPlanesMat));
    float3 normalVec = thisPlane.rotMat[2].xyz;
    float3 centerPoint = thisPlane.centerPoint.xyz;
    float3 rO = cameraWorldPos.xyz;
    float3 rD = normalize((worldPos - rO));
    float3 rD_VS = mul((float3x3 )(viewMat), rD);
    if (rD_VS.z < (float )(0.0))
    {
        return false;
    }
    float denom = dot(normalVec, rD);
    if (denom < (float )(0.0))
    {
        float3 p0l0 = (centerPoint - rO);
        float t = (dot(normalVec, p0l0) / denom);
        if (t <= (float )(0.0))
        {
            return false;
        }
        float3 hitPoint = (rO + (rD * (float3 )(t)));
        float3 gap = (hitPoint - centerPoint);
        float xGap = dot(gap, thisPlane.rotMat[0].xyz);
        float yGap = dot(gap, thisPlane.rotMat[1].xyz);
        float width = (thisPlane.size.x * (float )(0.5));
        float height = (thisPlane.size.y * (float )(0.5));
        float4 reflectedPos;
        if (abs(xGap) <= width && (abs(yGap) <= height))
        {
            (hitPos = float4(hitPoint, 1.0));
            (reflectedPos = mul(viewProjMat, hitPos));
            (reflectedPos /= (float4 )(reflectedPos.w));
            (reflectedPos.xy = float2(((reflectedPos.x + (float )(1.0)) * (float )(0.5)), (((float )(1.0) - reflectedPos.y) * (float )(0.5))));
            float depth = DepthTexture.Sample(defaultSampler, reflectedPos.xy).r;
            if (depth <= reflectedPos.z)
            {
                return false;
            }
            if (reflectedPos.x < (float )(0.0) || (reflectedPos.y < (float )(0.0)) || (reflectedPos.x > (float )(1.0)) || (reflectedPos.y > (float )(1.0)))
            {
                return false;
            }
            else
            {
                (relfectedUVonPlanar = ((float2((xGap / width), (yGap / height)) * (float2 )(0.5)) + float2(0.5, 0.5)));
                (relfectedUVonPlanar *= float2(thisPlane.size.zw));
                return true;
            }
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
};

float4 unPacked(in uint unpacedInfo, in float2 dividedViewSize, out uint CoordSys)
{
    float YInt = float((unpacedInfo >> (uint )(20)));
    int YFrac = int(((unpacedInfo & 917504) >> (uint )(17)));
    uint uXInt = ((unpacedInfo & 65536) >> (uint )(16));
    float XInt = (float )(0.0);
    if (uXInt == (uint )(0))
    {
        (XInt = float(int(((unpacedInfo & 131040) >> (uint )(5)))));
    }
    else
    {
        (XInt = float(int((((unpacedInfo & 131040) >> (uint )(5)) | 4294963200))));
    }
    int XFrac = int(((unpacedInfo & 28) >> (uint )(2)));
    float Yfrac = (float )((half )(YFrac) * 0.125);
    float Xfrac = (float )((half )(XFrac) * 0.125);
    (CoordSys = (unpacedInfo & 3));
    float2 offset = float2(0.0, 0.0);
    if (CoordSys == (uint )(0))
    {
        (offset = float2((XInt / dividedViewSize.x), (YInt / dividedViewSize.y)));
    }
    else if ((CoordSys == (uint )(1)))
    {
        (offset = float2((YInt / dividedViewSize.x), (XInt / dividedViewSize.y)));
    }
    else if ((CoordSys == (uint )(2)))
    {
        (offset = float2((XInt / dividedViewSize.x), (-YInt / dividedViewSize.y)));
    }
    else if ((CoordSys == (uint )(3)))
    {
        (offset = float2((-YInt / dividedViewSize.x), (XInt / dividedViewSize.y)));
    }
    return float4(offset, Xfrac, Yfrac);
};

float4 getWorldPosition(float2 UV, float depth)
{
    float4 worldPos = mul(InvViewProjMat, float4(((UV.x * (float )(2.0)) - (float )(1.0)), ((((float )(1.0) - UV.y) * (float )(2.0)) - (float )(1.0)), depth, 1.0));
    (worldPos /= (float4 )(worldPos.w));
    return worldPos;
};

float fade(float2 UV)
{
    float2 NDC = ((UV * (float2 )(2.0)) - float2(1.0, 1.0));
    return clamp(((float )(1.0) - max(pow((NDC.y * NDC.y), (const float )(4.0)), pow((NDC.x * NDC.x), (const float )(4.0)))), (const float )(0.0), (const float )(1.0));
};

struct VSOutput
{
    float4 Position : SV_POSITION;
    float2 uv : TEXCOORD0;
};
float4 main(VSOutput input) : SV_TARGET
{
    float4 outColor = float4(0.0, 0.0, 0.0, 0.0);
    uint screenWidth = uint(viewPortSize.x);
    uint screenHeight = uint(viewPortSize.y);
    uint indexY = uint((input.uv.y * viewPortSize.y));
    uint indexX = uint((input.uv.x * viewPortSize.x));
    uint index = ((indexY * screenWidth) + indexX);
    uint bufferInfo = IntermediateBuffer[index];
    bool bIsInterect = false;
    uint CoordSys;
    float2 offset = unPacked(bufferInfo, viewPortSize.xy, CoordSys).xy;
    float depth = DepthTexture.Sample(defaultSampler, input.uv).r;
    float4 worldPos = getWorldPosition(input.uv, depth);
    float4 HitPos_WS;
    float2 UVforNormalMap = float2(0.0, 0.0);
    float4 minHitPos_WS;
    float2 minUVforNormalMap = UVforNormalMap;
    bool bUseNormal = (((useNormalMap > (float )(0.5)))?(true):(false));
    float minDist = (float )(1000000.0);
    int shownedReflector = -1;
    for (uint i = (uint )(0); (i < numPlanes); i++)
    {
        if (intersectPlane(i, worldPos.xyz, input.uv, HitPos_WS, UVforNormalMap))
        {
            float localDist = distance(HitPos_WS.xyz, cameraWorldPos.xyz);
            if (localDist < minDist)
            {
                (minDist = localDist);
                (minHitPos_WS = HitPos_WS);
                (minUVforNormalMap = UVforNormalMap);
                (shownedReflector = (int )(i));
            }
            (bIsInterect = true);
        }
    }
    if (!bIsInterect)
    {
        InterlockedMax(IntermediateBuffer[index], (uint )(4294967295));
        return outColor;
    }
    float2 relfectedUV = (input.uv + offset.xy);
    float offsetLen = 3.402823e+38;
    if (bufferInfo < (uint )(4294967295))
    {
        float correctionPixel = (float )(1.0);
        if (CoordSys == (uint )(0))
        {
            (relfectedUV = (relfectedUV.xy + float2(0.0, (correctionPixel / viewPortSize.y))));
        }
        else if ((CoordSys == (uint )(1)))
        {
            (relfectedUV = (relfectedUV.xy + float2((correctionPixel / viewPortSize.x), 0.0)));
        }
        else if ((CoordSys == (uint )(2)))
        {
            (relfectedUV = (relfectedUV.xy - float2(0.0, (correctionPixel / viewPortSize.y))));
        }
        else if ((CoordSys == (uint )(3)))
        {
            (relfectedUV = (relfectedUV.xy - float2((correctionPixel / viewPortSize.x), 0.0)));
        }
        (offsetLen = length(offset.xy));
        (outColor = SceneTexture.SampleLevel(defaultSampler, relfectedUV, (const float )(0)));
        if (useFadeEffect > (float )(0.5))
        {
            (outColor *= (float4 )(fade(relfectedUV)));
        }
        (outColor.w = offsetLen);
    }
    else
    {
        (outColor.w = 3.402823e+38);
    }
    InterlockedMax(IntermediateBuffer[index], (uint )(4294967295));
    return outColor;
};

