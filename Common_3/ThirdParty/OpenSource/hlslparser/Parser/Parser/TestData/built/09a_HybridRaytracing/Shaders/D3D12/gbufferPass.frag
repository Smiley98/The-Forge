cbuffer cbPerPass : register(b0, space1)
{
    float4x4 projView;
};

cbuffer cbPerProp : register(b1)
{
    float4x4 world;
    float roughness;
    float metallic;
    int pbrMaterials;
    float pad;
};

cbuffer cbTextureRootConstants : register(b2)
{
    uint albedoMap;
    uint normalMap;
    uint metallicMap;
    uint roughnessMap;
    uint aoMap;
};

SamplerState samplerLinear : register(s2);
Texture2D<float4> textureMaps[] : register(t3);
struct PsIn
{
    float3 normal : TEXCOORD0;
    float3 pos : TEXCOORD1;
    float2 uv : TEXCOORD2;
};
struct PSOut
{
    float4 albedo : SV_Target0;
    float4 normal : SV_Target1;
};
PSOut main(PsIn input) : SV_TARGET
{
    PSOut Out = (PSOut )(0);
    float3 albedo = textureMaps[albedoMap].Sample(samplerLinear, input.uv).rgb;
    float3 N = normalize(input.normal);
    (Out.albedo = float4(albedo, 1));
    (Out.normal = float4(N, 0));
    return Out;
};

