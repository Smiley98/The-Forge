struct InstanceData
{
    float4x4 mvp;
    float4x4 normalMat;
    float4 surfaceColor;
    float4 deepColor;
    int textureID;
    uint _pad0[3];
};
StructuredBuffer<InstanceData> instanceBuffer : register(t0, space2);
cbuffer rootConstant : register(b1)
{
    uint index;
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
float linstep(float min, float max, float s)
{
    return saturate(((s - min) / (max - min)));
};

PsIn main(VsIn In)
{
    PsIn result;
    (result.position = mul(instanceBuffer[index].mvp, float4(In.position.xyz, 1)));
    (result.posModel = In.position.xyz);
    (result.normal = normalize(mul(instanceBuffer[index].normalMat, float4(In.normal.xyz, 0)).xyz));
    float depth = linstep(0.5, 0.7, length(In.position.xyz));
    (result.albedo.xyz = lerp(instanceBuffer[index].deepColor.xyz, instanceBuffer[index].surfaceColor.xyz, (const float3 )(depth)));
    (result.albedo.w = float(instanceBuffer[index].textureID));
    return result;
};

