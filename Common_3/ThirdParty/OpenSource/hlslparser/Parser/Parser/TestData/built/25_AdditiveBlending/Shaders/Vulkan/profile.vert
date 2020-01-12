#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec2 POSITION;
layout(location = 1) in vec4 COLOR;
layout(location = 0) out vec4 vertOutput_COLOR;

struct VSInput
{
    vec2 Position;
    vec4 Color;
};
struct VSOutput
{
    vec4 Position;
    vec4 Color;
};
VSOutput HLSLmain(VSInput input1)
{
    VSOutput result;
    ((result).Position = vec4(((input1).Position).x, ((input1).Position).y, 0.0, 1.0));
    ((result).Color = (input1).Color);
    return result;
}
void main()
{
    VSInput input1;
    input1.Position = POSITION;
    input1.Color = COLOR;
    VSOutput result = HLSLmain(input1);
    gl_Position = result.Position;
    vertOutput_COLOR = result.Color;
}
