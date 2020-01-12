#version 450 core

precision highp float;
precision highp int; 
mat4 MulMat(mat4 lhs, mat4 rhs)
{
    mat4 dst;
	dst[0][0] = lhs[0][0]*rhs[0][0] + lhs[0][1]*rhs[1][0] + lhs[0][2]*rhs[2][0] + lhs[0][3]*rhs[3][0];
	dst[0][1] = lhs[0][0]*rhs[0][1] + lhs[0][1]*rhs[1][1] + lhs[0][2]*rhs[2][1] + lhs[0][3]*rhs[3][1];
	dst[0][2] = lhs[0][0]*rhs[0][2] + lhs[0][1]*rhs[1][2] + lhs[0][2]*rhs[2][2] + lhs[0][3]*rhs[3][2];
	dst[0][3] = lhs[0][0]*rhs[0][3] + lhs[0][1]*rhs[1][3] + lhs[0][2]*rhs[2][3] + lhs[0][3]*rhs[3][3];
	dst[1][0] = lhs[1][0]*rhs[0][0] + lhs[1][1]*rhs[1][0] + lhs[1][2]*rhs[2][0] + lhs[1][3]*rhs[3][0];
	dst[1][1] = lhs[1][0]*rhs[0][1] + lhs[1][1]*rhs[1][1] + lhs[1][2]*rhs[2][1] + lhs[1][3]*rhs[3][1];
	dst[1][2] = lhs[1][0]*rhs[0][2] + lhs[1][1]*rhs[1][2] + lhs[1][2]*rhs[2][2] + lhs[1][3]*rhs[3][2];
	dst[1][3] = lhs[1][0]*rhs[0][3] + lhs[1][1]*rhs[1][3] + lhs[1][2]*rhs[2][3] + lhs[1][3]*rhs[3][3];
	dst[2][0] = lhs[2][0]*rhs[0][0] + lhs[2][1]*rhs[1][0] + lhs[2][2]*rhs[2][0] + lhs[2][3]*rhs[3][0];
	dst[2][1] = lhs[2][0]*rhs[0][1] + lhs[2][1]*rhs[1][1] + lhs[2][2]*rhs[2][1] + lhs[2][3]*rhs[3][1];
	dst[2][2] = lhs[2][0]*rhs[0][2] + lhs[2][1]*rhs[1][2] + lhs[2][2]*rhs[2][2] + lhs[2][3]*rhs[3][2];
	dst[2][3] = lhs[2][0]*rhs[0][3] + lhs[2][1]*rhs[1][3] + lhs[2][2]*rhs[2][3] + lhs[2][3]*rhs[3][3];
	dst[3][0] = lhs[3][0]*rhs[0][0] + lhs[3][1]*rhs[1][0] + lhs[3][2]*rhs[2][0] + lhs[3][3]*rhs[3][0];
	dst[3][1] = lhs[3][0]*rhs[0][1] + lhs[3][1]*rhs[1][1] + lhs[3][2]*rhs[2][1] + lhs[3][3]*rhs[3][1];
	dst[3][2] = lhs[3][0]*rhs[0][2] + lhs[3][1]*rhs[1][2] + lhs[3][2]*rhs[2][2] + lhs[3][3]*rhs[3][2];
	dst[3][3] = lhs[3][0]*rhs[0][3] + lhs[3][1]*rhs[1][3] + lhs[3][2]*rhs[2][3] + lhs[3][3]*rhs[3][3];
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


layout(location = 0) in vec3 POSITION;
layout(location = 1) in vec3 NORMAL;
layout(location = 2) in vec2 TEXCOORD0;
layout(location = 3) in vec4 TEXCOORD1;
layout(location = 4) in uvec4 TEXCOORD2;
layout(location = 0) out vec3 vertOutput_NORMAL;
layout(location = 1) out vec2 vertOutput_TEXCOORD0;

layout(row_major, set = 3, binding = 0) uniform uniformBlock
{
    mat4 vpMatrix;
    mat4 modelMatrix;
};

layout(row_major, set = 3, binding = 1) uniform boneMatrices
{
    mat4 boneMatrix[1024];
};

layout(row_major, set = 0, binding = 2) uniform boneOffsetMatrices
{
    mat4 boneOffsetMatrix[1024];
};

struct VSInput
{
    vec3 Position;
    vec3 Normal;
    vec2 UV;
    vec4 BoneWeights;
    uvec4 BoneIndices;
};
struct VSOutput
{
    vec4 Position;
    vec3 Normal;
    vec2 UV;
};
VSOutput HLSLmain(VSInput input1)
{
    VSOutput result;
    mat4 boneTransform = (MulMat(boneMatrix[(input1).BoneIndices[0]],boneOffsetMatrix[(input1).BoneIndices[0]]) * mat4((input1).BoneWeights[0]));
    (boneTransform += (MulMat(boneMatrix[(input1).BoneIndices[1]],boneOffsetMatrix[(input1).BoneIndices[1]]) * mat4((input1).BoneWeights[1])));
    (boneTransform += (MulMat(boneMatrix[(input1).BoneIndices[2]],boneOffsetMatrix[(input1).BoneIndices[2]]) * mat4((input1).BoneWeights[2])));
    (boneTransform += (MulMat(boneMatrix[(input1).BoneIndices[3]],boneOffsetMatrix[(input1).BoneIndices[3]]) * mat4((input1).BoneWeights[3])));
    ((result).Position = MulMat(boneTransform,vec4((input1).Position, 1.0)));
    ((result).Position = MulMat(modelMatrix,(result).Position));
    ((result).Position = MulMat(vpMatrix,(result).Position));
    ((result).Normal = normalize((MulMat(modelMatrix,vec4((input1).Normal, 0.0))).xyz));
    ((result).UV = (input1).UV);
    return result;
}
void main()
{
    VSInput input1;
    input1.Position = POSITION;
    input1.Normal = NORMAL;
    input1.UV = TEXCOORD0;
    input1.BoneWeights = TEXCOORD1;
    input1.BoneIndices = TEXCOORD2;
    VSOutput result = HLSLmain(input1);
    gl_Position = result.Position;
    vertOutput_NORMAL = result.Normal;
    vertOutput_TEXCOORD0 = result.UV;
}
