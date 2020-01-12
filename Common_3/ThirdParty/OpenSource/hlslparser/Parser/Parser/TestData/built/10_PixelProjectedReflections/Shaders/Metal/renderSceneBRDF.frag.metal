#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct Light
    {
        float4 pos;
        float4 col;
        float radius;
        float intensity;
        float _pad0;
        float _pad1;
    };
    const float PI = float(3.14159274);
    struct Uniforms_cbExtendCamera
    {
        float4x4 viewMat;
        float4x4 projMat;
        float4x4 viewProjMat;
        float4x4 InvViewProjMat;
        float4 cameraWorldPos;
        float4 viewPortSize;
    };
    constant Uniforms_cbExtendCamera& cbExtendCamera;
    struct Uniforms_cbLights
    {
        array<Light, 16> lights;
        int currAmountOflights;
    };
    constant Uniforms_cbLights& cbLights;
    struct DirectionalLight
    {
        float4 mPos;
        float4 mCol;
        float4 mDir;
    };
    struct Uniforms_cbDLights
    {
        array<DirectionalLight, 16> dlights;
        int currAmountOfDLights;
    };
    constant Uniforms_cbDLights& cbDLights;
    texture2d<float> brdfIntegrationMap;
    texturecube<float> irradianceMap;
    texturecube<float> specularMap;
    texture2d<float> AlbedoTexture;
    texture2d<float> NormalTexture;
    texture2d<float> RoughnessTexture;
    texture2d<float> DepthTexture;
    sampler envSampler;
    sampler defaultSampler;
    float3 FresnelSchlickRoughness(float cosTheta, float3 F0, float roughness)
    {
        float3 ret = float3((float)0.0, (float)0.0, (float)0.0);
        float powTheta = pow((float(1.0) - cosTheta), float(5.0));
        float invRough = float((float(1.0) - roughness));
        ((ret).x = ((F0).x + ((max((float)invRough,(float)F0.x) - (F0).x) * powTheta)));
        ((ret).y = ((F0).y + ((max((float)invRough,(float)F0.y) - (F0).y) * powTheta)));
        ((ret).z = ((F0).z + ((max((float)invRough,(float)F0.z) - (F0).z) * powTheta)));
        return ret;
    };
    float3 fresnelSchlick(float cosTheta, float3 F0)
    {
        return (F0 + ((float3(1.0) - F0) * float3(pow((float(1.0) - cosTheta), float(5.0)))));
    };
    float distributionGGX(float3 N, float3 H, float roughness)
    {
        float a = (roughness * roughness);
        float a2 = (a * a);
        float NdotH = max((float)dot(N, H),(float)float(0.0));
        float NdotH2 = (NdotH * NdotH);
        float nom = a2;
        float denom = ((NdotH2 * (a2 - float(1.0))) + float(1.0));
        (denom = ((PI * denom) * denom));
        return (nom / denom);
    };
    float GeometrySchlickGGX(float NdotV, float roughness)
    {
        float r = (roughness + 1.0);
        float k = ((r * r) / 8.0);
        float nom = NdotV;
        float denom = ((NdotV * (float(1.0) - k)) + k);
        return (nom / denom);
    };
    float GeometrySmith(float3 N, float3 V, float3 L, float roughness)
    {
        float NdotV = max((float)dot(N, V),(float)float(0.0));
        float NdotL = max((float)dot(N, L),(float)float(0.0));
        float ggx2 = GeometrySchlickGGX(NdotV, roughness);
        float ggx1 = GeometrySchlickGGX(NdotL, roughness);
        return (ggx1 * ggx2);
    };
    float3 getWorldPositionFromDepth(float2 ndc, float sceneDepth)
    {
        float4 worldPos = ((cbExtendCamera.InvViewProjMat)*(float4(ndc, sceneDepth, (float)1.0)));
        (worldPos /= float4(worldPos.w));
        return float3((worldPos).xyz);
    };
    struct VSOutput
    {
        float4 Position;
        float2 uv;
    };
    float4 main(VSOutput input)
    {
        float3 albedo = (AlbedoTexture.sample(defaultSampler, (input).uv)).rgb;
        float4 normalColor = NormalTexture.sample(defaultSampler, (input).uv);
        float4 roughnessColor = RoughnessTexture.sample(defaultSampler, (input).uv);
        float _roughness = (roughnessColor).r;
        float _metalness = (normalColor).a;
        float ao = 1.0;
        float depth = (DepthTexture.sample(defaultSampler, (input).uv)).r;
        if (depth >= float(1.0))
        {
            return float4(albedo, (float)1.0);
        }
        float3 N = normalize((normalColor).rgb);
        float2 ndc = float2(((((input).uv).x * float(2.0)) - float(1.0)), (((float(1.0) - ((input).uv).y) * float(2.0)) - float(1.0)));
        float3 worldPos = getWorldPositionFromDepth(ndc, depth);
        float3 V = normalize(((cbExtendCamera.cameraWorldPos).xyz - worldPos));
        float3 R = reflect((-V), N);
        float3 F0 = float3(0.040000000, 0.040000000, 0.040000000);
        (F0 = mix(F0, albedo, float3(_metalness)));
        float3 Lo = float3((float)0.0, (float)0.0, (float)0.0);
        for (int i = 0; (i < cbDLights.currAmountOfDLights); (++i))
        {
            float3 L = (-normalize(float3(((cbDLights.dlights[i]).mDir).xyz)));
            float3 H = normalize((V + L));
            float3 radiance = (float3(((cbDLights.dlights[i]).mCol).rgb) * float3((cbDLights.dlights[i]).mCol.a));
            float NDF = distributionGGX(N, H, _roughness);
            float G = GeometrySmith(N, V, L, _roughness);
            float3 F = fresnelSchlick(max((float)dot(N, H),(float)float(0.0)), F0);
            float3 nominator = (float3(NDF * G) * F);
            float denominator = (((4.0 * max((float)dot(N, V),(float)float(0.0))) * max((float)dot(N, L),(float)float(0.0))) + float(0.0010000000));
            float3 specular = (nominator / float3(denominator));
            float3 kS = F;
            float3 kD = (float3((float)1.0, (float)1.0, (float)1.0) - kS);
            (kD *= float3(1.0 - _metalness));
            float NdotL = max((float)dot(N, L),(float)float(0.0));
            if (NdotL > 0.0)
            {
                (Lo += (((((kD * albedo) / float3(PI)) + specular) * radiance) * float3(NdotL)));
            }
            else
            {
                (Lo += float3(0.0, 0.0, 0.0));
            }
        }
        for (int i = 0; (i < cbLights.currAmountOflights); (++i))
        {
            float3 L = normalize((float3(((cbLights.lights[i]).pos).xyz) - worldPos));
            float3 H = normalize((V + L));
            float distance = length((float3(((cbLights.lights[i]).pos).xyz) - worldPos));
            float distanceByRadius = (1.0 - pow((distance / (cbLights.lights[i]).radius), float(4)));
            float clamped = pow(clamp(distanceByRadius, 0.0, 1.0), 2.0);
            float attenuation = (clamped / ((distance * distance) + 1.0));
            float3 radiance = ((float3(((cbLights.lights[i]).col).rgb) * float3(attenuation)) * float3(cbLights.lights[i].intensity));
            float NDF = distributionGGX(N, H, _roughness);
            float G = GeometrySmith(N, V, L, _roughness);
            float3 F = fresnelSchlick(max((float)dot(N, H),(float)float(0.0)), F0);
            float3 nominator = (float3(NDF * G) * F);
            float denominator = (((4.0 * max((float)dot(N, V),(float)float(0.0))) * max((float)dot(N, L),(float)float(0.0))) + float(0.0010000000));
            float3 specular = (nominator / float3(denominator));
            float3 kS = F;
            float3 kD = (float3((float)1.0, (float)1.0, (float)1.0) - kS);
            (kD *= float3(1.0 - _metalness));
            float NdotL = max((float)dot(N, L),(float)float(0.0));
            if (NdotL > 0.0)
            {
                (Lo += (((((kD * albedo) / float3(PI)) + specular) * radiance) * float3(NdotL)));
            }
            else
            {
                (Lo += float3(0.0, 0.0, 0.0));
            }
        }
        float3 F = FresnelSchlickRoughness(max((float)dot(N, V),(float)float(0.0)), F0, _roughness);
        float3 kS = F;
        float3 kD = (float3((float)1.0, (float)1.0, (float)1.0) - kS);
        (kD *= float3(float(1.0) - _metalness));
        float3 irradiance = (irradianceMap.sample(envSampler, N)).rgb;
        float3 diffuse = ((kD * irradiance) * albedo);
        float3 specularColor = (specularMap.sample(envSampler, R, level((_roughness * float(4))))).rgb;
        float2 maxNVRough = float2(max((float)dot(N, V),(float)float(0.0)), _roughness);
        float2 brdf = (brdfIntegrationMap.sample(defaultSampler, maxNVRough)).rg;
        float3 specular = (specularColor * ((F * float3(brdf.x)) + float3(brdf.y)));
        float3 ambient = (float3((diffuse + specular)) * float3(ao, ao, ao));
        float3 color = (Lo + (ambient * float3(0.2)));
        (color = (color / (color + float3(1.0, 1.0, 1.0))));
        float gammaCorr = (1.0 / 2.20000004);
        ((color).r = pow((color).r, gammaCorr));
        ((color).g = pow((color).g, gammaCorr));
        ((color).b = pow((color).b, gammaCorr));
        return float4((color).r, (color).g, (color).b, 1.0);
    };

    Fragment_Shader(constant Uniforms_cbExtendCamera& cbExtendCamera, constant Uniforms_cbLights& cbLights, constant Uniforms_cbDLights& cbDLights, texture2d<float> brdfIntegrationMap, texturecube<float> irradianceMap, texturecube<float> specularMap, texture2d<float> AlbedoTexture, texture2d<float> NormalTexture, texture2d<float> RoughnessTexture, texture2d<float> DepthTexture, sampler envSampler, sampler defaultSampler) :
        cbExtendCamera(cbExtendCamera), cbLights(cbLights), cbDLights(cbDLights), brdfIntegrationMap(brdfIntegrationMap), irradianceMap(irradianceMap), specularMap(specularMap), AlbedoTexture(AlbedoTexture), NormalTexture(NormalTexture), RoughnessTexture(RoughnessTexture), DepthTexture(DepthTexture), envSampler(envSampler), defaultSampler(defaultSampler)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float2 TEXCOORD0;
};

