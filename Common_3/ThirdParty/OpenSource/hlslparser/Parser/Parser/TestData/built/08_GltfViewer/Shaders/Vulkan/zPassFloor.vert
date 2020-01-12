#version 450 core

precision highp float;
precision highp int; 
vec4 MulMat(mat4 lhs, vec4 rhs)
{
    vec4 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1] + lhs[0][2]*rhs[2] + lhs[0][3]*rhs[3];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1] + lhs[1][2]*rhs[2] + lhs[1][3]*rhs[3];
	dst[2] = lhs[2][0]*rhs[0] + lhs[2][1]*rhs[1] + lhs[2][2]*rhs[2] + lhs[2][3]*rhs[3];
	dst[3] = lhs[3][0]*rhs[0] + lhs[3][1]*rhs[1] + lhs[3][2]*rhs[2] + lhs[3][3]*rhs[3];
    return dst;
}


layout(location = 0) in vec3 POSITION;
layout(location = 1) in vec2 TEXCOORD0;

layout(row_major, set = 1, binding = 2) uniform ShadowUniformBuffer
{
    mat4 ViewProjMat;
};

layout(row_major, set = 3, binding = 1) uniform cbPerProp
{
    mat4 world;
    mat4 InvTranspose;
    int unlit;
    int hasAlbedoMap;
    int hasNormalMap;
    int hasMetallicRoughnessMap;
    int hasAOMap;
    int hasEmissiveMap;
    vec4 centerOffset;
    vec4 posOffset;
    vec2 uvOffset;
    vec2 uvScale;
    float posScale;
    float padding0;
};

struct VSInput
{
    vec3 Position;
    vec2 TexCoord;
};
struct PsIn
{
    vec4 Position;
};
PsIn HLSLmain(VSInput input1)
{
    PsIn output1;
    vec4 inPos = vec4(vec3(((input1).Position).xyz), 1.0);
    ((output1).Position = MulMat(ViewProjMat,MulMat(world,inPos)));
    return output1;
}
void main()
{
    VSInput input1;
    input1.Position = POSITION;
    input1.TexCoord = TEXCOORD0;
    PsIn result = HLSLmain(input1);
    gl_Position = result.Position;
}
