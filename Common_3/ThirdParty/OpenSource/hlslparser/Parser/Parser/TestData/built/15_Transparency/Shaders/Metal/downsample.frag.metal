#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct VSOutput
    {
        float4 Position;
        float4 UV;
    };
    texture2d<float> Source;
    float4 main(VSOutput input)
    {
        float4 total = float4(0.0);
        for (int x = 0; (x < 4); (++x))
        {
            for (int y = 0; (y < 4); (++y))
            {
                (total += float4(Source.read(uint2(int3(uint3((uint2)((((input).Position).xy * float2(4)) + float2(uint2((uint)x, (uint)y))), (uint)0)).xy), int3(uint3((uint2)((((input).Position).xy * float2(4)) + float2(uint2((uint)x, (uint)y))), (uint)0)).z)));
            }
        }
        return (total / float4(16.0));
    };

    Fragment_Shader(texture2d<float> Source) :
        Source(Source)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 TEXCOORD0;
};

struct main_output { float4 tmp [[color(0)]]; };

struct ArgBuffer0
{
    texture2d<float> Source [[id(0)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.UV = inputData.TEXCOORD0;
    Fragment_Shader main(argBuffer0.Source);
    main_output output; output.tmp = main.main(input0);
    return output;
}
