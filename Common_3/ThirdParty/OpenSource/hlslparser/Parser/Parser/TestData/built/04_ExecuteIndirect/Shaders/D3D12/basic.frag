struct InstanceData
{
    float4x4 mvp;
    float4x4 normalMat;
    float4 surfaceColor;
    float4 deepColor;
    int textureID;
    uint _pad0[3];
};
struct VsIn
{
    float4 position : Position;
    float4 normal : Normal;
};
struct PsIn
{
    float4 position : SV_Position;
    float3 posModel : PosModel;
    float3 normal : Normal;
    float4 albedo : Color;
};
Texture2DArray<float4> uTex0 : register(t1);
SamplerState uSampler0 : register(s2);
const static float3 lightDir = -normalize(float3(2, 6, 1));
float4 main(PsIn In) : SV_TARGET
{
    float wrap_diffuse = saturate(dot(lightDir, normalize(In.normal)));
    float light = ((2.0 * wrap_diffuse) + 0.060000000);
    float3 uvw = ((In.posModel * (float3 )(0.5)) + (float3 )(0.5));
    float3 blendWeights = abs(normalize(In.posModel));
    (blendWeights = saturate(((blendWeights - (float3 )(0.2)) * (float3 )(7))));
    (blendWeights /= ((blendWeights.x + blendWeights.y) + blendWeights.z).xxx);
    float3 coord1 = float3(uvw.yz, ((In.albedo.w * (float )(3)) + (float )(0)));
    float3 coord2 = float3(uvw.zx, ((In.albedo.w * (float )(3)) + (float )(1)));
    float3 coord3 = float3(uvw.xy, ((In.albedo.w * (float )(3)) + (float )(2)));
    float3 texColor = float3(0, 0, 0);
    (texColor += ((float3 )(blendWeights.x) * uTex0.Sample(uSampler0, coord1).xyz));
    (texColor += ((float3 )(blendWeights.y) * uTex0.Sample(uSampler0, coord2).xyz));
    (texColor += ((float3 )(blendWeights.z) * uTex0.Sample(uSampler0, coord3).xyz));
    float coverage = saturate((In.position.z * 4000.0));
    float3 color = In.albedo.xyz;
    (color *= (float3 )(light));
    (color *= (texColor * (float3 )(2)));
    (color *= (float3 )(coverage));
    return float4(color, 1);
};

