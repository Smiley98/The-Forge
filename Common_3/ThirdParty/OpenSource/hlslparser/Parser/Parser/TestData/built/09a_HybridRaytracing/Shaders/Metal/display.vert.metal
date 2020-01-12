#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    struct PsIn
    {
        float2 texCoord;
        float4 position;
    };
    PsIn main(uint VertexID)
    {
        PsIn Out;
        float4 position;
        ((position).x = float((((VertexID == uint(2)))?(3.0):((-1.0)))));
        ((position).y = float((((VertexID == uint(0)))?((-3.0)):(1.0))));
        ((position).zw = float2(1.0));
        ((Out).position = position);
        ((Out).texCoord = (((position).xy * float2((float)0.5, (float)(-0.5))) + float2(0.5)));
        return Out;
    };

    Vertex_Shader()
    {}
};
struct main_output
{
    float2 TEXCOORD;
    float4 SV_Position [[position]];
};

vertex main_output stageMain(
    uint VertexID [[vertex_id]])
{
    uint VertexID0;
    VertexID0 = VertexID;
    Vertex_Shader main;
    Vertex_Shader::PsIn result = main.main(VertexID0);
    main_output output;
    output.TEXCOORD = result.texCoord;
    output.SV_Position = result.position;
    return output;
}
