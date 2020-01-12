#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec3 POSITION;
layout(location = 1) in vec2 TEXCOORD;
layout(location = 0) out vec2 vertOutput_TEXCOORD;

struct PSInput
{
    vec4 position;
    vec2 uv;
};
PSInput HLSLmain(vec3 position, vec2 uv)
{
    PSInput result;
    ((result).position = vec4(position, 1.0));
    ((result).uv = uv);
    return result;
}
void main()
{
    vec3 position;
    position = POSITION;
    vec2 uv;
    uv = TEXCOORD;
    PSInput result = HLSLmain(position, uv);
    gl_Position = result.position;
    vertOutput_TEXCOORD = result.uv;
}
