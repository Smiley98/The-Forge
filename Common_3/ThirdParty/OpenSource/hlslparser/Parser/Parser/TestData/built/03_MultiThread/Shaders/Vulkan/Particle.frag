#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in float fragInput_TEXCOORD;
layout(location = 0) out vec4 rast_FragData0; 

layout(row_major, push_constant) uniform particleRootConstant_Block
{
    float paletteFactor;
    uint data;
    uint textureIndex;
}particleRootConstant;

struct VSOutput
{
    vec4 Position;
    float TexCoord;
};
layout(set = 0, binding = 3) uniform sampler uSampler0;
layout(set = 0, binding = 11) uniform texture1D uTex0[5];
vec4 HLSLmain(VSOutput input1)
{
    vec4 ca = texture(sampler1D(uTex0[particleRootConstant.textureIndex], uSampler0), (input1).TexCoord);
    vec4 cb = texture(sampler1D(uTex0[((particleRootConstant.textureIndex + uint(1)) % uint(5))], uSampler0), (input1).TexCoord);
    return (vec4(0.05) * mix(ca, cb, vec4(particleRootConstant.paletteFactor)));
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.TexCoord = fragInput_TEXCOORD;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
