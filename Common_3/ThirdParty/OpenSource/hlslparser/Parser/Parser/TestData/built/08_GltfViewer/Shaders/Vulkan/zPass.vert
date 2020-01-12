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


layout(location = 0) in uvec4 POSITION;
layout(location = 1) in ivec4 NORMAL;
layout(location = 2) in uvec2 TEXCOORD0;
layout(location = 3) in uvec4 COLOR;
layout(location = 4) in uvec2 TEXCOORD1;
layout(location = 5) in uvec2 TEXCOORD2;

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

struct VsIn
{
    uvec4 position;
    ivec4 normal;
    uvec2 texCoord;
    uvec4 baseColor;
    uvec2 metallicRoughness;
    uvec2 alphaSettings;
};
struct PsIn
{
    vec4 Position;
};
PsIn HLSLmain(VsIn input1)
{
    PsIn output1;
    float unormPositionScale = (float((1 << 16)) - 1.0);
    vec4 inPos = (vec4(((vec3(((input1).position).xyz) / vec3(unormPositionScale)) * vec3(posScale)), 1.0) + posOffset);
    (inPos += centerOffset);
    vec4 worldPosition = MulMat(world,inPos);
    ((worldPosition).xyz /= vec3(posScale));
    ((output1).Position = MulMat(ViewProjMat,worldPosition));
    return output1;
}
void main()
{
    VsIn input1;
    input1.position = POSITION;
    input1.normal = NORMAL;
    input1.texCoord = TEXCOORD0;
    input1.baseColor = COLOR;
    input1.metallicRoughness = TEXCOORD1;
    input1.alphaSettings = TEXCOORD2;
    PsIn result = HLSLmain(input1);
    gl_Position = result.Position;
}
