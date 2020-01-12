#include <metal_stdlib>
using namespace metal;

inline float3x3 matrix_ctor(float4x4 m)
{
        return float3x3(m[0].xyz, m[1].xyz, m[2].xyz);
}
struct Vertex_Shader
{
    struct VsIn
    {
        float3 position;
        float3 normal;
        float2 texCoord;
    };
    struct Uniforms_cbPerPass
    {
        float4x4 projView;
    };
    constant Uniforms_cbPerPass& cbPerPass;
    struct Uniforms_cbPerProp
    {
        float4x4 world;
        float roughness;
        float metallic;
        int pbrMaterials;
        float pad;
    };
    constant Uniforms_cbPerProp& cbPerProp;
    struct PsIn
    {
        float3 normal;
        float3 pos;
        float2 texCoord;
        uint [[flat]] materialID;
        float4 position;
    };
    PsIn main(VsIn In)
    {
        PsIn Out;
        ((Out).position = ((cbPerPass.projView)*(((cbPerProp.world)*(float4(((In).position).xyz, 1.0))))));
        ((Out).normal = (((matrix_ctorcbPerProp.world)*(((In).normal).xyz))).xyz);
        ((Out).pos = (((cbPerProp.world)*(float4(((In).position).xyz, 1.0)))).xyz);
        ((Out).texCoord = ((In).texCoord).xy);
        return Out;
    };

    Vertex_Shader(constant Uniforms_cbPerPass& cbPerPass, constant Uniforms_cbPerProp& cbPerProp) :
        cbPerPass(cbPerPass), cbPerProp(cbPerProp)
    {}
};

struct main_input
{
    float3 POSITION [[attribute(0)]];
    float3 NORMAL [[attribute(1)]];
    float2 TEXCOORD [[attribute(2)]];
};

struct main_output
{
    float3 TEXCOORD0;
    float3 TEXCOORD1;
    float2 TEXCOORD2;
    uint TEXCOORD3;
    float4 SV_Position [[position]];
};
struct ArgBuffer0
{
    constant Vertex_Shader::Uniforms_cbPerProp& cbPerProp [[id(1)]];
};

struct ArgBuffer1
{
    constant Vertex_Shader::Uniforms_cbPerPass& cbPerPass [[id(0)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Vertex_Shader::VsIn In0;
    In0.position = inputData.POSITION;
    In0.normal = inputData.NORMAL;
    In0.texCoord = inputData.TEXCOORD;
    Vertex_Shader main(argBuffer1.cbPerPass, argBuffer0.cbPerProp);
    Vertex_Shader::PsIn result = main.main(In0);
    main_output output;
    output.TEXCOORD0 = result.normal;
    output.TEXCOORD1 = result.pos;
    output.TEXCOORD2 = result.texCoord;
    output.TEXCOORD3 = result.materialID;
    output.SV_Position = result.position;
    return output;
}
