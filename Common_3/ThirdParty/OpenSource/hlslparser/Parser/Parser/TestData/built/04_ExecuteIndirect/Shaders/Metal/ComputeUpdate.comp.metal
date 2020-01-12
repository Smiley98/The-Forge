#include <metal_stdlib>
#include <metal_compute>
using namespace metal;

struct Compute_Shader
{
    struct Uniforms_uniformBlock
    {
        float4x4 viewProj;
        float4 camPos;
        float dt;
        uint startIdx;
        uint endIdx;
        int numLODs;
        array<int, 10> indexOffsets;
    };
    constant Uniforms_uniformBlock& uniformBlock;
    struct AsteroidDynamic
    {
        float4x4 transform;
        uint indexStart;
        uint indexEnd;
        array<uint, 2> padding;
    };
    struct AsteroidStatic
    {
        float4 rotationAxis;
        float4 surfaceColor;
        float4 deepColor;
        float scale;
        float orbitSpeed;
        float rotationSpeed;
        uint textureID;
        uint vertexStart;
        array<uint, 3> padding;
    };
    struct IndirectDrawCommand
    {
        uint drawID;
        uint indexCount;
        uint instanceCount;
        uint startIndex;
        int vertexOffset;
        uint startInstance;
        array<uint, 2> padding;
    };
    device AsteroidStatic* asteroidsStatic;
    device AsteroidDynamic* asteroidsDynamic;
    device IndirectDrawCommand* drawCmds;
    float4x4 MakeRotationMatrix(float angle, float3 axis)
    {
        float s, c;
        s = sincos((-angle), c);
        float x, y, z;
        (x = (axis).x);
        (y = (axis).y);
        (z = (axis).z);
        float xy, yz, zx;
        (xy = ((axis).x * (axis).y));
        (yz = ((axis).y * (axis).z));
        (zx = ((axis).z * (axis).x));
        float oneMinusC = (float(1.0) - c);
        return float4x4((((x * x) * oneMinusC) + c), ((xy * oneMinusC) + (z * s)), ((zx * oneMinusC) - (y * s)), (float)0.0, ((xy * oneMinusC) - (z * s)), (((y * y) * oneMinusC) + c), ((yz * oneMinusC) + (x * s)), (float)0.0, ((zx * oneMinusC) + (y * s)), ((yz * oneMinusC) - (x * s)), (((z * z) * oneMinusC) + c), (float)0.0, (float)0.0, (float)0.0, (float)0.0, (float)1.0);
    };
    const float minSubdivSizeLog2 = float(log2(0.0019));
    void main(uint3 threadID)
    {
        uint asteroidIdx = ((threadID).x + uint(uniformBlock.startIdx));
        if (asteroidIdx >= uniformBlock.endIdx)
        {
            return;
        }
        AsteroidStatic asteroidStatic = asteroidsStatic[asteroidIdx];
        AsteroidDynamic asteroidDynamic = asteroidsDynamic[asteroidIdx];
        float4x4 orbit = MakeRotationMatrix(((asteroidStatic).orbitSpeed * uniformBlock.dt), float3((float)0.0, (float)1.0, (float)0.0));
        float4x4 rotate = MakeRotationMatrix(((asteroidStatic).rotationSpeed * uniformBlock.dt), ((asteroidStatic).rotationAxis).xyz);
        ((asteroidDynamic).transform = ((((orbit)*((asteroidDynamic).transform)))*(rotate)));
        float3 position = float3((asteroidDynamic).transform[0][3], (asteroidDynamic).transform[1][3], (asteroidDynamic).transform[2][3]);
        float distToEye = length((position - (uniformBlock.camPos).xyz));
        if (distToEye <= float(0))
        {
            return;
        }
        float relativeScreenSizeLog2 = log2(((asteroidStatic).scale / distToEye));
        float LODfloat = max((float)float(0.0),(float)relativeScreenSizeLog2 - minSubdivSizeLog2);
        uint LOD = uint(min((int)uniformBlock.numLODs - 1,(int)int(uint((uint)LODfloat))));
        uint startIdx = uint(uniformBlock.indexOffsets[LOD]);
        uint endIdx = uint(uniformBlock.indexOffsets[(LOD + uint(1))]);
        ((drawCmds[(threadID).x]).drawID = asteroidIdx);
        ((drawCmds[(threadID).x]).startIndex = startIdx);
        ((drawCmds[(threadID).x]).indexCount = (endIdx - startIdx));
        ((drawCmds[(threadID).x]).vertexOffset = int(asteroidStatic.vertexStart));
        ((drawCmds[(threadID).x]).startInstance = uint(0));
        ((drawCmds[(threadID).x]).instanceCount = uint(1));
        (asteroidsDynamic[asteroidIdx] = asteroidDynamic);
    };

    Compute_Shader(constant Uniforms_uniformBlock& uniformBlock, device AsteroidStatic* asteroidsStatic, device AsteroidDynamic* asteroidsDynamic, device IndirectDrawCommand* drawCmds) :
        uniformBlock(uniformBlock), asteroidsStatic(asteroidsStatic), asteroidsDynamic(asteroidsDynamic), drawCmds(drawCmds)
    {}
};
struct ArgBuffer0
{
    device Compute_Shader::AsteroidStatic* asteroidsStatic [[id(1)]];
    device Compute_Shader::AsteroidDynamic* asteroidsDynamic [[id(2)]];
    device Compute_Shader::IndirectDrawCommand* drawCmds [[id(3)]];
};

struct ArgBuffer1
{
    constant Compute_Shader::Uniforms_uniformBlock& uniformBlock [[id(0)]];
};
//[numthreads(128, 1, 1)]
kernel void stageMain(
    uint3 threadID [[thread_position_in_grid]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    uint3 threadID0;
    threadID0 = threadID;
    Compute_Shader main(argBuffer1.uniformBlock, argBuffer0.asteroidsStatic, argBuffer0.asteroidsDynamic, argBuffer0.drawCmds);
    return main.main(threadID0);
}
