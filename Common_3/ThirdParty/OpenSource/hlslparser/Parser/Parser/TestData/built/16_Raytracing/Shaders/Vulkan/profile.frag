#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec4 fragInput_COLOR;
layout(location = 0) out vec4 rast_FragData0; 

struct VSOutput
{
    vec4 Position;
    vec4 Color;
};
vec4 HLSLmain(VSOutput In)
{
    return (In).Color;
}
void main()
{
    VSOutput In;
    In.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    In.Color = fragInput_COLOR;
    vec4 result = HLSLmain(In);
    rast_FragData0 = result;
}
