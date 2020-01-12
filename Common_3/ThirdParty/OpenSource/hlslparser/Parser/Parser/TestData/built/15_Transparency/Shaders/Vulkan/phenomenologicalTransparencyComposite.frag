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
layout(set = 0, binding = 0) uniform sampler PointSampler;
layout(set = 0, binding = 1) uniform sampler LinearSampler;
layout(set = 0, binding = 0) uniform texture2D AccumulationTexture;
layout(set = 0, binding = 1) uniform texture2D ModulationTexture;
layout(set = 0, binding = 2) uniform texture2D BackgroundTexture;
float MaxComponent(vec3 v)
{
    return max(max((v).x, (v).y), (v).z);
}
float MinComponent(vec3 v)
{
    return min(min((v).x, (v).y), (v).z);
}
vec4 HLSLmain(VSOutput input1)
{
    vec4 modulationAndDiffusion = texture(sampler2D(ModulationTexture, PointSampler), ((input1).UV).xy);
    vec3 modulation = (modulationAndDiffusion).rgb;
    if((MinComponent(modulation) == 1.0))
    {
        return texture(sampler2D(BackgroundTexture, PointSampler), ((input1).UV).xy);
    }
    vec4 accumulation = texture(sampler2D(AccumulationTexture, PointSampler), ((input1).UV).xy);
    if(isinf((accumulation).a))
    {
        ((accumulation).a = MaxComponent((accumulation).xyz));
    }
    if(isinf(MaxComponent((accumulation).xyz)))
    {
        (accumulation = vec4(1.0));
    }
    const float epsilon = 0.0010000000;
    ((accumulation).rgb *= (vec3(0.5) + (max(modulation, vec3(epsilon)) / vec3((2.0 * max(epsilon, MaxComponent(modulation)))))));
    vec2 delta = vec2(0.0);
    vec3 background = vec3(0.0);
    (background = (textureLod(sampler2D(BackgroundTexture, PointSampler), ((input1).UV).xy, 0.0)).rgb);
    return vec4(((background * modulation) + (((vec3(1.0) - modulation) * (accumulation).rgb) / vec3(max((accumulation).a, 0.000010000000)))), 1.0);
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.UV = fragInput_TEXCOORD0;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
