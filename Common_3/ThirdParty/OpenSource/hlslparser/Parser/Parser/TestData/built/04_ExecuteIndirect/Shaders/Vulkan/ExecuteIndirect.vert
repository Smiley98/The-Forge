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


layout(location = 0) in vec4 Position;
layout(location = 1) in vec4 Normal;
layout(location = 0) out vec3 vertOutput_PosModel;
layout(location = 1) out vec3 vertOutput_Normal;
layout(location = 2) out vec4 vertOutput_Color;

layout(row_major, push_constant) uniform rootConstant_Block
{
    uint drawID;
}rootConstant;

layout(row_major, set = 1, binding = 5) uniform uniformBlock
{
    mat4 viewProj;
};

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
struct AsteroidDynamic
{
    mat4 transform;
    uint indexStart;
    uint indexEnd;
    uint padding[2];
};
struct AsteroidStatic
{
    vec4 rotationAxis;
    vec4 surfaceColor;
    vec4 deepColor;
    float scale;
    float orbitSpeed;
    float rotationSpeed;
    uint textureID;
    uint vertexStart;
    uint padding[3];
};
layout(row_major, set=0, binding=1) buffer asteroidsStatic
{
    AsteroidStatic asteroidsStatic_Data[];
};

layout(row_major, set=0, binding=2) buffer asteroidsDynamic
{
    AsteroidDynamic asteroidsDynamic_Data[];
};

PsIn HLSLmain(VsIn In)
{
    PsIn result;
    AsteroidStatic asteroidStatic = asteroidsStatic_Data[rootConstant.drawID];
    AsteroidDynamic asteroidDynamic = asteroidsDynamic_Data[rootConstant.drawID];
    mat4 worldMatrix = (asteroidDynamic).transform;
    ((result).position = MulMat(viewProj,MulMat(worldMatrix,vec4(((In).position).xyz, 1.0))));
    ((result).posModel = ((In).position).xyz);
    ((result).normal = MulMat(mat3(worldMatrix),((In).normal).xyz));
    float depth = clamp(((length(((In).position).xyz) - 0.5) / float(0.2)), 0.0, 1.0);
    (((result).albedo).xyz = mix(((asteroidStatic).deepColor).xyz, ((asteroidStatic).surfaceColor).xyz, vec3(depth)));
    (((result).albedo).w = float((asteroidStatic).textureID));
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
