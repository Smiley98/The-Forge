#version 450 core

precision highp float;
precision highp int; 
vec4 MulMat(mat4 lhs, vec4 rhs)
{
    vec4 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1] + lhs[0][2]*rhs[2] + lhs[0][3]*rhs[3];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1] + lhs[1][2]*rhs[2] + lhs[1][3]*rhs[3];
	dst[2] = lhs[2][0]*rhs[0] + lhs[2][1]*rhs[1] + lhs[2][2]*rhs[2] + lhs[2][3]*rhs[3];
	dst[3] = lhs[3][0]*rhs[0] + lhs[3][1]*rhs[1] + lhs[3][2]*rhs[2] + lhs[3][3]*rhs[3];
    return dst;
}


layout(location = 0) in vec2 fragInput_TEXCOORD0;
layout(location = 0) out vec4 rast_FragData0; 

struct Light
{
    vec4 pos;
    vec4 col;
    float radius;
    float intensity;
    float _pad0;
    float _pad1;
};
const float PI = float(3.14159274);
layout(row_major, set = 1, binding = 0) uniform cbExtendCamera
{
    mat4 viewMat;
    mat4 projMat;
    mat4 viewProjMat;
    mat4 InvViewProjMat;
    vec4 cameraWorldPos;
    vec4 viewPortSize;
};

layout(row_major, set = 0, binding = 1) uniform cbLights
{
    Light lights[16];
    int currAmountOflights;
};

struct DirectionalLight
{
    vec4 mPos;
    vec4 mCol;
    vec4 mDir;
};
layout(row_major, set = 0, binding = 2) uniform cbDLights
{
    DirectionalLight dlights[16];
    int currAmountOfDLights;
};

