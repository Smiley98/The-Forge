#include <metal_stdlib>
using namespace metal;

inline float3x3 matrix_ctor(float4x4 m)
{
        return float3x3(m[0].xyz, m[1].xyz, m[2].xyz);
}
struct Vertex_Shader
{
    struct Uniforms_rootConstant
    {
        uint drawID;
    };
    constant Uniforms_rootConstant& rootConstant;
    struct Uniforms_uniformBlock
    {
        float4x4 viewProj;
    };
    constant Uniforms_uniformBlock& uniformBlock;
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
    struct AsteroidDynamic
    {
        float4x4 transform;
        uint indexStart;
        uint indexEnd;
        array<uint, 2> padding;
    };
    struct AsteroidStatic
    {
        float4 rotationAxis;
        float4 surfaceColor;
        float4 deepColor;
        float scale;
        float orbitSpeed;
        float rotationSpeed;
        uint textureID;
        uint vertexStart;
        array<uint, 3> padding;
    };
    device AsteroidStatic* asteroidsStatic;
    device AsteroidDynamic* asteroidsDynamic;
    PsIn main(VsIn In)
    {
        PsIn result;
        AsteroidStatic asteroidStatic = asteroidsStatic[rootConstant.drawID];
        AsteroidDynamic asteroidDynamic = asteroidsDynamic[rootConstant.drawID];
        float4x4 worldMatrix = (asteroidDynamic).transform;
        ((result).position = ((uniformBlock.viewProj)*(((worldMatrix)*(float4(((In).position).xyz, 1.0))))));
        ((result).posModel = ((In).position).xyz);
        ((result).normal = ((matrix_ctorworldMatrix)*(((In).normal).xyz)));
        float depth = saturate(((length(((In).position).xyz) - 0.5) / float(0.2)));
        (((result).albedo).xyz = mix(((asteroidStatic).deepColor).xyz, ((asteroidStatic).surfaceColor).xyz, float3(depth)));
        (((result).albedo).w = float(asteroidStatic.textureID));
        return result;
    };

    Vertex_Shader(constant Uniforms_rootConstant& rootConstant, constant Uniforms_uniformBlock& uniformBlock, device AsteroidStatic* asteroidsStatic, device AsteroidDynamic* asteroidsDynamic) :
        rootConstant(rootConstant), uniformBlock(uniformBlock), asteroidsStatic(asteroidsStatic), asteroidsDynamic(asteroidsDynamic)
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
struct ArgBuffer0
{
    device Vertex_Shader::AsteroidStatic* asteroidsStatic [[id(1)]];
    device Vertex_Shader::AsteroidDynamic* asteroidsDynamic [[id(2)]];
};

struct ArgBuffer1
{
    constant Vertex_Shader::Uniforms_uniformBlock& uniformBlock [[id(5)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]],
    constant Vertex_Shader::Uniforms_rootConstant& rootConstant)
{
    Vertex_Shader::VsIn In0;
    In0.position = inputData.Position;
    In0.normal = inputData.Normal;
    Vertex_Shader main(rootConstant, argBuffer1.uniformBlock, argBuffer0.asteroidsStatic, argBuffer0.asteroidsDynamic);
    Vertex_Shader::PsIn result = main.main(In0);
    main_output output;
    output.SV_Position = result.position;
    output.PosModel = result.posModel;
    output.Normal = result.normal;
    output.Color = result.albedo;
    return output;
}
