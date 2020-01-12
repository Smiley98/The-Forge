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

struct VSInput
{
    float3 Position : POSITION;
    float2 TexCoord : TEXCOORD0;
};
struct PsIn
{
    float4 Position : SV_Position;
};
PsIn main(VSInput input)
{
    PsIn output;
    float4 inPos = float4(float3(input.Position.xyz), 1.0);
    (output.Position = mul(ViewProjMat, mul(world, inPos)));
    return output;
};

