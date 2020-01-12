cbuffer rootConstant : register(b0)
{
    uint drawID;
};

cbuffer uniformBlock : register(b5, space1)
{
    float4x4 viewProj;
};

struct VsIn
{
    float4 position : Position;
    float4 normal : Normal;
};
struct PsIn
{
    float4 position : SV_Position;
    float3 posModel : PosModel;
    float3 normal : Normal;
    float4 albedo : Color;
};
struct AsteroidDynamic
{
    float4x4 transform;
    uint indexStart;
    uint indexEnd;
    uint padding[2];
};
struct AsteroidStatic
{
    float4 rotationAxis;
    float4 surfaceColor;
    float4 deepColor;
    float scale;
    float orbitSpeed;
    float rotationSpeed;
    uint textureID;
    uint vertexStart;
    uint padding[3];
};
RWStructuredBuffer<AsteroidStatic> asteroidsStatic : register(u1);
RWStructuredBuffer<AsteroidDynamic> asteroidsDynamic : register(u2);
PsIn main(VsIn In)
{
    PsIn result;
    AsteroidStatic asteroidStatic = asteroidsStatic[drawID];
    AsteroidDynamic asteroidDynamic = asteroidsDynamic[drawID];
    float4x4 worldMatrix = asteroidDynamic.transform;
    (result.position = mul(viewProj, mul(worldMatrix, float4(In.position.xyz, 1.0))));
    (result.posModel = In.position.xyz);
    (result.normal = mul((float3x3 )(worldMatrix), In.normal.xyz));
    float depth = saturate(((length(In.position.xyz) - 0.5) / (float )(0.2)));
    (result.albedo.xyz = lerp(asteroidStatic.deepColor.xyz, asteroidStatic.surfaceColor.xyz, (const float3 )(depth)));
    (result.albedo.w = (float )(asteroidStatic.textureID));
    return result;
};

