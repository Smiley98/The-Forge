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

float hash(float3 p)
{
    (p = frac(((p * (float3 )(0.31830990)) + (float3 )(0.1))));
    (p *= (float3 )(17.0));
    return frac((((p.x * p.y) * p.z) * ((p.x + p.y) + p.z)));
};

float noise(in float3 x)
{
    float3 p = floor(x);
    float3 f = frac(x);
    (f = ((f * f) * ((float3 )(3.0) - ((float3 )(2.0) * f))));
    return lerp(lerp(lerp(hash((p + float3(0, 0, 0))), hash((p + float3(1, 0, 0))), f.x), lerp(hash((p + float3(0, 1, 0))), hash((p + float3(1, 1, 0))), f.x), f.y), lerp(lerp(hash((p + float3(0, 0, 1))), hash((p + float3(1, 0, 1))), f.x), lerp(hash((p + float3(0, 1, 1))), hash((p + float3(1, 1, 1))), f.x), f.y), f.z);
};

struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 WorldPosition : POSITION;
    float4 Normal : NORMAL;
    float4 UV : TEXCOORD0;
    uint MatID : MAT_ID;
};
struct PSOutput
{
    float2 RedVarianceShadowMap : SV_Target0;
    float2 GreenVarianceShadowMap : SV_Target1;
    float2 BlueVarianceShadowMap : SV_Target2;
};
PSOutput main(VSOutput input)
{
    Material mat = Materials[input.MatID];
    float4 matColor = (((mat.TextureFlags & (uint )(1)))?(MaterialTextures[mat.AlbedoTexID].Sample(LinearSampler, input.UV.xy)):(mat.Color));
    float3 p = (float3 )((float4 )(1.0) - mat.Transmission * (float4 )(matColor.a));
    float e = noise((input.WorldPosition.xyz * (float3 )(10000.0)));
    float3 normal = normalize(input.Normal.xyz);
    float3 ld = float3(camViewMat[2][0], camViewMat[2][1], camViewMat[2][2]);
    float s = saturate(((mat.RefractionRatio - 1.0) * 0.5));
    float g = ((2.0 * saturate((1.0 - pow(dot(normalize(normal), -ld.xyz), ((128.0 * s) * s))))) - 1.0);
    (p = min((const float3 )(1.0), ((float3 )(1.0 + (g * pow(s, 0.2))) * p)));
    PSOutput output;
    float2 moments = ComputeMoments(input.Position.z);
    (output.RedVarianceShadowMap = max(moments, (const float2 )(e > p.r)));
    (output.GreenVarianceShadowMap = max(moments, (const float2 )(e > p.g)));
    (output.BlueVarianceShadowMap = max(moments, (const float2 )(e > p.b)));
    return output;
};

