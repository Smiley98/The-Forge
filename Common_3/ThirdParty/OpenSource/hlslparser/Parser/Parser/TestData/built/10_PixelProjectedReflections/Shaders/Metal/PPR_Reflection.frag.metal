#include <metal_stdlib>
#include <metal_atomic>
using namespace metal;

inline float3x3 matrix_ctor(float4x4 m)
{
        return float3x3(m[0].xyz, m[1].xyz, m[2].xyz);
}
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
    device uint* IntermediateBuffer;
    texture2d<float> DepthTexture;
    struct PlaneInfo
    {
        float4x4 rotMat;
        float4 centerPoint;
        float4 size;
    };
    struct Uniforms_planeInfoBuffer
    {
        array<PlaneInfo, 4> planeInfo;
        uint numPlanes;
        uint pad00;
        uint pad01;
        uint pad02;
    };
    constant Uniforms_planeInfoBuffer& planeInfoBuffer;
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
    sampler defaultSampler;
    bool intersectPlane(uint index, float3 worldPos, float2 fragUV, thread float4(& hitPos), thread float2(& relfectedUVonPlanar))
    {
        PlaneInfo thisPlane = planeInfoBuffer.planeInfo[index];
        float4x4 thisPlanesMat = (thisPlane).rotMat;
        (thisPlanesMat = transpose(thisPlanesMat));
        float3 normalVec = ((thisPlane).rotMat[2]).xyz;
        float3 centerPoint = ((thisPlane).centerPoint).xyz;
        float3 rO = (cbExtendCamera.cameraWorldPos).xyz;
        float3 rD = normalize((worldPos - rO));
        float3 rD_VS = ((matrix_ctorcbExtendCamera.viewMat)*(rD));
        if (rD_VS.z < float(0.0))
        {
            return false;
        }
        float denom = dot(normalVec, rD);
        if (denom < float(0.0))
        {
            float3 p0l0 = (centerPoint - rO);
            float t = (dot(normalVec, p0l0) / denom);
            if (t <= float(0.0))
            {
                return false;
            }
            float3 hitPoint = (rO + (rD * float3(t)));
            float3 gap = (hitPoint - centerPoint);
            float xGap = dot(gap, ((thisPlane).rotMat[0]).xyz);
            float yGap = dot(gap, ((thisPlane).rotMat[1]).xyz);
            float width = (((thisPlane).size).x * float(0.5));
            float height = (((thisPlane).size).y * float(0.5));
            float4 reflectedPos;
            if (abs(xGap) <= width && (abs(yGap) <= height))
            {
                (hitPos = float4(hitPoint, (float)1.0));
                (reflectedPos = ((cbExtendCamera.viewProjMat)*(hitPos)));
                (reflectedPos /= float4(reflectedPos.w));
                ((reflectedPos).xy = float2((((reflectedPos).x + float(1.0)) * float(0.5)), ((float(1.0) - (reflectedPos).y) * float(0.5))));
                float depth = (DepthTexture.sample(defaultSampler, (reflectedPos).xy)).r;
                if (depth <= (reflectedPos).z)
                {
                    return false;
                }
                if (reflectedPos.x < float(0.0) || ((reflectedPos).y < float(0.0)) || ((reflectedPos).x > float(1.0)) || ((reflectedPos).y > float(1.0)))
                {
                    return false;
                }
                else
                {
                    (relfectedUVonPlanar = ((float2((xGap / width), (yGap / height)) * float2(0.5)) + float2((float)0.5, (float)0.5)));
                    (relfectedUVonPlanar *= float2(((thisPlane).size).zw));
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
    float4 unPacked(uint unpacedInfo, float2 dividedViewSize, thread uint(& CoordSys))
    {
        float YInt = float((float)(unpacedInfo >> uint(20)));
        int YFrac = int((int)((unpacedInfo & 917504u) >> uint(17)));
        uint uXInt = ((unpacedInfo & 65536u) >> uint(16));
        float XInt = float(0.0);
        if (uXInt == uint(0))
        {
            (XInt = float((float)int((int)((unpacedInfo & 131040u) >> uint(5)))));
        }
        else
        {
            (XInt = float((float)int((int)(((unpacedInfo & 131040u) >> uint(5)) | 4294963200u))));
        }
        int XFrac = int((int)((unpacedInfo & 28u) >> uint(2)));
        float Yfrac = float(half(YFrac) * 0.125);
        float Xfrac = float(half(XFrac) * 0.125);
        (CoordSys = (unpacedInfo & 3u));
        float2 offset = float2((float)0.0, (float)0.0);
        if (CoordSys == uint(0))
        {
            (offset = float2((XInt / (dividedViewSize).x), (YInt / (dividedViewSize).y)));
        }
        else if ((CoordSys == uint(1)))
        {
            (offset = float2((YInt / (dividedViewSize).x), (XInt / (dividedViewSize).y)));
        }
        else if ((CoordSys == uint(2)))
        {
            (offset = float2((XInt / (dividedViewSize).x), ((-YInt) / (dividedViewSize).y)));
        }
        else if ((CoordSys == uint(3)))
        {
            (offset = float2(((-YInt) / (dividedViewSize).x), (XInt / (dividedViewSize).y)));
        }
        return float4(offset, Xfrac, Yfrac);
    };
    float4 getWorldPosition(float2 UV, float depth)
    {
        float4 worldPos = ((cbExtendCamera.InvViewProjMat)*(float4((((UV).x * float(2.0)) - float(1.0)), (((float(1.0) - (UV).y) * float(2.0)) - float(1.0)), depth, (float)1.0)));
        (worldPos /= float4(worldPos.w));
        return worldPos;
    };
    float fade(float2 UV)
    {
        float2 NDC = ((UV * float2(2.0)) - float2((float)1.0, (float)1.0));
        return clamp((float(1.0) - max((float)pow(((NDC).y * (NDC).y), float(4.0)),(float)pow(((NDC).x * (NDC).x), float(4.0)))), float(0.0), float(1.0));
    };
    struct VSOutput
    {
        float4 Position;
        float2 uv;
    };
    float4 main(VSOutput input)
    {
        float4 outColor = float4((float)0.0, (float)0.0, (float)0.0, (float)0.0);
        uint screenWidth = uint((uint)(cbExtendCamera.viewPortSize).x);
        uint screenHeight = uint((uint)(cbExtendCamera.viewPortSize).y);
        uint indexY = uint((uint)(((input).uv).y * (cbExtendCamera.viewPortSize).y));
        uint indexX = uint((uint)(((input).uv).x * (cbExtendCamera.viewPortSize).x));
        uint index = ((indexY * screenWidth) + indexX);
        uint bufferInfo = IntermediateBuffer[index];
        bool bIsInterect = false;
        uint CoordSys;
        float2 offset = (unPacked(bufferInfo, (cbExtendCamera.viewPortSize).xy, CoordSys)).xy;
        float depth = (DepthTexture.sample(defaultSampler, (input).uv)).r;
        float4 worldPos = getWorldPosition((input).uv, depth);
        float4 HitPos_WS;
        float2 UVforNormalMap = float2((float)0.0, (float)0.0);
        float4 minHitPos_WS;
        float2 minUVforNormalMap = UVforNormalMap;
        bool bUseNormal = (((cbProperties.useNormalMap > float(0.5)))?(true):(false));
        float minDist = float(1000000.0);
        int shownedReflector = (-1);
        for (uint i = uint(0); (i < planeInfoBuffer.numPlanes); (i++))
        {
            if (intersectPlane(i, (worldPos).xyz, (input).uv, HitPos_WS, UVforNormalMap))
            {
                float localDist = distance((HitPos_WS).xyz, (cbExtendCamera.cameraWorldPos).xyz);
                if (localDist < minDist)
                {
                    (minDist = localDist);
                    (minHitPos_WS = HitPos_WS);
                    (minUVforNormalMap = UVforNormalMap);
                    (shownedReflector = int(i));
                }
                (bIsInterect = true);
            }
        }
        if ((!bIsInterect))
        {
            atomic_fetch_max_explicit(&IntermediateBuffer[index], (uint)4294967295u, memory_order_relaxed);
            return outColor;
        }
        float2 relfectedUV = ((input).uv + (offset).xy);
        float offsetLen = 3.402823e+38;
        if (bufferInfo < (uint)4294967295u)
        {
            float correctionPixel = float(1.0);
            if (CoordSys == uint(0))
            {
                (relfectedUV = ((relfectedUV).xy + float2((float)0.0, (correctionPixel / (cbExtendCamera.viewPortSize).y))));
            }
            else if ((CoordSys == uint(1)))
            {
                (relfectedUV = ((relfectedUV).xy + float2((correctionPixel / (cbExtendCamera.viewPortSize).x), (float)0.0)));
            }
            else if ((CoordSys == uint(2)))
            {
                (relfectedUV = ((relfectedUV).xy - float2((float)0.0, (correctionPixel / (cbExtendCamera.viewPortSize).y))));
            }
            else if ((CoordSys == uint(3)))
            {
                (relfectedUV = ((relfectedUV).xy - float2((correctionPixel / (cbExtendCamera.viewPortSize).x), (float)0.0)));
            }
            (offsetLen = length((offset).xy));
            (outColor = SceneTexture.sample(defaultSampler, relfectedUV, level(float(0))));
            if (cbProperties.useFadeEffect > float(0.5))
            {
                (outColor *= float4(fade(relfectedUV)));
            }
            ((outColor).w = offsetLen);
        }
        else
        {
            ((outColor).w = 3.402823e+38);
        }
        atomic_fetch_max_explicit(&IntermediateBuffer[index], (uint)4294967295u, memory_order_relaxed);
        return outColor;
    };

    Fragment_Shader(constant Uniforms_cbExtendCamera& cbExtendCamera, texture2d<float> SceneTexture, device uint* IntermediateBuffer, texture2d<float> DepthTexture, constant Uniforms_planeInfoBuffer& planeInfoBuffer, constant Uniforms_cbProperties& cbProperties, sampler defaultSampler) :
        cbExtendCamera(cbExtendCamera), SceneTexture(SceneTexture), IntermediateBuffer(IntermediateBuffer), DepthTexture(DepthTexture), planeInfoBuffer(planeInfoBuffer), cbProperties(cbProperties), defaultSampler(defaultSampler)
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
    device Fragment_Shader::uint* IntermediateBuffer [[id(2)]];
    texture2d<float> DepthTexture [[id(3)]];
    sampler defaultSampler [[id(6)]];
};

struct ArgBuffer1
{
    constant Fragment_Shader::Uniforms_cbExtendCamera& cbExtendCamera [[id(0)]];
    constant Fragment_Shader::Uniforms_planeInfoBuffer& planeInfoBuffer [[id(4)]];
    constant Fragment_Shader::Uniforms_cbProperties& cbProperties [[id(5)]];
};

fragment float4 stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.uv = inputData.TEXCOORD0;
    Fragment_Shader main(argBuffer1.cbExtendCamera, argBuffer0.SceneTexture, argBuffer0.IntermediateBuffer, argBuffer0.DepthTexture, argBuffer1.planeInfoBuffer, argBuffer1.cbProperties, argBuffer0.defaultSampler);
    return main.main(input0);
}
