#include <metal_stdlib>
#include <metal_atomic>
#include <metal_compute>
using namespace metal;

inline float3x3 matrix_ctor(float4x4 m)
{
        return float3x3(m[0].xyz, m[1].xyz, m[2].xyz);
}
struct Compute_Shader
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
    sampler defaultSampler;
    float getDistance(float3 planeNormal, float3 planeCenter, float3 worldPos)
    {
        float d = (-dot(planeNormal, planeCenter));
        return ((dot(planeNormal, worldPos) + d) / length(planeNormal));
    };
    bool intersectPlane(uint index, float3 worldPos, float2 fragUV, thread float4(& reflectedPos))
    {
        PlaneInfo thisPlane = planeInfoBuffer.planeInfo[index];
        float3 normalVec = ((thisPlane).rotMat[2]).xyz;
        float3 centerPoint = ((thisPlane).centerPoint).xyz;
        float3 projectedWorldPos = (float3(dot(normalVec, (worldPos - centerPoint))) * normalVec);
        float3 target = (worldPos - (float3(2.0) * projectedWorldPos));
        float dist = getDistance(normalVec, centerPoint, target);
        if (dist >= float(0.0))
        {
            return false;
        }
        float3 rO = (cbExtendCamera.cameraWorldPos).xyz;
        float3 rD = normalize((target - rO));
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
            if (abs(xGap) <= width && (abs(yGap) <= height))
            {
                (reflectedPos = ((cbExtendCamera.viewProjMat)*(float4(hitPoint, (float)1.0))));
                (reflectedPos /= float4(reflectedPos.w));
                ((reflectedPos).xy = float2((((reflectedPos).x + float(1.0)) * float(0.5)), ((float(1.0) - (reflectedPos).y) * float(0.5))));
                float depth = (DepthTexture.sample(defaultSampler, (reflectedPos).xy, level(float(0)))).r;
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
                    for (uint i = uint(0); (i < planeInfoBuffer.numPlanes); (i++))
                    {
                        if (i != index)
                        {
                            PlaneInfo otherPlane = planeInfoBuffer.planeInfo[i];
                            float3 otherNormalVec = ((otherPlane).rotMat[2]).xyz;
                            float3 otherCenterPoint = ((otherPlane).centerPoint).xyz;
                            float innerDenom = dot(otherNormalVec, rD);
                            if (innerDenom < float(0.0))
                            {
                                float3 innerP0l0 = (otherCenterPoint - rO);
                                float innerT = (dot(otherNormalVec, innerP0l0) / innerDenom);
                                if (innerT <= float(0.0))
                                {
                                    continue;
                                }
                                else if ((innerT < t))
                                {
                                    float3 innerhitPoint = (rO + (rD * float3(innerT)));
                                    float3 innergap = (innerhitPoint - otherCenterPoint);
                                    float innerxGap = dot(innergap, ((otherPlane).rotMat[0]).xyz);
                                    float inneryGap = dot(innergap, ((otherPlane).rotMat[1]).xyz);
                                    float innerWidth = (((otherPlane).size).x * float(0.5));
                                    float innerHeight = (((otherPlane).size).y * float(0.5));
                                    if (abs(innerxGap) <= innerWidth && (abs(inneryGap) <= innerHeight))
                                    {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
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
    float4 getWorldPosition(float2 UV, float depth)
    {
        float4 worldPos = ((cbExtendCamera.InvViewProjMat)*(float4((((UV).x * float(2.0)) - float(1.0)), (((float(1.0) - (UV).y) * float(2.0)) - float(1.0)), depth, (float)1.0)));
        (worldPos /= float4(worldPos.w));
        return worldPos;
    };
    uint packInfo(float2 offset)
    {
        uint CoordSys = uint(0);
        uint YInt = uint(0);
        int YFrac = 0;
        int XInt = 0;
        int XFrac = 0;
        if (abs((offset).y) < abs((offset).x))
        {
            if (offset.x < float(0.0))
            {
                (YInt = uint((uint)(-(offset).x)));
                (YFrac = int((int)(fract((offset).x) * float(8.0))));
                (XInt = int((int)(offset).y));
                (XFrac = int((int)(fract((offset).y) * float(8.0))));
                (CoordSys = uint(3));
            }
            else
            {
                (YInt = uint((uint)(offset).x));
                (YFrac = int((int)(fract((offset).x) * float(8.0))));
                (XInt = int((int)(offset).y));
                (XFrac = int((int)(fract((offset).y) * float(8.0))));
                (CoordSys = uint(1));
            }
        }
        else
        {
            if (offset.y < float(0.0))
            {
                (YInt = uint((uint)(-(offset).y)));
                (YFrac = int((int)(fract((offset).y) * float(8.0))));
                (XInt = int((int)(offset).x));
                (XFrac = int((int)(fract((offset).x) * float(8.0))));
                (CoordSys = uint(2));
            }
            else
            {
                (YInt = uint((uint)(offset).y));
                (YFrac = int((int)(fract((offset).y) * float(8.0))));
                (XInt = int((int)(offset).x));
                (XFrac = int((int)(fract((offset).x) * float(8.0))));
                (CoordSys = uint(0));
            }
        }
        return ((((((YInt & 4095u) << uint(20)) | uint(YFrac & int(7u) << 17)) | uint(XInt & int(4095u) << 5)) | uint(XFrac & int(7u) << 2)) | CoordSys);
    };
    void main(uint3 Gid, uint3 DTid, uint3 GTid, uint GI)
    {
        uint screenWidth = uint((uint)(cbExtendCamera.viewPortSize).x);
        uint screenHeight = uint((uint)(cbExtendCamera.viewPortSize).y);
        uint indexDX = (DTid).x;
        if (indexDX >= (screenWidth * screenHeight))
        {
            return;
        }
        uint indexY = (indexDX / screenWidth);
        uint indexX = (indexDX - (screenWidth * indexY));
        float2 fragUV = float2((float(indexX) / (cbExtendCamera.viewPortSize).x), (float(indexY) / (cbExtendCamera.viewPortSize).y));
        float depth = (DepthTexture.sample(defaultSampler, fragUV, level(float(0)))).r;
        if (depth >= float(1.0))
        {
            return;
        }
        float4 worldPos = getWorldPosition(fragUV, depth);
        float4 reflectedPos = float4((float)0.0, (float)0.0, (float)0.0, (float)0.0);
        float2 reflectedUV;
        float2 offset;
        float minDist = float(1000000.0);
        for (uint i = uint(0); (i < planeInfoBuffer.numPlanes); (i++))
        {
            if (intersectPlane(i, (worldPos).xyz, fragUV, reflectedPos))
            {
                (reflectedUV = float2(((reflectedPos).x * (cbExtendCamera.viewPortSize).x), ((reflectedPos).y * (cbExtendCamera.viewPortSize).y)));
                (offset = float2((((fragUV).x - (reflectedPos).x) * (cbExtendCamera.viewPortSize).x), (((fragUV).y - (reflectedPos).y) * (cbExtendCamera.viewPortSize).y)));
                uint newIndex = (uint(reflectedUV.x) + (uint(reflectedUV.y) * screenWidth));
                uint intermediateBufferValue = packInfo(offset);
                atomic_fetch_min_explicit(&IntermediateBuffer[newIndex], intermediateBufferValue, memory_order_relaxed);
            }
        }
    };

    Compute_Shader(constant Uniforms_cbExtendCamera& cbExtendCamera, device uint* IntermediateBuffer, texture2d<float> DepthTexture, constant Uniforms_planeInfoBuffer& planeInfoBuffer, sampler defaultSampler) :
        cbExtendCamera(cbExtendCamera), IntermediateBuffer(IntermediateBuffer), DepthTexture(DepthTexture), planeInfoBuffer(planeInfoBuffer), defaultSampler(defaultSampler)
    {}
};
struct ArgBuffer0
{
    device Compute_Shader::uint* IntermediateBuffer [[id(1)]];
    texture2d<float> DepthTexture [[id(2)]];
    sampler defaultSampler [[id(4)]];
};

struct ArgBuffer1
{
    constant Compute_Shader::Uniforms_cbExtendCamera& cbExtendCamera [[id(0)]];
    constant Compute_Shader::Uniforms_planeInfoBuffer& planeInfoBuffer [[id(3)]];
};
//[numthreads(128, 1, 1)]
kernel void stageMain(
    uint3 Gid [[threadgroup_position_in_grid]],
    uint3 DTid [[thread_position_in_grid]],
    uint3 GTid [[thread_position_in_threadgroup]],
    uint GI [[thread_index_in_threadgroup]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    uint3 Gid0;
    Gid0 = Gid;
    uint3 DTid0;
    DTid0 = DTid;
    uint3 GTid0;
    GTid0 = GTid;
    uint GI0;
    GI0 = GI;
    Compute_Shader main(argBuffer1.cbExtendCamera, argBuffer0.IntermediateBuffer, argBuffer0.DepthTexture, argBuffer1.planeInfoBuffer, argBuffer0.defaultSampler);
    return main.main(Gid0, DTid0, GTid0, GI0);
}
