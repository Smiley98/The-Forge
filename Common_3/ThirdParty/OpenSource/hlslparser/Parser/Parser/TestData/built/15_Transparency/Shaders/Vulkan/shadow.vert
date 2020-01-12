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


layout(location = 0) in vec4 POSITION;
layout(location = 1) in vec3 NORMAL;
layout(location = 2) in vec2 TEXCOORD0;

struct Material
{
    vec4 Color;
    vec4 Transmission;
    float RefractionRatio;
    float Collimation;
    vec2 Padding;
    uint TextureFlags;
    uint AlbedoTexID;
    uint MetallicTexID;
    uint RoughnessTexID;
    uint EmissiveTexID;
    uvec3 Padding2;
};
struct ObjectInfo
{
    mat4 toWorld;
    mat4 normalMat;
    uint matID;
};
layout(row_major, push_constant) uniform DrawInfoRootConstant_Block
{
    uint baseInstance;
}DrawInfoRootConstant;

layout(row_major, set = 1, binding = 0) uniform ObjectUniformBlock
{
    ObjectInfo objectInfo[128];
};

layout(row_major, set = 1, binding = 3) uniform LightUniformBlock
{
    mat4 lightViewProj;
    vec4 lightDirection;
    vec4 lightColor;
};

layout(row_major, set = 1, binding = 1) uniform CameraUniform
{
    mat4 camViewProj;
    mat4 camViewMat;
    vec4 camClipInfo;
    vec4 camPosition;
};

layout(row_major, set = 1, binding = 2) uniform MaterialUniform
{
    Material Materials[128];
};

layout(set = 0, binding = 100) uniform texture2D MaterialTextures[8];
layout(set = 0, binding = 0) uniform sampler LinearSampler;
layout(set = 0, binding = 1) uniform texture2D VSM;
layout(set = 0, binding = 2) uniform sampler VSMSampler;
struct VSInput
{
    vec4 Position;
    vec3 Normal;
    vec2 UV;
};
struct VSOutput
{
    vec4 Position;
};
VSOutput HLSLmain(VSInput input1, uint InstanceID)
{
    VSOutput output1;
    uint instanceID = (InstanceID + DrawInfoRootConstant.baseInstance);
    vec4 pos = MulMat((objectInfo[instanceID]).toWorld,(input1).Position);
    ((output1).Position = MulMat(camViewProj,pos));
    return output1;
}
void main()
{
    VSInput input1;
    input1.Position = POSITION;
    input1.Normal = NORMAL;
    input1.UV = TEXCOORD0;
    uint InstanceID;
    InstanceID = gl_InstanceIndex;
    VSOutput result = HLSLmain(input1, InstanceID);
    gl_Position = result.Position;
}
