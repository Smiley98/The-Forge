const static float NUM_SHADOW_SAMPLES_INV = (const static float )(0.03125);
const static float shadowSamples[64] = {-0.17466460, -0.79131840, -0.129792, -0.44771160, 0.08863912, -0.8981690, -0.58914988, -0.678163, 0.17484090, -0.5252063, 0.6483325, -0.752117, 0.45293192, -0.384986, 0.09757467, -0.1166954, 0.3857658, -0.9096935, 0.56130584, -0.1283066, 0.768011, -0.4906538, 0.8499438, -0.220937, 0.6946555, 0.16058660, 0.9614297, 0.0597522, 0.7986544, 0.53259124, 0.45139648, 0.5592551, 0.2847693, 0.2293397, -0.2118996, -0.1609127, -0.4357893, -0.3808875, -0.4662672, -0.05288446, -0.139129, 0.23940650, 0.1781853, 0.5254948, 0.4287854, 0.899425, 0.12893490, 0.8724155, -0.6924323, -0.2203967, -0.48997, 0.2795907, -0.26117242, 0.7359962, -0.7704172, 0.42331340, -0.8501040, 0.12639350, -0.83452672, -0.499136, -0.5380967, 0.6264234, -0.9769312, -0.15505689};
cbuffer ShadowUniformBuffer : register(b2, space1)
{
    float4x4 LightViewProj;
};

Texture2D<float4> ShadowTexture : register(t14);
SamplerState clampMiplessLinearSampler : register(s7);
struct VSOutput
{
    float4 Position : SV_POSITION;
    float3 WorldPos : POSITION;
    float2 TexCoord : TEXCOORD;
};
float CalcESMShadowFactor(float3 worldPos)
{
    float4 posLS = mul(LightViewProj, float4(worldPos.xyz, 1.0));
    (posLS /= (float4 )(posLS.w));
    (posLS.y *= (float )(-1));
    (posLS.xy = ((posLS.xy * (float2 )(0.5)) + float2(0.5, 0.5)));
    float2 HalfGaps = float2(0.00048828124, 0.00048828124);
    float2 Gaps = float2(0.0009765625, 0.0009765625);
    (posLS.xy += HalfGaps);
    float shadowFactor = (float )(1.0);
    float4 shadowDepthSample = float4(0, 0, 0, 0);
    (shadowDepthSample.x = ShadowTexture.SampleLevel(clampMiplessLinearSampler, posLS.xy, (const float )(0)).r);
    (shadowDepthSample.y = ShadowTexture.SampleLevel(clampMiplessLinearSampler, posLS.xy, (const float )(0), int2(1, 0)).r);
    (shadowDepthSample.z = ShadowTexture.SampleLevel(clampMiplessLinearSampler, posLS.xy, (const float )(0), int2(0, 1)).r);
    (shadowDepthSample.w = ShadowTexture.SampleLevel(clampMiplessLinearSampler, posLS.xy, (const float )(0), int2(1, 1)).r);
    float avgShadowDepthSample = ((((shadowDepthSample.x + shadowDepthSample.y) + shadowDepthSample.z) + shadowDepthSample.w) * 0.25);
    (shadowFactor = saturate(((float )(2.0) - exp(((posLS.z - avgShadowDepthSample) * 1.0)))));
    return shadowFactor;
};

float random(float3 seed, float3 freq)
{
    float dt = dot(floor((seed * freq)), float3(53.12149811, 21.1352005, 9.13220024));
    return frac((sin(dt) * (float )(2105.23535156)));
};

float CalcPCFShadowFactor(float3 worldPos)
{
    float4 posLS = mul(LightViewProj, float4(worldPos.xyz, 1.0));
    (posLS /= (float4 )(posLS.w));
    (posLS.y *= (float )(-1));
    (posLS.xy = ((posLS.xy * (float2 )(0.5)) + float2(0.5, 0.5)));
    float2 HalfGaps = float2(0.00048828124, 0.00048828124);
    float2 Gaps = float2(0.0009765625, 0.0009765625);
    (posLS.xy += HalfGaps);
    float shadowFactor = (float )(1.0);
    float shadowFilterSize = (float )(0.0016000000);
    float angle = random(worldPos, (float3 )(20.0));
    float s = sin(angle);
    float c = cos(angle);
    for (int i = 0; (i < 32); i++)
    {
        float2 offset = float2(shadowSamples[(i * 2)], shadowSamples[((i * 2) + 1)]);
        (offset = float2(((offset.x * c) + (offset.y * s)), ((offset.x * -s) + (offset.y * c))));
        (offset *= (float2 )(shadowFilterSize));
        float shadowMapValue = (float )(ShadowTexture.SampleLevel(clampMiplessLinearSampler, (posLS.xy + offset), (const float )(0)));
        (shadowFactor += ((((shadowMapValue - 0.0020000000) > posLS.z))?(0.0):(1.0)));
    }
    (shadowFactor *= NUM_SHADOW_SAMPLES_INV);
    return shadowFactor;
};

float ClaculateShadow(float3 worldPos)
{
    float4 NDC = mul(LightViewProj, float4(worldPos, 1.0));
    (NDC /= (float4 )(NDC.w));
    float Depth = NDC.z;
    float2 ShadowCoord = float2(((NDC.x + (float )(1.0)) * (float )(0.5)), (((float )(1.0) - NDC.y) * (float )(0.5)));
    float ShadowDepth = ShadowTexture.Sample(clampMiplessLinearSampler, ShadowCoord).r;
    if (ShadowDepth - 0.0020000000 > Depth)
    {
        return 0.1;
    }
    else
    {
        return 1.0;
    }
};

float4 main(VSOutput input) : SV_TARGET
{
    float3 color = float3(1.0, 1.0, 1.0);
    (color *= (float3 )(CalcPCFShadowFactor(input.WorldPos)));
    float i = ((float )(1.0) - length(abs(input.TexCoord.xy)));
    (i = pow(i, 1.20000004));
    return float4(color.rgb, i);
};

