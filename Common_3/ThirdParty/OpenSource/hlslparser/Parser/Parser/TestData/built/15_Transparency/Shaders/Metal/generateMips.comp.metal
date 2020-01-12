#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

struct Compute_Shader
{
    texture2d<float, access::read_write> Source;
    texture2d<float, access::read_write> Destination;
    struct Uniforms_RootConstant
    {
        uint2 MipSize;
    };
    constant Uniforms_RootConstant& RootConstant;
    void main(uint3 id)
    {
        if (id.x < (RootConstant.MipSize).x && ((id).y < (RootConstant.MipSize).y))
        {
            float3 color = float3(0.0);
            for (int x = 0; (x < 2); (++x))
            {
                for (int y = 0; (y < 2); (++y))
                {
                    (color += Source.read(((((id).xy * uint2(2)) + uint2((uint)x, (uint)y))).xy));
                }
            }
            (Destination.write((color * float3(0.25)), uint2((id).xy)));
        }
    };

    Compute_Shader(texture2d<float, access::read_write> Source, texture2d<float, access::read_write> Destination, constant Uniforms_RootConstant& RootConstant) :
        Source(Source), Destination(Destination), RootConstant(RootConstant)
    {}
};
struct ArgBuffer3
{
    texture2d<float, access::read_write> Source [[id(0)]];
    texture2d<float, access::read_write> Destination [[id(1)]];
};
//[numthreads(16, 16, 1)]
kernel void stageMain(
    uint3 id [[thread_position_in_grid]],
    constant ArgBuffer3& argBuffer3 [[buffer(3)]],
    constant Compute_Shader::Uniforms_RootConstant& RootConstant)
{
    uint3 id0;
    id0 = id;
    Compute_Shader main(argBuffer3.Source, argBuffer3.Destination, RootConstant);
    return main.main(id0);
}
