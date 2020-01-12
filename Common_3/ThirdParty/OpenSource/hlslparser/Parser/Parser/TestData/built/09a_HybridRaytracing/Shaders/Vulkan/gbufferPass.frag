#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec3 fragInput_TEXCOORD0;
layout(location = 1) in vec3 fragInput_TEXCOORD1;
layout(location = 2) in vec2 fragInput_TEXCOORD2;
layout(location = 0) out vec4 rast_FragData0; 
layout(location = 1) out vec4 rast_FragData1; 

layout(row_major, set = 1, binding = 0) uniform cbPerPass
{
    mat4 projView;
};

layout(row_major, set = 0, binding = 1) uniform cbPerProp
{
    mat4 world;
    float roughness;
    float metallic;
    int pbrMaterials;
    float pad;
};

layout(row_major, push_constant) uniform cbTextureRootConstants_Block
{
    uint albedoMap;
    uint normalMap;
    uint metallicMap;
    uint roughnessMap;
    uint aoMap;
}cbTextureRootConstants;

layout(set = 0, binding = 2) uniform sampler samplerLinear;
layout(set = 0, binding = 3) uniform texture2D textureMaps[];
struct PsIn
{
    vec3 normal;
    vec3 pos;
    vec2 uv;
};
struct PSOut
{
    vec4 albedo;
    vec4 normal;
};
PSOut HLSLmain(PsIn input1)
{
    PSOut Out = <user defined>(0);
    vec3 albedo = (texture(sampler2D(textureMaps[cbTextureRootConstants.albedoMap], samplerLinear), (input1).uv)).rgb;
    vec3 N = normalize((input1).normal);
    ((Out).albedo = vec4(albedo, 1));
    ((Out).normal = vec4(N, 0));
    return Out;
}
void main()
{
    PsIn input1;
    input1.normal = fragInput_TEXCOORD0;
    input1.pos = fragInput_TEXCOORD1;
    input1.uv = fragInput_TEXCOORD2;
    PSOut result = HLSLmain(input1);
    rast_FragData0 = result.albedo;
    rast_FragData1 = result.normal;
}
