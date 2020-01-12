#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct Uniforms_SceneConstantBuffer
    {
        float4x4 orthProjMatrix;
        float2 mousePosition;
        float2 resolution;
        float time;
        uint renderMode;
        uint laneSize;
        uint padding;
    };
    constant Uniforms_SceneConstantBuffer& SceneConstantBuffer;
    struct PSInput
    {
        float4 position;
        float2 uv;
    };
    texture2d<float> g_texture;
    sampler g_sampler;
    float4 main(PSInput input)
    {
        float aspectRatio = ((SceneConstantBuffer.resolution).x / (SceneConstantBuffer.resolution).y);
        float magnifiedFactor = 6.0;
        float magnifiedAreaSize = 0.05;
        float magnifiedAreaBorder = 0.0050000000;
        float2 normalizedPixelPos = (input).uv;
        float2 normalizedMousePos = (SceneConstantBuffer.mousePosition / SceneConstantBuffer.resolution);
        float2 diff = abs((normalizedPixelPos - normalizedMousePos));
        float4 color = g_texture.sample(g_sampler, normalizedPixelPos);
        if (diff.x < (magnifiedAreaSize + magnifiedAreaBorder) && ((diff).y < ((magnifiedAreaSize + magnifiedAreaBorder) * aspectRatio)))
        {
            (color = float4(0.0, 1.0, 1.0, 1.0));
        }
        if (diff.x < magnifiedAreaSize && ((diff).y < (magnifiedAreaSize * aspectRatio)))
        {
            (color = g_texture.sample(g_sampler, (normalizedMousePos + ((normalizedPixelPos - normalizedMousePos) / float2(magnifiedFactor)))));
        }
        return color;
    };

    Fragment_Shader(constant Uniforms_SceneConstantBuffer& SceneConstantBuffer, texture2d<float> g_texture, sampler g_sampler) :
        SceneConstantBuffer(SceneConstantBuffer), g_texture(g_texture), g_sampler(g_sampler)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float2 TEXCOORD;
};

struct ArgBuffer0
{
    texture2d<float> g_texture [[id(1)]];
    sampler g_sampler [[id(2)]];
};

struct ArgBuffer1
{
    constant Fragment_Shader::Uniforms_SceneConstantBuffer& SceneConstantBuffer [[id(0)]];
};

fragment float4 stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Fragment_Shader::PSInput input0;
    input0.position = inputData.SV_POSITION;
    input0.uv = inputData.TEXCOORD;
    Fragment_Shader main(argBuffer1.SceneConstantBuffer, argBuffer0.g_texture, argBuffer0.g_sampler);
    return main.main(input0);
}
