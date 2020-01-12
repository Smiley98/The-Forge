#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec4 fragInput_TEXCOORD0;
layout(location = 0) out vec4 rast_FragData0; 

struct VSOutput
{
    vec4 Position;
    vec4 UV;
};
layout(set = 0, binding = 0) uniform texture2D Source;
layout(set = 0, binding = 0) uniform sampler PointSampler;
vec4 HLSLmain(VSOutput input1)
{
    return texture(sampler2D(Source, PointSampler), ((input1).UV).xy);
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.UV = fragInput_TEXCOORD0;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
