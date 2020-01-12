#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec2 fragInput_TEXCOORD;
layout(location = 0) out vec4 rast_FragData0; 

struct PsIn
{
    vec4 position;
    vec2 texCoord;
};
layout(set = 0, binding = 0) uniform texture2D uTex0;
layout(set = 0, binding = 1) uniform sampler uSampler0;
vec4 HLSLmain(PsIn In)
{
    return texture(sampler2D(uTex0, uSampler0), (In).texCoord);
}
void main()
{
    PsIn In;
    In.position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    In.texCoord = fragInput_TEXCOORD;
    vec4 result = HLSLmain(In);
    rast_FragData0 = result;
}
