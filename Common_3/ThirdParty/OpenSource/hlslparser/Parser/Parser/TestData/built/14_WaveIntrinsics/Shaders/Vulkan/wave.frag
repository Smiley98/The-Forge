#version 450 core

precision highp float;
precision highp int; 
#extension GL_KHR_shader_subgroup_basic : require
#extension GL_KHR_shader_subgroup_arithmetic : require
#extension GL_KHR_shader_subgroup_ballot : require
#extension GL_KHR_shader_subgroup_quad : require

layout(location = 0) in vec4 fragInput_COLOR;
layout(location = 0) out vec4 rast_FragData0; 

layout(row_major, set = 1, binding = 0) uniform SceneConstantBuffer
{
    mat4 orthProjMatrix;
    vec2 mousePosition;
    vec2 resolution;
    float time;
    uint renderMode;
    uint laneSize;
    uint padding;
};

struct PSInput
{
    vec4 position;
    vec4 color;
};
float texPattern(vec2 position)
{
    float scale = float(0.13);
    float t = (sin(((position).x * scale)) + cos(((position).y * scale)));
    float c = smoothstep(float(0.0), float(0.2), (t * t));
    return c;
}
vec4 HLSLmain(PSInput input1)
{
    vec4 outputColor;
    float texP = texPattern(((input1).position).xy);
    (outputColor = (vec4(texP) * (input1).color));
    switch (renderMode)
    {
        case 1:
        {
            break;
        }
        case 2:
        {
            (outputColor = vec4((float(gl_SubgroupInvocationID) / float(laneSize))));
            break;
        }
        case 3:
        {
            if(subgroupElect())
            {
                (outputColor = vec4(1.0, 1.0, 1.0, 1.0));
            }
            break;
        }
        case 4:
        {
            if(subgroupElect())
            {
                (outputColor = vec4(1.0, 1.0, 1.0, 1.0));
            }
            if((gl_SubgroupInvocationID == subgroupMax(gl_SubgroupInvocationID)))
            {
                (outputColor = vec4(1.0, 0.0, 0.0, 1.0));
            }
            break;
        }
        case 5:
        {
            uvec4 activeLaneMask = subgroupBallot(true);
            uint numActiveLanes = (((bitCount((activeLaneMask).x) + bitCount((activeLaneMask).y)) + bitCount((activeLaneMask).z)) + bitCount((activeLaneMask).w));
            float activeRatio = (float(numActiveLanes) / float(laneSize));
            (outputColor = vec4(activeRatio, activeRatio, activeRatio, 1.0));
            break;
        }
        case 6:
        {
            (outputColor = subgroupBroadcastFirst(outputColor));
            break;
        }
        case 7:
        {
            uvec4 activeLaneMask = subgroupBallot(true);
            uint numActiveLanes = (((bitCount((activeLaneMask).x) + bitCount((activeLaneMask).y)) + bitCount((activeLaneMask).z)) + bitCount((activeLaneMask).w));
            vec4 avgColor = (subgroupAdd(outputColor) / vec4(float(numActiveLanes)));
            (outputColor = avgColor);
            break;
        }
        case 8:
        {
            vec4 basePos = subgroupBroadcastFirst((input1).position);
            vec4 prefixSumPos = subgroupExclusiveAdd(((input1).position - basePos));
            uvec4 activeLaneMask = subgroupBallot(true);
            uint numActiveLanes = (((bitCount((activeLaneMask).x) + bitCount((activeLaneMask).y)) + bitCount((activeLaneMask).z)) + bitCount((activeLaneMask).w));
            (outputColor = (prefixSumPos / vec4(numActiveLanes)));
            break;
        }
        case 9:
        {
            float dx = (subgroupQuadSwapHorizontal(((input1).position).x) - ((input1).position).x);
            float dy = (subgroupQuadSwapVertical(((input1).position).y) - ((input1).position).y);
            if(((dx > float(0)) && (dy > float(0))))
            {
                (outputColor = vec4(1, 0, 0, 1));
            }
            else if (((dx < float(0)) && (dy > float(0))))
            {
                (outputColor = vec4(0, 1, 0, 1));
            }
            else if (((dx > float(0)) && (dy < float(0))))
            {
                (outputColor = vec4(0, 0, 1, 1));
            }
            else if (((dx < float(0)) && (dy < float(0))))
            {
                (outputColor = vec4(1, 1, 1, 1));
            }
            else
            {
                (outputColor = vec4(0, 0, 0, 1));
            }
            break;
        }
        default:
        {
            break;
        }
    }
    return outputColor;
}
void main()
{
    PSInput input1;
    input1.position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.color = fragInput_COLOR;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
