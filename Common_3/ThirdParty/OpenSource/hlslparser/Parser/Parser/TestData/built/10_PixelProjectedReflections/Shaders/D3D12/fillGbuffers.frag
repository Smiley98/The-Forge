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

cbuffer cbTextureRootConstants : register(b2)
{
    uint albedoMap;
    uint normalMap;
    uint metallicMap;
    uint roughnessMap;
    uint aoMap;
};

SamplerState defaultSampler : register(s2);
Texture2D<float4> textureMaps[] : register(t3, space10);
float3 reconstructNormal(in float4 sampleNormal)
{
    float3 tangentNormal;
    (tangentNormal.xy = ((sampleNormal.rg * (float2 )(2)) - (float2 )(1)));
    (tangentNormal.z = sqrt(((float )(1) - saturate(dot(tangentNormal.xy, tangentNormal.xy)))));
    return tangentNormal;
};

float3 getNormalFromMap(float3 pos, float3 normal, float2 uv)
{
    float3 tangentNormal = reconstructNormal(textureMaps[normalMap].Sample(defaultSampler, uv));
    float3 Q1 = ddx(pos);
    float3 Q2 = ddy(pos);
    float2 st1 = ddx(uv);
    float2 st2 = ddy(uv);
    float3 N = normalize(normal);
    float3 T = normalize(((Q1 * (float3 )(st2.y)) - (Q2 * (float3 )(st1.y))));
    float3 B = -normalize(cross(N, T));
    float3x3 TBN = float3x3(T, B, N);
    float3 res = mul(tangentNormal, TBN);
    return res;
};

struct PsIn
{
    float4 position : SV_Position;
    float3 normal : TEXCOORD0;
    float3 pos : TEXCOORD1;
    float2 uv : TEXCOORD2;
};
struct PSOut
{
    float4 albedo : SV_Target0;
    float4 normal : SV_Target1;
    float4 specular : SV_Target2;
};
PSOut main(PsIn input) : SV_TARGET
{
    PSOut Out;
    float alpha = textureMaps[albedoMap].Sample(defaultSampler, input.uv).a;
    if (alpha < (float )(0.5))
    {
        discard;
    }
    float3 albedo = float3(0.5, 0.0, 0.0);
    float _roughness = roughness;
    float _metalness = metalness;
    float ao = 1.0;
    float3 N = normalize(input.normal);
    if (pbrMaterials != -1)
    {
        (N = getNormalFromMap(input.pos, input.normal, input.uv));
        (albedo = pow(textureMaps[albedoMap].Sample(defaultSampler, input.uv).rgb, float3(2.20000004, 2.20000004, 2.20000004)));
        (_metalness = textureMaps[metallicMap].Sample(defaultSampler, input.uv).r);
        (_roughness = textureMaps[roughnessMap].Sample(defaultSampler, input.uv).r);
        (ao = textureMaps[aoMap].SampleLevel(defaultSampler, input.uv, (const float )(0)).r);
    }
    if (pbrMaterials == 2)
    {
        (albedo = float3(0.7, 0.7, 0.7));
        (_roughness = roughness);
        (_metalness = metalness);
        (ao = 1.0);
    }
    (Out.albedo = float4(albedo, alpha));
    (Out.normal = float4(N, _metalness));
    (Out.specular = float4(_roughness, ao, input.uv));
    return Out;
};

