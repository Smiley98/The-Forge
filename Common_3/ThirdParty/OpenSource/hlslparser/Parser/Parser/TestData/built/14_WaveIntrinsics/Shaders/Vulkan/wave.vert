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
layout(location = 1) in vec4 COLOR;
layout(location = 0) out vec4 vertOutput_COLOR;

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
PSInput HLSLmain(vec3 position, vec4 color)
{
    PSInput result;
    ((result).position = MulMat(orthProjMatrix,vec4(position, 1.0)));
    ((result).color = color);
    return result;
}
void main()
{
    vec3 position;
    position = POSITION;
    vec4 color;
    color = COLOR;
    PSInput result = HLSLmain(position, color);
    gl_Position = result.position;
    vertOutput_COLOR = result.color;
}
