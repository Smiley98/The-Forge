cbuffer ShadowUniformBuffer : register(b2, space1)
{
    float4x4 ViewProjMat;
};

cbuffer cbPerProp : register(b1, space3)
{
    float4x4 world;
    float4x4 InvTranspose;
    int unlit;
    int hasAlbedoMap;
    int hasNormalMap;
    int hasMetallicRoughnessMap;
    int hasAOMap;
    int hasEmissiveMap;
    float4 centerOffset;
    float4 posOffset;
    float2 uvOffset;
    float2 uvScale;
    float posScale;
    float padding0;
};

struct VsIn
{
    uint4 position : POSITION;
    int4 normal : NORMAL;
    uint2 texCoord : TEXCOORD0;
    uint4 baseColor : COLOR;
    uint2 metallicRoughness : TEXCOORD1;
    uint2 alphaSettings : TEXCOORD2;
};
struct PsIn
{
    float4 Position : SV_Position;
};
PsIn main(VsIn input)
{
    PsIn output;
    float unormPositionScale = (float((1 << 16)) - 1.0);
    float4 inPos = (float4(((float3(input.position.xyz) / (float3 )(unormPositionScale)) * (float3 )(posScale)), 1.0) + posOffset);
    (inPos += centerOffset);
    float4 worldPosition = mul(world, inPos);
    (worldPosition.xyz /= (float3 )(posScale));
    (output.Position = mul(ViewProjMat, worldPosition));
    return output;
};

