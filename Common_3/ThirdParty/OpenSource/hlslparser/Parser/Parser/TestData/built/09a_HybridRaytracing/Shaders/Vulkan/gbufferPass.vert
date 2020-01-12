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

vec3 MulMat(mat3 lhs, vec3 rhs)
{
    vec3 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1] + lhs[0][2]*rhs[2];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1] + lhs[1][2]*rhs[2];
	dst[2] = lhs[2][0]*rhs[0] + lhs[2][1]*rhs[1] + lhs[2][2]*rhs[2];
    return dst;
}


layout(location = 0) in vec3 POSITION;
layout(location = 1) in vec3 NORMAL;
layout(location = 2) in vec2 TEXCOORD;
layout(location = 0) out vec3 vertOutput_TEXCOORD0;
layout(location = 1) out vec3 vertOutput_TEXCOORD1;
layout(location = 2) out vec2 vertOutput_TEXCOORD2;
layout(location = 3) out uint vertOutput_TEXCOORD3;

struct VsIn
{
    vec3 position;
    vec3 normal;
    vec2 texCoord;
};
layout(row_major, set = 1, binding = 0) uniform cbPerPass
{
    mat4 projView;
};

layout(row_major, set = 0, binding = 1) uniform cbPerProp
{
    mat4 world;
    float roughness;
    float metallic;
    int pbrMaterials;
    float pad;
};

struct PsIn
{
    vec3 normal;
    vec3 pos;
    vec2 texCoord;
    uint materialID;
    vec4 position;
};
PsIn HLSLmain(VsIn In)
{
    PsIn Out;
    ((Out).position = MulMat(projView,MulMat(world,vec4(((In).position).xyz, 1.0))));
    ((Out).normal = (MulMat(mat3(world),((In).normal).xyz)).xyz);
    ((Out).pos = (MulMat(world,vec4(((In).position).xyz, 1.0))).xyz);
    ((Out).texCoord = ((In).texCoord).xy);
    return Out;
}
void main()
{
    VsIn In;
    In.position = POSITION;
    In.normal = NORMAL;
    In.texCoord = TEXCOORD;
    PsIn result = HLSLmain(In);
    vertOutput_TEXCOORD0 = result.normal;
    vertOutput_TEXCOORD1 = result.pos;
    vertOutput_TEXCOORD2 = result.texCoord;
    vertOutput_TEXCOORD3 = result.materialID;
    gl_Position = result.position;
}