struct ArgBuffer0
{
    constant Fragment_Shader::Uniforms_cbLights& cbLights [[id(1)]];
    constant Fragment_Shader::Uniforms_cbDLights& cbDLights [[id(2)]];
    texture2d<float> brdfIntegrationMap [[id(3)]];
    texturecube<float> irradianceMap [[id(4)]];
    texturecube<float> specularMap [[id(5)]];
    texture2d<float> AlbedoTexture [[id(6)]];
    texture2d<float> NormalTexture [[id(7)]];
    texture2d<float> RoughnessTexture [[id(8)]];
    texture2d<float> DepthTexture [[id(9)]];
    sampler envSampler [[id(10)]];
    sampler defaultSampler [[id(11)]];
};

struct ArgBuffer1
{
    constant Fragment_Shader::Uniforms_cbExtendCamera& cbExtendCamera [[id(0)]];
};

fragment float4 stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.uv = inputData.TEXCOORD0;
    Fragment_Shader main(argBuffer1.cbExtendCamera, argBuffer0.cbLights, argBuffer0.cbDLights, argBuffer0.brdfIntegrationMap, argBuffer0.irradianceMap, argBuffer0.specularMap, argBuffer0.AlbedoTexture, argBuffer0.NormalTexture, argBuffer0.RoughnessTexture, argBuffer0.DepthTexture, argBuffer0.envSampler, argBuffer0.defaultSampler);
    return main.main(input0);
}
