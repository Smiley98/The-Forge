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
layout(location = 0) out vec4 vertOutput_TEXCOORD;

layout(row_major, set = 1, binding = 0) uniform uniformBlock
{
    mat4 mvp;
};

struct VSOutput
{
    vec4 Position;
    vec4 TexCoord;
};
VSOutput HLSLmain(vec4 Position)
{
    VSOutput result;
    vec4 p = vec4(((Position).x * float(9)), ((Position).y * float(9)), ((Position).z * float(9)), 1.0);
    mat4 m = mvp;
    (p = MulMat(m,p));
    ((result).Position = (p).xyww);
    ((result).TexCoord = vec4((Position).x, (Position).y, (Position).z, (Position).w));
    return result;
}
void main()
{
    vec4 Position;
    Position = POSITION;
    VSOutput result = HLSLmain(Position);
    gl_Position = result.Position;
    vertOutput_TEXCOORD = result.TexCoord;
}
