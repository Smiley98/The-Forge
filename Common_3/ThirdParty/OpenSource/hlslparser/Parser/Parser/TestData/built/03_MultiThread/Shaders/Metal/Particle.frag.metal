#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct Uniforms_particleRootConstant
    {
        float paletteFactor;
        uint data;
        uint textureIndex;
    };
    constant Uniforms_particleRootConstant& particleRootConstant;
    struct VSOutput
    {
        float4 Position;
        float TexCoord;
    };
    sampler uSampler0;
    array<texture1d<float>, 5> uTex0;
    float4 main(VSOutput input)
    {
        float4 ca = uTex0[particleRootConstant.textureIndex].sample(uSampler0, (input).TexCoord);
        float4 cb = uTex0[((particleRootConstant.textureIndex + uint(1)) % uint(5))].sample(uSampler0, (input).TexCoord);
        return (float4(0.05) * mix(ca, cb, float4(particleRootConstant.paletteFactor)));
    };

    Fragment_Shader(constant Uniforms_particleRootConstant& particleRootConstant, sampler uSampler0, array<texture1d<float>, 5> uTex0) :
        particleRootConstant(particleRootConstant), uSampler0(uSampler0), uTex0(uTex0)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float TEXCOORD;
};

struct ArgBuffer0
{
    sampler uSampler0 [[id(3)]];
    array<texture1d<float>, 5> uTex0 [[id(11)]];
};

fragment float4 stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant Fragment_Shader::Uniforms_particleRootConstant& particleRootConstant)
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.TexCoord = inputData.TEXCOORD;
    Fragment_Shader main(particleRootConstant, argBuffer0.uSampler0, argBuffer0.uTex0);
    return main.main(input0);
}
