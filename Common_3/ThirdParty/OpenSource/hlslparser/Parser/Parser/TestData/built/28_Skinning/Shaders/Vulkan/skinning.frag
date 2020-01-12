#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec3 fragInput_NORMAL;
layout(location = 1) in vec2 fragInput_TEXCOORD0;
layout(location = 0) out vec4 rast_FragData0; 

struct VSOutput
{
    vec4 Position;
    vec3 Normal;
    vec2 UV;
};
layout(set = 0, binding = 0) uniform texture2D DiffuseTexture;
layout(set = 0, binding = 0) uniform sampler DefaultSampler;
vec4 HLSLmain(VSOutput input1)
{
    float nDotl = clamp(((dot(normalize((input1).Normal), vec3(0, 1, 0)) + 1.0) * 0.5), 0.0, 1.0);
    vec3 color = (texture(sampler2D(DiffuseTexture, DefaultSampler), (input1).UV)).rgb;
    return vec4((color * vec3(nDotl)), 1.0);
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.Normal = fragInput_NORMAL;
    input1.UV = fragInput_TEXCOORD0;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
