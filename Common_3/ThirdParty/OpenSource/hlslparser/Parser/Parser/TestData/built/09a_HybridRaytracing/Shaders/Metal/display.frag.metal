#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct PsIn
    {
        float2 texCoord;
        float4 position;
    };
    texture2d<float> inputRT;
    float3 ACESFilm(float3 x)
    {
        float a = 2.51;
        float b = 0.030000000;
        float c = 2.43000008;
        float d = 0.58999996;
        float e = 0.14;
        return saturate(((x * ((float3(a) * x) + float3(b))) / ((x * ((float3(c) * x) + float3(d))) + float3(e))));
    };
    float3 main(PsIn In)
    {
        float3 colour = (inputRT.read((((In).position).xy).xy)).xyz;
        float exposure = float(0.7);
        (colour *= float3(exposure));
        (colour = ACESFilm(colour));
        (colour = pow(abs(colour), float3(half(1) / 2.20000004)));
        return colour;
    };

    Fragment_Shader(texture2d<float> inputRT) :
        inputRT(inputRT)
    {}
};

struct main_input
{
    float2 TEXCOORD;
    float4 SV_Position [[position]];
};

struct main_output { float3 tmp [[color(0)]]; };

struct ArgBuffer0
{
    texture2d<float> inputRT [[id(0)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::PsIn In0;
    In0.texCoord = inputData.TEXCOORD;
    In0.position = inputData.SV_Position;
    Fragment_Shader main(argBuffer0.inputRT);
    main_output output; output.tmp = main.main(In0);
    return output;
}
