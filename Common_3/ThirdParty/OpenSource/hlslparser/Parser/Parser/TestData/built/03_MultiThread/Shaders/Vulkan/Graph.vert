#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec2 POSITION;
layout(location = 1) in vec4 COLOR;
layout(location = 0) out vec4 vertOutput_COLOR;

struct VSOutput
{
    vec4 Position;
    vec4 Color;
};
VSOutput HLSLmain(vec2 Position, vec4 Color)
{
    VSOutput result;
    ((result).Position = vec4((Position).x, (Position).y, 0.0, 1.0));
    ((result).Color = Color);
    return result;
}
void main()
{
    vec2 Position;
    Position = POSITION;
    vec4 Color;
    Color = COLOR;
    VSOutput result = HLSLmain(Position, Color);
    gl_Position = result.Position;
    vertOutput_COLOR = result.Color;
}
