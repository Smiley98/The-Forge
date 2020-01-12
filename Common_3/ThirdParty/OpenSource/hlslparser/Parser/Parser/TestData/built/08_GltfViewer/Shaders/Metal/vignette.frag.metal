#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    texture2d<float> sceneTexture;
    sampler clampMiplessLinearSampler;
    struct Uniforms_cbPerFrame
    {
        float4x4 worldMat;
        float4x4 projViewMat;
        float4 screenSize;
    };
    constant Uniforms_cbPerFrame& cbPerFrame;
    struct VSOutput
    {
        float4 Position;
        float2 TexCoord;
    };
    float4 main(VSOutput input)
    {
        float4 src = sceneTexture.sample(clampMiplessLinearSampler, (input).TexCoord);
        if (cbPerFrame.screenSize.a > float(0.5))
        {
            float2 uv = (input).TexCoord;
            float2 coord = (((uv - float2(0.5)) * float2(cbPerFrame.screenSize.x / (cbPerFrame.screenSize).y)) * float2(2.0));
            float rf = (sqrt(dot(coord, coord)) * float(0.2));
            float rf2_1 = ((rf * rf) + float(1.0));
            float e = (float(1.0) / (rf2_1 * rf2_1));
            return float4(((src).rgb * float3(e)), 1.0);
        }
        else
        {
            return float4((src).rgb, 1.0);
        }
    };

    Fragment_Shader(texture2d<float> sceneTexture, sampler clampMiplessLinearSampler, constant Uniforms_cbPerFrame& cbPerFrame) :
        sceneTexture(sceneTexture), clampMiplessLinearSampler(clampMiplessLinearSampler), cbPerFrame(cbPerFrame)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float2 TEXCOORD;
};

struct ArgBuffer0
{
    texture2d<float> sceneTexture [[id(6)]];
    sampler clampMiplessLinearSampler [[id(7)]];
};

struct ArgBuffer1
{
    constant Fragment_Shader::Uniforms_cbPerFrame& cbPerFrame [[id(3)]];
};

fragment float4 stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.TexCoord = inputData.TEXCOORD;
    Fragment_Shader main(argBuffer0.sceneTexture, argBuffer0.clampMiplessLinearSampler, argBuffer1.cbPerFrame);
    return main.main(input0);
}
