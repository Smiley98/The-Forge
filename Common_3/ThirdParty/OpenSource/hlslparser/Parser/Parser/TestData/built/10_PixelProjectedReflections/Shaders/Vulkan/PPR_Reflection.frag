#version 450 core

precision highp float;
precision highp int; 
vec3 MulMat(mat3 lhs, vec3 rhs)
{
    vec3 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1] + lhs[0][2]*rhs[2];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1] + lhs[1][2]*rhs[2];
	dst[2] = lhs[2][0]*rhs[0] + lhs[2][1]*rhs[1] + lhs[2][2]*rhs[2];
    return dst;
}

vec4 MulMat(mat4 lhs, vec4 rhs)
{
    vec4 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1] + lhs[0][2]*rhs[2] + lhs[0][3]*rhs[3];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1] + lhs[1][2]*rhs[2] + lhs[1][3]*rhs[3];
	dst[2] = lhs[2][0]*rhs[0] + lhs[2][1]*rhs[1] + lhs[2][2]*rhs[2] + lhs[2][3]*rhs[3];
	dst[3] = lhs[3][0]*rhs[0] + lhs[3][1]*rhs[1] + lhs[3][2]*rhs[2] + lhs[3][3]*rhs[3];
    return dst;
}


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
layout(row_major, set=0, binding=2) buffer IntermediateBuffer
{
    uint IntermediateBuffer_Data[];
};

layout(set = 0, binding = 3) uniform texture2D DepthTexture;
struct PlaneInfo
{
    mat4 rotMat;
    vec4 centerPoint;
    vec4 size;
};
layout(row_major, set = 1, binding = 4) uniform planeInfoBuffer
{
    PlaneInfo planeInfo[4];
    uint numPlanes;
    uint pad00;
    uint pad01;
    uint pad02;
};

layout(row_major, set = 1, binding = 5) uniform cbProperties
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

