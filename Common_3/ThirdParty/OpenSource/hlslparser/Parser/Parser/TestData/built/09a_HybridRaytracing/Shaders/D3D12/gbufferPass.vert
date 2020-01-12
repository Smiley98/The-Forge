struct VsIn
{
    float3 position : POSITION;
    float3 normal : NORMAL;
    float2 texCoord : TEXCOORD;
};
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

struct PsIn
{
    float3 normal : TEXCOORD0;
    float3 pos : TEXCOORD1;
    float2 texCoord : TEXCOORD2;
    nointerpolation uint materialID : TEXCOORD3;
    float4 position : SV_Position;
};
PsIn main(VsIn In)
{
    PsIn Out;
    (Out.position = mul(projView, mul(world, float4(In.position.xyz, 1.0))));
    (Out.normal = mul((float3x3 )(world), In.normal.xyz).xyz);
    (Out.pos = mul(world, float4(In.position.xyz, 1.0)).xyz);
    (Out.texCoord = In.texCoord.xy);
    return Out;
};

