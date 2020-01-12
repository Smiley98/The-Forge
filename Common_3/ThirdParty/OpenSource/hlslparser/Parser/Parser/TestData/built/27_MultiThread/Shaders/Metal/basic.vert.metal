#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct Uniforms_uniformBlock
    {
        float4x4 mvp;
        array<float4, 815> color;
        float4 lightPosition;
        float4 lightColor;
        array<float4x4, 815> toWorld;
    };
    constant Uniforms_uniformBlock& uniformBlock;
    struct VSInput
    {
        float4 Position;
        float4 Normal;
    };
    struct VSOutput
    {
        float4 Position;
        float4 Color;
    };
    VSOutput main(VSInput input, uint InstanceID)
    {
        VSOutput result;
        float4x4 tempMat = ((uniformBlock.mvp)*(uniformBlock.toWorld[InstanceID]));
        ((result).Position = ((tempMat)*((input).Position)));
        float4 normal = normalize(((uniformBlock.toWorld[InstanceID])*(float4(((input).Normal).xyz, 0.0))));
        float4 pos = ((uniformBlock.toWorld[InstanceID])*(float4(((input).Position).xyz, 1.0)));
        float lightIntensity = 1.0;
        float quadraticCoeff = float(1.20000004);
        float ambientCoeff = float(0.4);
        float3 lightDir = normalize(((uniformBlock.lightPosition).xyz - (pos).xyz));
        float distance = length(lightDir);
        float attenuation = (float(1.0) / ((quadraticCoeff * distance) * distance));
        float intensity = (lightIntensity * attenuation);
        float3 baseColor = (uniformBlock.color[InstanceID]).xyz;
        float3 blendedColor = ((((uniformBlock.lightColor).xyz * baseColor))*(lightIntensity));
        float3 diffuse = ((blendedColor)*(max((float)dot((normal).xyz, lightDir),(float)float(0.0))));
        float3 ambient = ((baseColor)*(ambientCoeff));
        ((result).Color = float4((diffuse + ambient), (float)1.0));
        return result;
    };

    Vertex_Shader(constant Uniforms_uniformBlock& uniformBlock) :
        uniformBlock(uniformBlock)
    {}
};

struct main_input
{
    float4 POSITION [[attribute(0)]];
    float4 NORMAL [[attribute(1)]];
};

struct main_output
{
    float4 SV_POSITION [[position]];
    float4 COLOR;
};
struct ArgBuffer3
{
    constant Vertex_Shader::Uniforms_uniformBlock& uniformBlock [[id(0)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    uint InstanceID [[instance_id]],
    constant ArgBuffer3& argBuffer3 [[buffer(3)]])
{
    uint InstanceID0;
    InstanceID0 = InstanceID;
    Vertex_Shader::VSInput input0;
    input0.Position = inputData.POSITION;
    input0.Normal = inputData.NORMAL;
    Vertex_Shader main(argBuffer3.uniformBlock);
    Vertex_Shader::VSOutput result = main.main(input0, InstanceID0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.COLOR = result.Color;
    return output;
}
