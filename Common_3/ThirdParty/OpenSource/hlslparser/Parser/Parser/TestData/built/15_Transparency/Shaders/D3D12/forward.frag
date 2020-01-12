struct Material
{
    float4 Color;
    float4 Transmission;
    float RefractionRatio;
    float Collimation;
    float2 Padding;
    uint TextureFlags;
    uint AlbedoTexID;
    uint MetallicTexID;
    uint RoughnessTexID;
    uint EmissiveTexID;
    uint3 Padding2;
};
struct ObjectInfo
{
    float4x4 toWorld;
    float4x4 normalMat;
    uint matID;
};
cbuffer DrawInfoRootConstant : register(b0, space0)
{
    uint baseInstance = (uint )(0);
};

cbuffer ObjectUniformBlock : register(b0, space1)
{
    ObjectInfo objectInfo[128];
};

cbuffer LightUniformBlock : register(b3, space1)
{
    float4x4 lightViewProj;
    float4 lightDirection;
    float4 lightColor;
};

cbuffer CameraUniform : register(b1, space1)
{
    float4x4 camViewProj;
    float4x4 camViewMat;
    float4 camClipInfo;
    float4 camPosition;
};

cbuffer MaterialUniform : register(b2, space1)
{
    Material Materials[128];
};

Texture2D<float4> MaterialTextures[8] : register(t100, space0);
SamplerState LinearSampler : register(s0, space0);
Texture2D<float4> VSM : register(t1, space0);
SamplerState VSMSampler : register(s2, space0);
float2 ComputeMoments(float depth)
{
    float2 moments;
    (moments.x = depth);
    float2 pd = float2(ddx(depth), ddy(depth));
    (moments.y = ((depth * depth) + (0.25 * dot(pd, pd))));
    return moments;
};

float ChebyshevUpperBound(float2 moments, float t)
{
    float p = (float )(t <= moments.x);
    float variance = (moments.y - (moments.x * moments.x));
    (variance = max(variance, 0.0010000000));
    float d = (t - moments.x);
    float pMax = (variance / (variance + (d * d)));
    return max(p, pMax);
};

float3 ShadowContribution(float2 shadowMapPos, float distanceToLight)
{
    float2 moments = VSM.Sample(VSMSampler, shadowMapPos).xy;
    float3 shadow = (float3 )(ChebyshevUpperBound(moments, distanceToLight));
    return shadow;
};

float4 Shade(uint matID, float2 uv, float3 worldPos, float3 normal)
{
    float nDotl = dot(normal, -lightDirection.xyz);
    Material mat = Materials[matID];
    float4 matColor = (((mat.TextureFlags & (uint )(1)))?(MaterialTextures[mat.AlbedoTexID].Sample(LinearSampler, uv)):(mat.Color));
    float3 viewVec = normalize((worldPos - camPosition.xyz));
    if (nDotl < 0.05)
    {
        (nDotl = 0.05);
    }
    float3 diffuse = ((lightColor.xyz * matColor.xyz) * (float3 )(nDotl));
    float3 specular = (lightColor.xyz * (float3 )(pow(saturate(dot(reflect(-lightDirection.xyz, normal), viewVec)), 10.0)));
    float3 finalColor = saturate((diffuse + (specular * (float3 )(0.5))));
    float4 shadowMapPos = mul(lightViewProj, float4(worldPos, 1.0));
    (shadowMapPos.y = -shadowMapPos.y);
    (shadowMapPos.xy = ((shadowMapPos.xy + (float2 )(1.0)) * (float2 )(0.5)));
    if (clamp(shadowMapPos.x, 0.010000000, 0.99) == shadowMapPos.x && (clamp(shadowMapPos.y, 0.010000000, 0.99) == shadowMapPos.y) && (shadowMapPos.z > 0.0))
    {
        float3 lighting = ShadowContribution(shadowMapPos.xy, shadowMapPos.z);
        (finalColor *= lighting);
    }
    return float4(finalColor, matColor.a);
};

struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 WorldPosition : POSITION;
    float4 Normal : NORMAL;
    float4 UV : TEXCOORD0;
    uint MatID : MAT_ID;
};
float4 main(VSOutput input) : SV_Target
{
    return Shade(input.MatID, input.UV.xy, input.WorldPosition.xyz, normalize(input.Normal.xyz));
};

