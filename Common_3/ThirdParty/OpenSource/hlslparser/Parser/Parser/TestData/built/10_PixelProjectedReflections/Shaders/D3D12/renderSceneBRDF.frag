struct Light
{
    float4 pos;
    float4 col;
    float radius;
    float intensity;
    float _pad0;
    float _pad1;
};
const static float PI = (const static float )(3.14159274);
cbuffer cbExtendCamera : register(b0, space1)
{
    float4x4 viewMat;
    float4x4 projMat;
    float4x4 viewProjMat;
    float4x4 InvViewProjMat;
    float4 cameraWorldPos;
    float4 viewPortSize;
};

cbuffer cbLights : register(b1)
{
    Light lights[16];
    int currAmountOflights;
};

struct DirectionalLight
{
    float4 mPos;
    float4 mCol;
    float4 mDir;
};
cbuffer cbDLights : register(b2)
{
    DirectionalLight dlights[16];
    int currAmountOfDLights;
};

Texture2D<float2> brdfIntegrationMap : register(t3);
TextureCube<float4> irradianceMap : register(t4);
TextureCube<float4> specularMap : register(t5);
Texture2D<float4> AlbedoTexture : register(t6);
Texture2D<float4> NormalTexture : register(t7);
Texture2D<float4> RoughnessTexture : register(t8);
Texture2D<float4> DepthTexture : register(t9);
SamplerState envSampler : register(s10);
SamplerState defaultSampler : register(s11);
float3 FresnelSchlickRoughness(float cosTheta, float3 F0, float roughness)
{
    float3 ret = float3(0.0, 0.0, 0.0);
    float powTheta = pow(((float )(1.0) - cosTheta), (const float )(5.0));
    float invRough = float(((float )(1.0) - roughness));
    (ret.x = (F0.x + ((max(invRough, F0.x) - F0.x) * powTheta)));
    (ret.y = (F0.y + ((max(invRough, F0.y) - F0.y) * powTheta)));
    (ret.z = (F0.z + ((max(invRough, F0.z) - F0.z) * powTheta)));
    return ret;
};

float3 fresnelSchlick(float cosTheta, float3 F0)
{
    return (F0 + (((float3 )(1.0) - F0) * (float3 )(pow(((float )(1.0) - cosTheta), (const float )(5.0)))));
};

float distributionGGX(float3 N, float3 H, float roughness)
{
    float a = (roughness * roughness);
    float a2 = (a * a);
    float NdotH = max(dot(N, H), (const float )(0.0));
    float NdotH2 = (NdotH * NdotH);
    float nom = a2;
    float denom = ((NdotH2 * (a2 - (float )(1.0))) + (float )(1.0));
    (denom = ((PI * denom) * denom));
    return (nom / denom);
};

float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = ((r * r) / 8.0);
    float nom = NdotV;
    float denom = ((NdotV * ((float )(1.0) - k)) + k);
    return (nom / denom);
};

float GeometrySmith(float3 N, float3 V, float3 L, float roughness)
{
    float NdotV = max(dot(N, V), (const float )(0.0));
    float NdotL = max(dot(N, L), (const float )(0.0));
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);
    return (ggx1 * ggx2);
};

float3 getWorldPositionFromDepth(float2 ndc, float sceneDepth)
{
    float4 worldPos = mul(InvViewProjMat, float4(ndc, sceneDepth, 1.0));
    (worldPos /= (float4 )(worldPos.w));
    return float3(worldPos.xyz);
};

