#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec4 fragInput_Texcoord0;
layout(location = 0) out vec4 rast_FragData0; 

struct VSOutput
{
    vec4 Position;
    vec4 UV;
};
layout(set = 0, binding = 0) uniform sampler PointSampler;
layout(set = 0, binding = 0) uniform texture2D AccumulationTexture;
layout(set = 0, binding = 1) uniform texture2D RevealageTexture;
vec4 HLSLmain(VSOutput input1)
{
    float revealage = float(1.0);
    float additiveness = float(0.0);
    vec4 accum = vec4(0.0, 0.0, 0.0, 0.0);
    vec4 temp = texture(sampler2D(RevealageTexture, PointSampler), ((input1).UV).xy);
    (revealage = (temp).r);
    (additiveness = (temp).w);
    (accum = texture(sampler2D(AccumulationTexture, PointSampler), ((input1).UV).xy));
    vec3 average_color = ((accum).rgb / vec3(max((accum).a, float(0.000010000000))));
    float emissive_amplifier = (additiveness * 8.0);
    (emissive_amplifier = mix((emissive_amplifier * float(0.25)), emissive_amplifier, revealage));
    (emissive_amplifier += clamp(((float(1.0) - revealage) * float(2.0)), 0.0, 1.0));
    (average_color *= vec3(max(emissive_amplifier, float(1.0))));
    if(any(notEqual(vec3(isinf((accum).rgb)),vec3(0))))
    {
        (average_color = vec3(100.0));
    }
    return vec4(average_color, (float(1.0) - revealage));
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.UV = fragInput_Texcoord0;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
