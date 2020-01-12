cbuffer RootConstant : register(b0)
{
    float aspect;
};

struct InstanceData
{
    float4 posScale;
    float4 colorIndex;
};
StructuredBuffer<InstanceData> instanceBuffer : register(t0, space1);
struct VSOutput
{
    float4 pos : SV_Position;
    float3 color : COLOR0;
    float2 uv : TEXCOORD0;
};
VSOutput main(in uint vertexId : SV_VertexID, in uint instanceId : SV_InstanceID)
{
    VSOutput result;
    float x = (float )(vertexId / (uint )(2));
    float y = (float )(vertexId & (uint )(1));
    (result.pos.x = (instanceBuffer[instanceId].posScale.x + ((x - 0.5) * instanceBuffer[instanceId].posScale.z)));
    (result.pos.y = (instanceBuffer[instanceId].posScale.y + (((y - 0.5) * instanceBuffer[instanceId].posScale.z) * aspect)));
    (result.pos.z = 0.0);
    (result.pos.w = 1.0);
    (result.uv = float2(((x + instanceBuffer[instanceId].colorIndex.w) / (float )(8)), ((float )(1) - y)));
    (result.color = instanceBuffer[instanceId].colorIndex.rgb);
    return result;
};

