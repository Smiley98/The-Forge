#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct VsIn
    {
        float3 position;
        float3 normal;
        float2 texCoord;
    };
    struct Uniforms_cbCamera
    {
        float4x4 projView;
        float3 camPos;
    };
    constant Uniforms_cbCamera& cbCamera;
    struct Uniforms_cbObject
    {
        float4x4 worldMat;
        float roughness;
        float metalness;
        int pbrMaterials;
    };
    constant Uniforms_cbObject& cbObject;
    struct PsIn
    {
        float4 position;
        float3 normal;
        float3 pos;
        float2 texCoord;
    };
    PsIn main(VsIn In)
    {
        PsIn Out;
        ((Out).position = ((cbCamera.projView)*(((cbObject.worldMat)*(float4(((In).position).xyz, 1.0))))));
        ((Out).normal = normalize((((cbObject.worldMat)*(float4((In).normal, 0.0)))).rgb));
        ((Out).pos = (((cbObject.worldMat)*(float4(((In).position).xyz, 1.0)))).rgb);
        ((Out).texCoord = (In).texCoord);
        return Out;
    };

    Vertex_Shader(constant Uniforms_cbCamera& cbCamera, constant Uniforms_cbObject& cbObject) :
        cbCamera(cbCamera), cbObject(cbObject)
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
    float4 SV_Position [[position]];
    float3 TEXCOORD0;
    float3 TEXCOORD1;
    float2 TEXCOORD2;
};
struct ArgBuffer1
{
    constant Vertex_Shader::Uniforms_cbCamera& cbCamera [[id(0)]];
};

struct ArgBuffer3
{
    constant Vertex_Shader::Uniforms_cbObject& cbObject [[id(1)]];
};

vertex main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]],
    constant ArgBuffer3& argBuffer3 [[buffer(3)]])
{
    Vertex_Shader::VsIn In0;
    In0.position = inputData.POSITION;
    In0.normal = inputData.NORMAL;
    In0.texCoord = inputData.TEXCOORD;
    Vertex_Shader main(argBuffer1.cbCamera, argBuffer3.cbObject);
    Vertex_Shader::PsIn result = main.main(In0);
    main_output output;
    output.SV_Position = result.position;
    output.TEXCOORD0 = result.normal;
    output.TEXCOORD1 = result.pos;
    output.TEXCOORD2 = result.texCoord;
    return output;
}
