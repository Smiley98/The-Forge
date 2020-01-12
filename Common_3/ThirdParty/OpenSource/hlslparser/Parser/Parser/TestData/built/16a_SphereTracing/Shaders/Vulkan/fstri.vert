#version 450 core

precision highp float;
precision highp int; 


const vec2 positions[3] = {vec2((-1.0), 1.0), vec2((-1.0), (-3.0)), vec2(3.0, 1.0)};
vec4 HLSLmain(uint index)
{
    return vec4(positions[index], 0.0, 1.0);
}
void main()
{
    uint index;
    index = gl_VertexIndex;
    vec4 result = HLSLmain(index);
    gl_Position = result;
}
