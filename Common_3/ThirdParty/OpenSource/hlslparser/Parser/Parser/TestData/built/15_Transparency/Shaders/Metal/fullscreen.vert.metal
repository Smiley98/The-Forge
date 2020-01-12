#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct VSOutput
    {
        float4 Position;
        float4 UV;
    };
    VSOutput main(uint VertexID)
    {
        VSOutput output;
        ((output).UV = float4((float)((VertexID << uint(1)) & uint(2)), (float)(VertexID & uint(2)), (float)0, (float)0));
        ((output).Position = float4(((((output).UV).xy * float2((float)2, (float)(-2))) + float2((float)(-1), (float)1)), (float)0, (float)1));
        return output;
    };

    Vertex_Shader()
    {}
};
struct main_output
{
    float4 SV_POSITION [[position]];
    float4 TEXCOORD0;
};

vertex main_output stageMain(
    uint VertexID [[vertex_id]])
{
    uint VertexID0;
    VertexID0 = VertexID;
    Vertex_Shader main;
    Vertex_Shader::VSOutput result = main.main(VertexID0);
    main_output output;
    output.SV_POSITION = result.Position;
    output.TEXCOORD0 = result.UV;
    return output;
}