layout(set = 0, binding = 6) uniform sampler defaultSampler;
bool intersectPlane(in uint index, in vec3 worldPos, in vec2 fragUV, out vec4 hitPos, out vec2 relfectedUVonPlanar)
{
    PlaneInfo thisPlane = planeInfo[index];
    mat4 thisPlanesMat = (thisPlane).rotMat;
    (thisPlanesMat = transpose(thisPlanesMat));
    vec3 normalVec = ((thisPlane).rotMat[2]).xyz;
    vec3 centerPoint = ((thisPlane).centerPoint).xyz;
    vec3 rO = (cameraWorldPos).xyz;
    vec3 rD = normalize((worldPos - rO));
    vec3 rD_VS = MulMat(mat3(viewMat),rD);
    if(((rD_VS).z < float(0.0)))
    {
        return false;
    }
    float denom = dot(normalVec, rD);
    if((denom < float(0.0)))
    {
        vec3 p0l0 = (centerPoint - rO);
        float t = (dot(normalVec, p0l0) / denom);
        if((t <= float(0.0)))
        {
            return false;
        }
        vec3 hitPoint = (rO + (rD * vec3(t)));
        vec3 gap = (hitPoint - centerPoint);
        float xGap = dot(gap, ((thisPlane).rotMat[0]).xyz);
        float yGap = dot(gap, ((thisPlane).rotMat[1]).xyz);
        float width = (((thisPlane).size).x * float(0.5));
        float height = (((thisPlane).size).y * float(0.5));
        vec4 reflectedPos;
        if(((abs(xGap) <= width) && (abs(yGap) <= height)))
        {
            (hitPos = vec4(hitPoint, 1.0));
            (reflectedPos = MulMat(viewProjMat,hitPos));
            (reflectedPos /= vec4((reflectedPos).w));
            ((reflectedPos).xy = vec2((((reflectedPos).x + float(1.0)) * float(0.5)), ((float(1.0) - (reflectedPos).y) * float(0.5))));
            float depth = (texture(sampler2D(DepthTexture, defaultSampler), (reflectedPos).xy)).r;
            if((depth <= (reflectedPos).z))
            {
                return false;
            }
            if((((((reflectedPos).x < float(0.0)) || ((reflectedPos).y < float(0.0))) || ((reflectedPos).x > float(1.0))) || ((reflectedPos).y > float(1.0))))
            {
                return false;
            }
            else
            {
                (relfectedUVonPlanar = ((vec2((xGap / width), (yGap / height)) * vec2(0.5)) + vec2(0.5, 0.5)));
                (relfectedUVonPlanar *= vec2(((thisPlane).size).zw));
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
}
vec4 unPacked(in uint unpacedInfo, in vec2 dividedViewSize, out uint CoordSys)
{
    float YInt = float((unpacedInfo >> uint(20)));
    int YFrac = int(((unpacedInfo & 917504u) >> uint(17)));
    uint uXInt = ((unpacedInfo & 65536u) >> uint(16));
    float XInt = float(0.0);
    if((uXInt == uint(0)))
    {
        (XInt = float(int(((unpacedInfo & 131040u) >> uint(5)))));
    }
    else
    {
        (XInt = float(int((((unpacedInfo & 131040u) >> uint(5)) | 4294963200u))));
    }
    int XFrac = int(((unpacedInfo & 28u) >> uint(2)));
    float Yfrac = float((float(YFrac) * 0.125));
    float Xfrac = float((float(XFrac) * 0.125));
    (CoordSys = (unpacedInfo & 3u));
    vec2 offset = vec2(0.0, 0.0);
    if((CoordSys == uint(0)))
    {
        (offset = vec2((XInt / (dividedViewSize).x), (YInt / (dividedViewSize).y)));
    }
    else if ((CoordSys == uint(1)))
    {
        (offset = vec2((YInt / (dividedViewSize).x), (XInt / (dividedViewSize).y)));
    }
    else if ((CoordSys == uint(2)))
    {
        (offset = vec2((XInt / (dividedViewSize).x), ((-YInt) / (dividedViewSize).y)));
    }
    else if ((CoordSys == uint(3)))
    {
        (offset = vec2(((-YInt) / (dividedViewSize).x), (XInt / (dividedViewSize).y)));
    }
    return vec4(offset, Xfrac, Yfrac);
}
vec4 getWorldPosition(vec2 UV, float depth)
{
    vec4 worldPos = MulMat(InvViewProjMat,vec4((((UV).x * float(2.0)) - float(1.0)), (((float(1.0) - (UV).y) * float(2.0)) - float(1.0)), depth, 1.0));
    (worldPos /= vec4((worldPos).w));
    return worldPos;
}
float fade(vec2 UV)
{
    vec2 NDC = ((UV * vec2(2.0)) - vec2(1.0, 1.0));
    return clamp((float(1.0) - max(pow(((NDC).y * (NDC).y),float(float(4.0))), pow(((NDC).x * (NDC).x),float(float(4.0))))), float(0.0), float(1.0));
}
struct VSOutput
{
    vec4 Position;
    vec2 uv;
};
vec4 HLSLmain(VSOutput input1)
{
    vec4 outColor = vec4(0.0, 0.0, 0.0, 0.0);
    uint screenWidth = uint((viewPortSize).x);
    uint screenHeight = uint((viewPortSize).y);
    uint indexY = uint((((input1).uv).y * (viewPortSize).y));
    uint indexX = uint((((input1).uv).x * (viewPortSize).x));
    uint index = ((indexY * screenWidth) + indexX);
    uint bufferInfo = IntermediateBuffer_Data[index];
    bool bIsInterect = false;
    uint CoordSys;
    vec2 offset = (unPacked(bufferInfo, (viewPortSize).xy, CoordSys)).xy;
    float depth = (texture(sampler2D(DepthTexture, defaultSampler), (input1).uv)).r;
    vec4 worldPos = getWorldPosition((input1).uv, depth);
    vec4 HitPos_WS;
    vec2 UVforNormalMap = vec2(0.0, 0.0);
    vec4 minHitPos_WS;
    vec2 minUVforNormalMap = UVforNormalMap;
    bool bUseNormal = (((useNormalMap > float(0.5)))?(true):(false));
    float minDist = float(1000000.0);
    int shownedReflector = (-1);
    for (uint i = uint(0); (i < numPlanes); (i++))
    {
        if(intersectPlane(i, (worldPos).xyz, (input1).uv, HitPos_WS, UVforNormalMap))
        {
            float localDist = distance((HitPos_WS).xyz, (cameraWorldPos).xyz);
            if((localDist < minDist))
            {
                (minDist = localDist);
                (minHitPos_WS = HitPos_WS);
                (minUVforNormalMap = UVforNormalMap);
                (shownedReflector = int(i));
            }
            (bIsInterect = true);
        }
    }
    if((!bIsInterect))
    {
        ;
        return outColor;
    }
    vec2 relfectedUV = ((input1).uv + (offset).xy);
    float offsetLen = 3.402823e+38;
    if((bufferInfo < uint(4294967295u)))
    {
        float correctionPixel = float(1.0);
        if((CoordSys == uint(0)))
        {
            (relfectedUV = ((relfectedUV).xy + vec2(0.0, (correctionPixel / (viewPortSize).y))));
        }
        else if ((CoordSys == uint(1)))
        {
            (relfectedUV = ((relfectedUV).xy + vec2((correctionPixel / (viewPortSize).x), 0.0)));
        }
        else if ((CoordSys == uint(2)))
        {
            (relfectedUV = ((relfectedUV).xy - vec2(0.0, (correctionPixel / (viewPortSize).y))));
        }
        else if ((CoordSys == uint(3)))
        {
            (relfectedUV = ((relfectedUV).xy - vec2((correctionPixel / (viewPortSize).x), 0.0)));
        }
        (offsetLen = length((offset).xy));
        (outColor = textureLod(sampler2D(SceneTexture, defaultSampler), relfectedUV, float(0)));
        if((useFadeEffect > float(0.5)))
        {
            (outColor *= vec4(fade(relfectedUV)));
        }
        ((outColor).w = offsetLen);
    }
    else
    {
        ((outColor).w = 3.402823e+38);
    }
    ;
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
