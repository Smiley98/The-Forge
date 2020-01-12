cbuffer uniformBlock : register(b0, space3)
{
    float4x4 vpMatrix;
    float4x4 modelMatrix;
};

cbuffer boneMatrices : register(b1, space3)
{
    float4x4 boneMatrix[1024];
};

cbuffer boneOffsetMatrices : register(b2)
{
    float4x4 boneOffsetMatrix[1024];
};

struct VSInput
{
    float3 Position : POSITION;
    float3 Normal : NORMAL;
    float2 UV : TEXCOORD0;
    float4 BoneWeights : TEXCOORD1;
    uint4 BoneIndices : TEXCOORD2;
};
struct VSOutput
{
    float4 Position : SV_POSITION;
    float3 Normal : NORMAL;
    float2 UV : TEXCOORD0;
};
VSOutput main(VSInput input)
{
    VSOutput result;
    float4x4 boneTransform = (mul(boneMatrix[input.BoneIndices[0]], boneOffsetMatrix[input.BoneIndices[0]]) * (float4x4 )(input.BoneWeights[0]));
    (boneTransform += (mul(boneMatrix[input.BoneIndices[1]], boneOffsetMatrix[input.BoneIndices[1]]) * (float4x4 )(input.BoneWeights[1])));
    (boneTransform += (mul(boneMatrix[input.BoneIndices[2]], boneOffsetMatrix[input.BoneIndices[2]]) * (float4x4 )(input.BoneWeights[2])));
    (boneTransform += (mul(boneMatrix[input.BoneIndices[3]], boneOffsetMatrix[input.BoneIndices[3]]) * (float4x4 )(input.BoneWeights[3])));
    (result.Position = mul(boneTransform, float4(input.Position, 1.0)));
    (result.Position = mul(modelMatrix, result.Position));
    (result.Position = mul(vpMatrix, result.Position));
    (result.Normal = normalize(mul(modelMatrix, float4(input.Normal, 0.0)).xyz));
    (result.UV = input.UV);
    return result;
};

