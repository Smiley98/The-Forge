#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct AOITNode
    {
        float depth;
        float trans;
        uint color;
    };
    struct AOITControlSurface
    {
        bool clear;
        bool opaque;
        float depth;
    };
    struct AOITData
    {
        array<float4, 1> depth;
        array<uint4, 1> color;
    };
    struct AOITDepthData
    {
        array<float4, 1> depth;
    };
    struct AOITColorData
    {
        array<uint4, 1> color;
    };
    texture2d<uint, access::read_write> AOITClearMaskUAV;
    struct VSOutput
    {
        float4 Position;
        float4 UV;
    };
    void main(VSOutput input)
    {
        uint2 pixelAddr = uint2((uint2)((input).Position).xy);
        uint data = 1u;
        (AOITClearMaskUAV.write(datapixelAddr));
    };

    Fragment_Shader(texture2d<uint, access::read_write> AOITClearMaskUAV) :
        AOITClearMaskUAV(AOITClearMaskUAV)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 Texcoord0;
};

struct ArgBuffer0
{
    texture2d<uint, access::read_write> AOITClearMaskUAV [[id(0)]];
};

fragment void stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.UV = inputData.Texcoord0;
    Fragment_Shader main(argBuffer0.AOITClearMaskUAV);
    return main.main(input0);
}
