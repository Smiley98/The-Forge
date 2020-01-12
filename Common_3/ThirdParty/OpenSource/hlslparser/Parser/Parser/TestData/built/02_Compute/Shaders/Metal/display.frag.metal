#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct PsIn
    {
        float4 position;
        float2 texCoord;
    };
    texture2d<float> uTex0;
    sampler uSampler0;
    float4 main(PsIn In)
    {
        return uTex0.sample(uSampler0, (In).texCoord);
    };

    Fragment_Shader(texture2d<float> uTex0, sampler uSampler0) :
        uTex0(uTex0), uSampler0(uSampler0)
    {}
};

struct main_input
{
    float4 SV_Position [[position]];
    float2 TEXCOORD;
};

struct main_output { float4 tmp [[color(0)]]; };

struct ArgBuffer0
{
    texture2d<float> uTex0 [[id(0)]];
    sampler uSampler0 [[id(1)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::PsIn In0;
    In0.position = inputData.SV_Position;
    In0.texCoord = inputData.TEXCOORD;
    Fragment_Shader main(argBuffer0.uTex0, argBuffer0.uSampler0);
    main_output output; output.tmp = main.main(In0);
    return output;
}
