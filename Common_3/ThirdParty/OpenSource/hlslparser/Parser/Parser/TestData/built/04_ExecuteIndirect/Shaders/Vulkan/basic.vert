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


layout(location = 0) in vec4 Position;
layout(location = 1) in vec4 Normal;
layout(location = 0) out vec3 vertOutput_PosModel;
layout(location = 1) out vec3 vertOutput_Normal;
layout(location = 2) out vec4 vertOutput_Color;

struct InstanceData
{
    mat4 mvp;
    mat4 normalMat;
    vec4 surfaceColor;
    vec4 deepColor;
    int textureID;
    uint _pad0[3];
};
layout(row_major, set = 2, binding = 0) buffer instanceBuffer
{
    InstanceData instanceBuffer_Data[];
};

layout(row_major, push_constant) uniform rootConstant_Block
{
    uint index;
}rootConstant;

struct VsIn
{
    vec4 position;
    vec4 normal;
};
struct PsIn
{
    vec4 position;
    vec3 posModel;
    vec3 normal;
    vec4 albedo;
};
float linstep(float min, float max, float s)
{
    return clamp(((s - min) / (max - min)), 0.0, 1.0);
}
PsIn HLSLmain(VsIn In)
{
    PsIn result;
    ((result).position = MulMat((instanceBuffer_Data[rootConstant.index]).mvp,vec4(((In).position).xyz, 1)));
    ((result).posModel = ((In).position).xyz);
    ((result).normal = normalize((MulMat((instanceBuffer_Data[rootConstant.index]).normalMat,vec4(((In).normal).xyz, 0))).xyz));
    float depth = linstep(0.5, 0.7, length(((In).position).xyz));
    (((result).albedo).xyz = mix(((instanceBuffer_Data[rootConstant.index]).deepColor).xyz, ((instanceBuffer_Data[rootConstant.index]).surfaceColor).xyz, vec3(depth)));
    (((result).albedo).w = float((instanceBuffer_Data[rootConstant.index]).textureID));
    return result;
}
void main()
{
    VsIn In;
    In.position = Position;
    In.normal = Normal;
    PsIn result = HLSLmain(In);
    gl_Position = result.position;
    vertOutput_PosModel = result.posModel;
    vertOutput_Normal = result.normal;
    vertOutput_Color = result.albedo;
}
