#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec3 fragInput_COLOR0;
layout(location = 1) in vec2 fragInput_TEXCOORD0;
layout(location = 0) out vec4 rast_FragData0; 

struct VSOutput
{
    vec4 pos;
    vec3 color;
    vec2 uv;
};
layout(set = 0, binding = 1) uniform texture2D uTexture0;
layout(set = 0, binding = 2) uniform sampler uSampler0;
vec4 HLSLmain(VSOutput input1)
{
    vec4 diffuse = texture(sampler2D(uTexture0, uSampler0), (input1).uv);
    float lum = dot((diffuse).rgb, vec3(0.333));
    ((diffuse).rgb = mix((diffuse).rgb, (lum).xxx, vec3(0.8)));
    ((diffuse).rgb *= ((input1).color).rgb);
    return diffuse;
}
void main()
{
    VSOutput input1;
    input1.pos = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.color = fragInput_COLOR0;
    input1.uv = fragInput_TEXCOORD0;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
