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
layout(location = 0) out vec3 vertOutput_POSITION;

layout(row_major, set = 1, binding = 0) uniform uniformBlock
{
    mat4 projView;
    vec3 camPos;
};

struct VSInput
{
    vec4 Position;
};
struct VSOutput
{
    vec4 Position;
    vec3 pos;
};
VSOutput HLSLmain(VSInput input1)
{
    VSOutput result;
    ((result).Position = MulMat(projView,(input1).Position));
    ((result).Position = ((result).Position).xyww);
    ((result).pos = vec3((input1).Position));
    return result;
}
void main()
{
    VSInput input1;
    input1.Position = POSITION;
    VSOutput result = HLSLmain(input1);
    gl_Position = result.Position;
    vertOutput_POSITION = result.pos;
}
