#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct Material
    {
        float4 Color;
        float4 Transmission;
        float RefractionRatio;
        float Collimation;
        float2 Padding;
        uint TextureFlags;
        uint AlbedoTexID;
        uint MetallicTexID;
        uint RoughnessTexID;
        uint EmissiveTexID;
        uint3 Padding2;
    };
    struct ObjectInfo
    {
        float4x4 toWorld;
        float4x4 normalMat;
        uint matID;
    };
    float2 ComputeMoments(float depth)
    {
        float2 moments;
        ((moments).x = depth);
        float2 pd = float2(dfdx(depth), dfdy(depth));
        ((moments).y = ((depth * depth) + (0.25 * dot(pd, pd))));
        return moments;
    };
    struct VSOutput
    {
        float4 Position;
    };
    float2 main(VSOutput input)
    {
        return ComputeMoments(((input).Position).z);
    };

    Fragment_Shader()
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
};

struct main_output { float2 tmp [[color(0)]]; };


fragment main_output stageMain(
	main_input inputData [[stage_in]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    Fragment_Shader main;
    main_output output; output.tmp = main.main(input0);
    return output;
}