struct VSOutput
{
    float4 Position : SV_POSITION;
    float2 uv : TEXCOORD0;
};
float4 main(VSOutput input) : SV_TARGET
{
    float3 albedo = AlbedoTexture.Sample(defaultSampler, input.uv).rgb;
    float4 normalColor = NormalTexture.Sample(defaultSampler, input.uv);
    float4 roughnessColor = RoughnessTexture.Sample(defaultSampler, input.uv);
    float _roughness = roughnessColor.r;
    float _metalness = normalColor.a;
    float ao = 1.0;
    float depth = DepthTexture.Sample(defaultSampler, input.uv).r;
    if (depth >= (float )(1.0))
    {
        return float4(albedo, 1.0);
    }
    float3 N = normalize(normalColor.rgb);
    float2 ndc = float2(((input.uv.x * (float )(2.0)) - (float )(1.0)), ((((float )(1.0) - input.uv.y) * (float )(2.0)) - (float )(1.0)));
    float3 worldPos = getWorldPositionFromDepth(ndc, depth);
    float3 V = normalize((cameraWorldPos.xyz - worldPos));
    float3 R = reflect(-V, N);
    float3 F0 = float3(0.040000000, 0.040000000, 0.040000000);
    (F0 = lerp(F0, albedo, (const float3 )(_metalness)));
    float3 Lo = float3(0.0, 0.0, 0.0);
    for (int i = 0; (i < currAmountOfDLights); ++i)
    {
        float3 L = -normalize(float3(dlights[i].mDir.xyz));
        float3 H = normalize((V + L));
        float3 radiance = (float3(dlights[i].mCol.rgb) * (float3 )(dlights[i].mCol.a));
        float NDF = distributionGGX(N, H, _roughness);
        float G = GeometrySmith(N, V, L, _roughness);
        float3 F = fresnelSchlick(max(dot(N, H), (const float )(0.0)), F0);
        float3 nominator = ((float3 )(NDF * G) * F);
        float denominator = (((4.0 * max(dot(N, V), (const float )(0.0))) * max(dot(N, L), (const float )(0.0))) + (float )(0.0010000000));
        float3 specular = (nominator / (float3 )(denominator));
        float3 kS = F;
        float3 kD = (float3(1.0, 1.0, 1.0) - kS);
        (kD *= (float3 )(1.0 - _metalness));
        float NdotL = max(dot(N, L), (const float )(0.0));
        if (NdotL > 0.0)
        {
            (Lo += (((((kD * albedo) / (float3 )(PI)) + specular) * radiance) * (float3 )(NdotL)));
        }
        else
        {
            (Lo += float3(0.0, 0.0, 0.0));
        }
    }
    for (int i = 0; (i < currAmountOflights); ++i)
    {
        float3 L = normalize((float3(lights[i].pos.xyz) - worldPos));
        float3 H = normalize((V + L));
        float distance = length((float3(lights[i].pos.xyz) - worldPos));
        float distanceByRadius = (1.0 - pow((distance / lights[i].radius), (const float )(4)));
        float clamped = pow(clamp(distanceByRadius, 0.0, 1.0), 2.0);
        float attenuation = (clamped / ((distance * distance) + 1.0));
        float3 radiance = ((float3(lights[i].col.rgb) * (float3 )(attenuation)) * (float3 )(lights[i].intensity));
        float NDF = distributionGGX(N, H, _roughness);
        float G = GeometrySmith(N, V, L, _roughness);
        float3 F = fresnelSchlick(max(dot(N, H), (const float )(0.0)), F0);
        float3 nominator = ((float3 )(NDF * G) * F);
        float denominator = (((4.0 * max(dot(N, V), (const float )(0.0))) * max(dot(N, L), (const float )(0.0))) + (float )(0.0010000000));
        float3 specular = (nominator / (float3 )(denominator));
        float3 kS = F;
        float3 kD = (float3(1.0, 1.0, 1.0) - kS);
        (kD *= (float3 )(1.0 - _metalness));
        float NdotL = max(dot(N, L), (const float )(0.0));
        if (NdotL > 0.0)
        {
            (Lo += (((((kD * albedo) / (float3 )(PI)) + specular) * radiance) * (float3 )(NdotL)));
        }
        else
        {
            (Lo += float3(0.0, 0.0, 0.0));
        }
    }
    float3 F = FresnelSchlickRoughness(max(dot(N, V), (const float )(0.0)), F0, _roughness);
    float3 kS = F;
    float3 kD = (float3(1.0, 1.0, 1.0) - kS);
    (kD *= (float3 )((float )(1.0) - _metalness));
    float3 irradiance = irradianceMap.Sample(envSampler, N).rgb;
    float3 diffuse = ((kD * irradiance) * albedo);
    float3 specularColor = specularMap.SampleLevel(envSampler, R, (_roughness * (float )(4))).rgb;
    float2 maxNVRough = float2(max(dot(N, V), (const float )(0.0)), _roughness);
    float2 brdf = brdfIntegrationMap.Sample(defaultSampler, maxNVRough).rg;
    float3 specular = (specularColor * ((F * (float3 )(brdf.x)) + (float3 )(brdf.y)));
    float3 ambient = (float3((diffuse + specular)) * float3(ao, ao, ao));
    float3 color = (Lo + (ambient * (float3 )(0.2)));
    (color = (color / (color + float3(1.0, 1.0, 1.0))));
    float gammaCorr = (1.0 / 2.20000004);
    (color.r = pow(color.r, gammaCorr));
    (color.g = pow(color.g, gammaCorr));
    (color.b = pow(color.b, gammaCorr));
    return float4(color.r, color.g, color.b, 1.0);
};

