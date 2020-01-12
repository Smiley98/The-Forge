#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec3 fragInput_PosModel;
layout(location = 1) in vec3 fragInput_Normal;
layout(location = 2) in vec4 fragInput_Color;
layout(location = 0) out vec4 rast_FragData0; 

struct PsIn
{
    vec4 position;
    vec3 posModel;
    vec3 normal;
    vec4 albedo;
};
layout(set = 0, binding = 3) uniform texture1DArray uTex0;
layout(set = 0, binding = 4) uniform sampler uSampler0;
vec4 HLSLmain(PsIn In)
{
    const vec3 lightDir = (-normalize(vec3(2, 6, 1)));
    float wrap_diffuse = clamp(dot(lightDir, normalize((In).normal)), 0.0, 1.0);
    float light = ((2.0 * wrap_diffuse) + 0.060000000);
    vec3 uvw = (((In).posModel * vec3(0.5)) + vec3(0.5));
    vec3 blendWeights = abs(normalize((In).posModel));
    (blendWeights = clamp(((blendWeights - vec3(0.2)) * vec3(7)), 0.0, 1.0));
    (blendWeights /= ((((blendWeights).x + (blendWeights).y) + (blendWeights).z)).xxx);
    vec3 coord1 = vec3((uvw).yz, ((In).albedo).w);
    vec3 coord2 = vec3((uvw).zx, ((In).albedo).w);
    vec3 coord3 = vec3((uvw).xy, ((In).albedo).w);
    vec3 texColor = vec3(0, 0, 0);
    (texColor += (vec3((blendWeights).x) * (texture(sampler2DArray(uTex0, uSampler0), coord1)).xyz));
    (texColor += (vec3((blendWeights).y) * (texture(sampler2DArray(uTex0, uSampler0), coord2)).xyz));
    (texColor += (vec3((blendWeights).z) * (texture(sampler2DArray(uTex0, uSampler0), coord3)).xyz));
    float coverage = clamp((((In).position).z * 4000.0), 0.0, 1.0);
    vec3 color = ((In).albedo).xyz;
    (color *= vec3(light));
    (color *= (texColor * vec3(2)));
    (color *= vec3(coverage));
    return vec4(color, 1);
}
void main()
{
    PsIn In;
    In.position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    In.posModel = fragInput_PosModel;
    In.normal = fragInput_Normal;
    In.albedo = fragInput_Color;
    vec4 result = HLSLmain(In);
    rast_FragData0 = result;
}
