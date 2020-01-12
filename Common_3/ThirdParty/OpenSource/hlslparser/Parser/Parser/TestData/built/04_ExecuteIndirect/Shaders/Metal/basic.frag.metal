#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct InstanceData
    {
        float4x4 mvp;
        float4x4 normalMat;
        float4 surfaceColor;
        float4 deepColor;
        int textureID;
        array<uint, 3> _pad0;
    };
    struct VsIn
    {
        float4 position;
        float4 normal;
    };
    struct PsIn
    {
        float4 position;
        float3 posModel;
        float3 normal;
        float4 albedo;
    };
    texture2d_array<float> uTex0;
    sampler uSampler0;
    const float3 lightDir = (-normalize(float3((float)2, (float)6, (float)1)));
    float4 main(PsIn In)
    {
        float wrap_diffuse = saturate(dot(lightDir, normalize((In).normal)));
        float light = ((2.0 * wrap_diffuse) + 0.060000000);
        float3 uvw = (((In).posModel * float3(0.5)) + float3(0.5));
        float3 blendWeights = abs(normalize((In).posModel));
        (blendWeights = saturate(((blendWeights - float3(0.2)) * float3(7))));
        (blendWeights /= float3((((blendWeights).x + (blendWeights).y) + (blendWeights).z)));
        float3 coord1 = float3((uvw).yz, ((((In).albedo).w * float(3)) + float(0)));
        float3 coord2 = float3((uvw).zx, ((((In).albedo).w * float(3)) + float(1)));
        float3 coord3 = float3((uvw).xy, ((((In).albedo).w * float(3)) + float(2)));
        float3 texColor = float3((float)0, (float)0, (float)0);
        (texColor += (float3(blendWeights.x) * (uTex0.sample(uSampler0, coord1.xy, coord1.z)).xyz));
        (texColor += (float3(blendWeights.y) * (uTex0.sample(uSampler0, coord2.xy, coord2.z)).xyz));
        (texColor += (float3(blendWeights.z) * (uTex0.sample(uSampler0, coord3.xy, coord3.z)).xyz));
        float coverage = saturate((((In).position).z * 4000.0));
        float3 color = ((In).albedo).xyz;
        (color *= float3(light));
        (color *= (texColor * float3(2)));
        (color *= float3(coverage));
        return float4(color, (float)1);
    };

    Fragment_Shader(texture2d_array<float> uTex0, sampler uSampler0) :
        uTex0(uTex0), uSampler0(uSampler0)
    {}
};

struct main_input
{
    float4 SV_Position [[position]];
    float3 PosModel;
    float3 Normal;
    float4 Color;
};

struct ArgBuffer0
{
    texture2d_array<float> uTex0 [[id(1)]];
    sampler uSampler0 [[id(2)]];
};

fragment float4 stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::PsIn In0;
    In0.position = inputData.SV_Position;
    In0.posModel = inputData.PosModel;
    In0.normal = inputData.Normal;
    In0.albedo = inputData.Color;
    Fragment_Shader main(argBuffer0.uTex0, argBuffer0.uSampler0);
    return main.main(In0);
}
