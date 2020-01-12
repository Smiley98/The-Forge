#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
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
    constant InstanceData* instanceBuffer;
    struct Uniforms_rootConstant
    {
        uint index;
    };
    constant Uniforms_rootConstant& rootConstant;
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
    float linstep(float min, float max, float s)
    {
        return saturate(((s - min) / (max - min)));
    };
    PsIn main(VsIn In)
    {
        PsIn result;
        ((result).position = (((instanceBuffer[rootConstant.index]).mvp)*(float4(((In).position).xyz, (float)1))));
        ((result).posModel = ((In).position).xyz);
        ((result).normal = normalize(((((instanceBuffer[rootConstant.index]).normalMat)*(float4(((In).normal).xyz, (float)0)))).xyz));
        float depth = linstep(0.5, 0.7, length(((In).position).xyz));
        (((result).albedo).xyz = mix(((instanceBuffer[rootConstant.index]).deepColor).xyz, ((instanceBuffer[rootConstant.index]).surfaceColor).xyz, float3(depth)));
        (((result).albedo).w = float((float)(instanceBuffer[rootConstant.index]).textureID));
        return result;
    };

    Vertex_Shader(constant InstanceData* instanceBuffer, constant Uniforms_rootConstant& rootConstant) :
        instanceBuffer(instanceBuffer), rootConstant(rootConstant)
    {}
};

struct main_input
{
    float4 Position [[attribute(0)]];
    float4 Normal [[attribute(1)]];
};

struct main_output
{
    float4 SV_Position [[position]];
    float3 PosModel;
    float3 Normal;
    float4 Color;
};
struct ArgBuffer2
{
    constant Vertex_Shader::InstanceData* instanceBuffer [[id(0)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer2& argBuffer2 [[buffer(2)]],
    constant Vertex_Shader::Uniforms_rootConstant& rootConstant)
{
    Vertex_Shader::VsIn In0;
    In0.position = inputData.Position;
    In0.normal = inputData.Normal;
    Vertex_Shader main(argBuffer2.instanceBuffer, rootConstant);
    Vertex_Shader::PsIn result = main.main(In0);
    main_output output;
    output.SV_Position = result.position;
    output.PosModel = result.posModel;
    output.Normal = result.normal;
    output.Color = result.albedo;
    return output;
}
