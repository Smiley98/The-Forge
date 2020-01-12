#include <metal_stdlib>
using namespace metal;

struct Vertex_Shader
{
    const array<float2, 3> positions = { {float2((float)(-1.0), (float)1.0), float2((float)(-1.0), (float)(-3.0)), float2((float)3.0, (float)1.0)} };
    float4 main(uint index)
    {
        return float4(positions[index], (float)0.0, (float)1.0);
    };

    Vertex_Shader()
    {}
};

vertex float4 stageMain(
    uint index [[vertex_id]])
{
    uint index0;
    index0 = index;
    Vertex_Shader main;
    return main.main(index0);
}
