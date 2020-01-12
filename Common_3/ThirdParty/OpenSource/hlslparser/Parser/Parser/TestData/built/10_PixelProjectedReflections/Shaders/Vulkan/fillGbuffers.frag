#version 450 core

precision highp float;
precision highp int; 
vec3 MulMat(vec3 lhs, mat3 rhs)
{
    vec3 dst;
	dst[0] = lhs[0]*rhs[0][0] + lhs[1]*rhs[1][0] + lhs[2]*rhs[2][0];
	dst[1] = lhs[0]*rhs[0][1] + lhs[1]*rhs[1][1] + lhs[2]*rhs[2][1];
	dst[2] = lhs[0]*rhs[0][2] + lhs[1]*rhs[1][2] + lhs[2]*rhs[2][2];
    return dst;
}


layout(location = 0) in vec3 fragInput_TEXCOORD0;
layout(location = 1) in vec3 fragInput_TEXCOORD1;
layout(location = 2) in vec2 fragInput_TEXCOORD2;
layout(location = 0) out vec4 rast_FragData0; 
layout(location = 1) out vec4 rast_FragData1; 
layout(location = 2) out vec4 rast_FragData2; 

layout(row_major, set = 1, binding = 0) uniform cbCamera
{
    mat4 projView;
    vec3 camPos;
};

layout(row_major, set = 3, binding = 1) uniform cbObject
{
    mat4 worldMat;
    float roughness;
    float metalness;
    int pbrMaterials;
};

layout(row_major, push_constant) uniform cbTextureRootConstants_Block
{
    uint albedoMap;
    uint normalMap;
    uint metallicMap;
    uint roughnessMap;
    uint aoMap;
}cbTextureRootConstants;

layout(set = 0, binding = 2) uniform sampler defaultSampler;
layout(set = 10, binding = 3) uniform texture2D textureMaps[];
vec3 reconstructNormal(in vec4 sampleNormal)
{
    vec3 tangentNormal;
    ((tangentNormal).xy = (((sampleNormal).rg * vec2(2)) - vec2(1)));
    ((tangentNormal).z = sqrt((float(1) - clamp(dot((tangentNormal).xy, (tangentNormal).xy), 0.0, 1.0))));
    return tangentNormal;
}
vec3 getNormalFromMap(vec3 pos, vec3 normal, vec2 uv)
{
    vec3 tangentNormal = reconstructNormal(texture(sampler2D(textureMaps[cbTextureRootConstants.normalMap], defaultSampler), uv));
    vec3 Q1 = dFdx(pos);
    vec3 Q2 = dFdy(pos);
    vec2 st1 = dFdx(uv);
    vec2 st2 = dFdy(uv);
    vec3 N = normalize(normal);
    vec3 T = normalize(((Q1 * vec3((st2).y)) - (Q2 * vec3((st1).y))));
    vec3 B = (-normalize(cross(N, T)));
    mat3 TBN = mat3(T, B, N);
    vec3 res = MulMat(tangentNormal,TBN);
    return res;
}
struct PsIn
{
    vec4 position;
    vec3 normal;
    vec3 pos;
    vec2 uv;
};
struct PSOut
{
    vec4 albedo;
    vec4 normal;
    vec4 specular;
};
PSOut HLSLmain(PsIn input1)
{
    PSOut Out;
    float alpha = (texture(sampler2D(textureMaps[cbTextureRootConstants.albedoMap], defaultSampler), (input1).uv)).a;
    if((alpha < float(0.5)))
    {
        discard;
    }
    vec3 albedo = vec3(0.5, 0.0, 0.0);
    float _roughness = roughness;
    float _metalness = metalness;
    float ao = 1.0;
    vec3 N = normalize((input1).normal);
    if((pbrMaterials != (-1)))
    {
        (N = getNormalFromMap((input1).pos, (input1).normal, (input1).uv));
        (albedo = pow((texture(sampler2D(textureMaps[cbTextureRootConstants.albedoMap], defaultSampler), (input1).uv)).rgb,vec3(vec3(2.20000004, 2.20000004, 2.20000004))));
        (_metalness = (texture(sampler2D(textureMaps[cbTextureRootConstants.metallicMap], defaultSampler), (input1).uv)).r);
        (_roughness = (texture(sampler2D(textureMaps[cbTextureRootConstants.roughnessMap], defaultSampler), (input1).uv)).r);
        (ao = (textureLod(sampler2D(textureMaps[cbTextureRootConstants.aoMap], defaultSampler), (input1).uv, float(0))).r);
    }
    if((pbrMaterials == 2))
    {
        (albedo = vec3(0.7, 0.7, 0.7));
        (_roughness = roughness);
        (_metalness = metalness);
        (ao = 1.0);
    }
    ((Out).albedo = vec4(albedo, alpha));
    ((Out).normal = vec4(N, _metalness));
    ((Out).specular = vec4(_roughness, ao, (input1).uv));
    return Out;
}
void main()
{
    PsIn input1;
    input1.position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.normal = fragInput_TEXCOORD0;
    input1.pos = fragInput_TEXCOORD1;
    input1.uv = fragInput_TEXCOORD2;
    PSOut result = HLSLmain(input1);
    rast_FragData0 = result.albedo;
    rast_FragData1 = result.normal;
    rast_FragData2 = result.specular;
}
