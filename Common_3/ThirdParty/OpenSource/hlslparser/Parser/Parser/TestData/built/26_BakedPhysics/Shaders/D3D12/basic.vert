cbuffer uniformBlock : register(b0, space3)
{
    float4x4 mvp;
    float4 color[815];
    float4 lightPosition;
    float4 lightColor;
    float4x4 toWorld[815];
};

struct VSInput
{
    float4 Position : POSITION;
    float4 Normal : NORMAL;
};
struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 Color : COLOR;
};
VSOutput main(VSInput input, uint InstanceID : SV_InstanceID)
{
    VSOutput result;
    float scaleFactor = 0.065;
    float4x4 scaleMat = {{scaleFactor, 0.0, 0.0, 0.0}, {0.0, scaleFactor, 0.0, 0.0}, {0.0, 0.0, scaleFactor, 0.0}, {0.0, 0.0, 0.0, 1.0}};
    float4x4 tempMat = mul(mvp, mul(toWorld[InstanceID], scaleMat));
    (result.Position = mul(tempMat, input.Position));
    float4 normal = normalize(mul(toWorld[InstanceID], float4(input.Normal.xyz, 0.0)));
    float4 pos = mul(toWorld[InstanceID], float4(input.Position.xyz, 1.0));
    float lightIntensity = 1.0;
    float quadraticCoeff = (float )(1.20000004);
    float ambientCoeff = (float )(0.4);
    float3 lightDir = normalize((lightPosition.xyz - pos.xyz));
    float distance = length(lightDir);
    float attenuation = ((float )(1.0) / ((quadraticCoeff * distance) * distance));
    float intensity = (lightIntensity * attenuation);
    float3 baseColor = color[InstanceID].xyz;
    float3 blendedColor = mul((lightColor.xyz * baseColor), lightIntensity);
    float3 diffuse = mul(blendedColor, max(dot(normal.xyz, lightDir), (const float )(0.0)));
    float3 ambient = mul(baseColor, ambientCoeff);
    (result.Color = float4((diffuse + ambient), 1.0));
    return result;
};

