struct VsIn
{
    float3 position : POSITION;
    float3 normal : NORMAL;
    float2 texCoord : TEXCOORD;
};
cbuffer cbCamera : register(b0, space1)
{
    float4x4 projView;
    float3 camPos;
};

cbuffer cbObject : register(b1, space3)
{
    float4x4 worldMat;
    float roughness;
    float metalness;
    int pbrMaterials;
};

struct PsIn
{
    float4 position : SV_Position;
    float3 normal : TEXCOORD0;
    float3 pos : TEXCOORD1;
    float2 texCoord : TEXCOORD2;
};
PsIn main(VsIn In)
{
    PsIn Out;
    (Out.position = mul(projView, mul(worldMat, float4(In.position.xyz, 1.0))));
    (Out.normal = normalize(mul(worldMat, float4(In.normal, 0.0)).rgb));
    (Out.pos = mul(worldMat, float4(In.position.xyz, 1.0)).rgb);
    (Out.texCoord = In.texCoord);
    return Out;
};

