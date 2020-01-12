cbuffer uniformBlock : register(b0, space1)
{
    float4x4 mvp;
    float4x4 toWorld[20];
    float4 color[20];
    float3 lightPosition;
    float3 lightColor;
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
    float4x4 tempMat = mul(mvp, toWorld[InstanceID]);
    (result.Position = mul(tempMat, input.Position));
    float4 normal = normalize(mul(toWorld[InstanceID], float4(input.Normal.xyz, 0.0)));
    float4 pos = mul(toWorld[InstanceID], float4(input.Position.xyz, 1.0));
    float lightIntensity = 1.0;
    float quadraticCoeff = (float )(1.20000004);
    float ambientCoeff = (float )(0.4);
    float3 lightDir;
    if (color[InstanceID].w == (float )(0))
    {
        (lightDir = float3(0.0, 1.0, 0.0));
    }
    else
    {
        (lightDir = normalize((lightPosition - pos.xyz)));
    }
    float distance = length(lightDir);
    float attenuation = ((float )(1.0) / ((quadraticCoeff * distance) * distance));
    float intensity = (lightIntensity * attenuation);
    float3 baseColor = color[InstanceID].xyz;
    float3 blendedColor = mul((lightColor * baseColor), lightIntensity);
    float3 diffuse = mul(blendedColor, max(dot(normal.xyz, lightDir), (const float )(0.0)));
    float3 ambient = mul(baseColor, ambientCoeff);
    (result.Color = float4((diffuse + ambient), 1.0));
    return result;
};

