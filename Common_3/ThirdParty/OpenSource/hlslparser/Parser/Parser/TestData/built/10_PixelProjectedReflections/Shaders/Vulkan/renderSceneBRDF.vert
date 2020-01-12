#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec3 POSITION;
layout(location = 1) in vec2 TEXCOORD0;
layout(location = 0) out vec2 vertOutput_TEXCOORD0;

struct VSInput
{
    vec3 Position;
    vec2 Uv;
};
struct VSOutput
{
    vec4 Position;
    vec2 uv;
};
VSOutput HLSLmain(VSInput input1)
{
    VSOutput result;
    ((result).Position = vec4((input1).Position, 1.0));
    ((result).uv = (input1).Uv);
    return result;
}
void main()
{
    VSInput input1;
    input1.Position = POSITION;
    input1.Uv = TEXCOORD0;
    VSOutput result = HLSLmain(input1);
    gl_Position = result.Position;
    vertOutput_TEXCOORD0 = result.uv;
}
