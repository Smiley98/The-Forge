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
struct PSOutput
{
    float4 Accumulation : SV_Target0;
    float4 Revealage : SV_Target1;
};
cbuffer WBOITSettings : register(b4, space1)
{
    float opacitySensitivity = (float )(3.0);
    float weightBias = (float )(5.0);
    float precisionScalar = (float )(10000.0);
    float maximumWeight = (float )(20.0);
    float maximumColorValue = (float )(1000.0);
    float additiveSensitivity = (float )(10.0);
    float emissiveSensitivityValue = 0.5;
};

void weighted_oit_process(out float4 accum, out float revealage, out float emissive_weight, float4 premultiplied_alpha_color, float raw_emissive_luminance, float view_depth, float current_camera_exposure)
{
    float relative_emissive_luminance = (raw_emissive_luminance * current_camera_exposure);
    const float emissive_sensitivity = ((float )(1.0) / emissiveSensitivityValue);
    float clamped_emissive = saturate(relative_emissive_luminance);
    float clamped_alpha = saturate(premultiplied_alpha_color.a);
    float a = saturate(((clamped_alpha * opacitySensitivity) + (clamped_emissive * emissive_sensitivity)));
    const float canonical_near_z = (const float )(0.5);
    const float canonical_far_z = (const float )(300.0);
    float range = (canonical_far_z - canonical_near_z);
    float canonical_depth = saturate(((canonical_far_z / range) - ((canonical_far_z * canonical_near_z) / (view_depth * range))));
    float b = ((float )(1.0) - canonical_depth);
    float3 clamped_color = min(premultiplied_alpha_color.rgb, (const float3 )(maximumColorValue));
    float w = (((precisionScalar * b) * b) * b);
    (w += weightBias);
    (w = min(w, maximumWeight));
    (w *= ((a * a) * a));
    (accum = float4((clamped_color * (float3 )(w)), w));
    (revealage = clamped_alpha);
    (emissive_weight = (saturate((relative_emissive_luminance * additiveSensitivity)) / 8.0));
};

PSOutput main(VSOutput input)
{
    PSOutput output;
    float4 finalColor = Shade(input.MatID, input.UV.xy, input.WorldPosition.xyz, normalize(input.Normal.xyz));
    float d = (input.Position.z / input.Position.w);
    float4 premultipliedColor = float4((finalColor.rgb * (float3 )(finalColor.a)), finalColor.a);
    float emissiveLuminance = dot(finalColor.rgb, float3(0.21260000, 0.71520000, 0.072200000));
    (output.Revealage = (float4 )(0.0));
    weighted_oit_process(output.Accumulation, output.Revealage.x, output.Revealage.w, premultipliedColor, emissiveLuminance, d, 1.0);
    return output;
};