layout(set = 0, binding = 3) uniform texture2D brdfIntegrationMap;
layout(set = 0, binding = 4) uniform textureCube irradianceMap;
layout(set = 0, binding = 5) uniform textureCube specularMap;
layout(set = 0, binding = 6) uniform texture2D AlbedoTexture;
layout(set = 0, binding = 7) uniform texture2D NormalTexture;
layout(set = 0, binding = 8) uniform texture2D RoughnessTexture;
layout(set = 0, binding = 9) uniform texture2D DepthTexture;
layout(set = 0, binding = 10) uniform sampler envSampler;
layout(set = 0, binding = 11) uniform sampler defaultSampler;
vec3 FresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness)
{
    vec3 ret = vec3(0.0, 0.0, 0.0);
    float powTheta = pow((float(1.0) - cosTheta),float(float(5.0)));
    float invRough = float((float(1.0) - roughness));
    ((ret).x = ((F0).x + ((max(invRough, (F0).x) - (F0).x) * powTheta)));
    ((ret).y = ((F0).y + ((max(invRough, (F0).y) - (F0).y) * powTheta)));
    ((ret).z = ((F0).z + ((max(invRough, (F0).z) - (F0).z) * powTheta)));
    return ret;
}
vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return (F0 + ((vec3(1.0) - F0) * vec3(pow((float(1.0) - cosTheta),float(float(5.0))))));
}
float distributionGGX(vec3 N, vec3 H, float roughness)
{
    float a = (roughness * roughness);
    float a2 = (a * a);
    float NdotH = max(dot(N, H), float(0.0));
    float NdotH2 = (NdotH * NdotH);
    float nom = a2;
    float denom = ((NdotH2 * (a2 - float(1.0))) + float(1.0));
    (denom = ((PI * denom) * denom));
    return (nom / denom);
}
float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = ((r * r) / 8.0);
    float nom = NdotV;
    float denom = ((NdotV * (float(1.0) - k)) + k);
    return (nom / denom);
}
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), float(0.0));
    float NdotL = max(dot(N, L), float(0.0));
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);
    return (ggx1 * ggx2);
}
vec3 getWorldPositionFromDepth(vec2 ndc, float sceneDepth)
{
    vec4 worldPos = MulMat(InvViewProjMat,vec4(ndc, sceneDepth, 1.0));
    (worldPos /= vec4((worldPos).w));
    return vec3((worldPos).xyz);
}
struct VSOutput
{
    vec4 Position;
    vec2 uv;
};
vec4 HLSLmain(VSOutput input1)
{
    vec3 albedo = (texture(sampler2D(AlbedoTexture, defaultSampler), (input1).uv)).rgb;
    vec4 normalColor = texture(sampler2D(NormalTexture, defaultSampler), (input1).uv);
    vec4 roughnessColor = texture(sampler2D(RoughnessTexture, defaultSampler), (input1).uv);
    float _roughness = (roughnessColor).r;
    float _metalness = (normalColor).a;
    float ao = 1.0;
    float depth = (texture(sampler2D(DepthTexture, defaultSampler), (input1).uv)).r;
    if((depth >= float(1.0)))
    {
        return vec4(albedo, 1.0);
    }
    vec3 N = normalize((normalColor).rgb);
    vec2 ndc = vec2(((((input1).uv).x * float(2.0)) - float(1.0)), (((float(1.0) - ((input1).uv).y) * float(2.0)) - float(1.0)));
    vec3 worldPos = getWorldPositionFromDepth(ndc, depth);
    vec3 V = normalize(((cameraWorldPos).xyz - worldPos));
    vec3 R = reflect((-V), N);
    vec3 F0 = vec3(0.040000000, 0.040000000, 0.040000000);
    (F0 = mix(F0, albedo, vec3(_metalness)));
    vec3 Lo = vec3(0.0, 0.0, 0.0);
    for (int i = 0; (i < currAmountOfDLights); (++i))
    {
        vec3 L = (-normalize(vec3(((dlights[i]).mDir).xyz)));
        vec3 H = normalize((V + L));
        vec3 radiance = (vec3(((dlights[i]).mCol).rgb) * vec3(((dlights[i]).mCol).a));
        float NDF = distributionGGX(N, H, _roughness);
        float G = GeometrySmith(N, V, L, _roughness);
        vec3 F = fresnelSchlick(max(dot(N, H), float(0.0)), F0);
        vec3 nominator = (vec3((NDF * G)) * F);
        float denominator = (((4.0 * max(dot(N, V), float(0.0))) * max(dot(N, L), float(0.0))) + float(0.0010000000));
        vec3 specular = (nominator / vec3(denominator));
        vec3 kS = F;
        vec3 kD = (vec3(1.0, 1.0, 1.0) - kS);
        (kD *= vec3((1.0 - _metalness)));
        float NdotL = max(dot(N, L), float(0.0));
        if((NdotL > 0.0))
        {
            (Lo += (((((kD * albedo) / vec3(PI)) + specular) * radiance) * vec3(NdotL)));
        }
        else
        {
            (Lo += vec3(0.0, 0.0, 0.0));
        }
    }
    for (int i = 0; (i < currAmountOflights); (++i))
    {
        vec3 L = normalize((vec3(((lights[i]).pos).xyz) - worldPos));
        vec3 H = normalize((V + L));
        float distance = length((vec3(((lights[i]).pos).xyz) - worldPos));
        float distanceByRadius = (1.0 - pow((distance / (lights[i]).radius),float(float(4))));
        float clamped = pow(clamp(distanceByRadius, 0.0, 1.0),float(2.0));
        float attenuation = (clamped / ((distance * distance) + 1.0));
        vec3 radiance = ((vec3(((lights[i]).col).rgb) * vec3(attenuation)) * vec3((lights[i]).intensity));
        float NDF = distributionGGX(N, H, _roughness);
        float G = GeometrySmith(N, V, L, _roughness);
        vec3 F = fresnelSchlick(max(dot(N, H), float(0.0)), F0);
        vec3 nominator = (vec3((NDF * G)) * F);
        float denominator = (((4.0 * max(dot(N, V), float(0.0))) * max(dot(N, L), float(0.0))) + float(0.0010000000));
        vec3 specular = (nominator / vec3(denominator));
        vec3 kS = F;
        vec3 kD = (vec3(1.0, 1.0, 1.0) - kS);
        (kD *= vec3((1.0 - _metalness)));
        float NdotL = max(dot(N, L), float(0.0));
        if((NdotL > 0.0))
        {
            (Lo += (((((kD * albedo) / vec3(PI)) + specular) * radiance) * vec3(NdotL)));
        }
        else
        {
            (Lo += vec3(0.0, 0.0, 0.0));
        }
    }
    vec3 F = FresnelSchlickRoughness(max(dot(N, V), float(0.0)), F0, _roughness);
    vec3 kS = F;
    vec3 kD = (vec3(1.0, 1.0, 1.0) - kS);
    (kD *= vec3((float(1.0) - _metalness)));
    vec3 irradiance = (texture(samplerCube(irradianceMap, envSampler), N)).rgb;
    vec3 diffuse = ((kD * irradiance) * albedo);
    vec3 specularColor = (textureLod(samplerCube(specularMap, envSampler), R, (_roughness * float(4)))).rgb;
    vec2 maxNVRough = vec2(max(dot(N, V), float(0.0)), _roughness);
    vec2 brdf = (texture(sampler2D(brdfIntegrationMap, defaultSampler), maxNVRough)).rg;
    vec3 specular = (specularColor * ((F * vec3((brdf).x)) + vec3((brdf).y)));
    vec3 ambient = (vec3((diffuse + specular)) * vec3(ao, ao, ao));
    vec3 color = (Lo + (ambient * vec3(0.2)));
    (color = (color / (color + vec3(1.0, 1.0, 1.0))));
    float gammaCorr = (1.0 / 2.20000004);
    ((color).r = pow((color).r,float(gammaCorr)));
    ((color).g = pow((color).g,float(gammaCorr)));
    ((color).b = pow((color).b,float(gammaCorr)));
    return vec4((color).r, (color).g, (color).b, 1.0);
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.uv = fragInput_TEXCOORD0;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
