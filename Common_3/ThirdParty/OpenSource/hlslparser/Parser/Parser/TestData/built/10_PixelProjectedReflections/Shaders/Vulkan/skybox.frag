#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec3 fragInput_POSITION;
layout(location = 0) out vec4 rast_FragData0; 

layout(set = 0, binding = 1) uniform textureCube skyboxTex;
layout(set = 0, binding = 2) uniform sampler skyboxSampler;
struct VSinput
{
    vec4 Position;
};
struct VSOutput
{
    vec4 Position;
    vec3 pos;
};
vec4 HLSLmain(VSOutput input1)
{
    vec4 outColor = texture(samplerCube(skyboxTex, skyboxSampler), (input1).pos);
    float inverseArg = float((float(1) / 2.20000004));
    return vec4(pow((outColor).r,float(inverseArg)), pow((outColor).g,float(inverseArg)), pow((outColor).b,float(inverseArg)), 1.0);
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.pos = fragInput_POSITION;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
