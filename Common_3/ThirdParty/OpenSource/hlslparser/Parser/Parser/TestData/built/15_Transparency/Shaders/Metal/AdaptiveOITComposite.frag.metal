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
    texture2d<uint> AOITClearMaskSRV;
    constant AOITColorData* AOITColorDataSRV;
    float3 UnpackRGB(uint packedInput)
    {
        float3 unpackedOutput;
        uint3 p = uint3((packedInput & 255u), ((packedInput >> uint(8)) & 255u), ((packedInput >> uint(16)) & 255u));
        (unpackedOutput = (float3(p) / float3(255)));
        return unpackedOutput;
    };
    float UnpackUnnormAlpha(uint packedInput)
    {
        return float(packedInput >> uint(24));
    };
    uint AOITAddrGen(uint2 addr2D, uint width)
    {
        (width = (width >> uint(1)));
        uint2 tileAddr2D = (addr2D >> uint2(1));
        uint tileAddr1D = ((tileAddr2D[0] + (width * tileAddr2D[1])) << uint(2));
        uint2 pixelAddr2D = (addr2D & uint2(1u));
        uint pixelAddr1D = ((pixelAddr2D[1] << uint(1)) + pixelAddr2D[0]);
        return (tileAddr1D | pixelAddr1D);
    };
    uint AOITAddrGenSRV(uint2 addr2D)
    {
        uint2 dim;
        dim[0] = AOITClearMaskSRV.get_width();
        dim[1] = AOITClearMaskSRV.get_height();
        return AOITAddrGen(addr2D, dim[0]);
    };
    void AOITLoadControlSurface(uint data, thread AOITControlSurface(& surface))
    {
        ((surface).clear = (((data & 1u))?(true):(false)));
        ((surface).opaque = (((data & 2u))?(true):(false)));
        ((surface).depth = as_type<float>(((data & 4294967292u) | 3u)));
    };
    void AOITLoadControlSurfaceSRV(uint2 pixelAddr, thread AOITControlSurface(& surface))
    {
        uint data = AOITClearMaskSRV.read((pixelAddr).xy);
        AOITLoadControlSurface(data, surface);
    };
    void AOITLoadDataSRV(uint2 pixelAddr, thread array<AOITNode, 4>(& nodeArray))
    {
        AOITData data;
        uint addr = AOITAddrGenSRV(pixelAddr);
        ((data).color = (array<uint4, 1>)(AOITColorDataSRV[addr]));
        for (uint i = uint(0); (i < uint(4 / 4)); (++i))
        {
            for (uint j = uint(0); (j < uint(4)); (++j))
            {
                AOITNode node = {0, UnpackUnnormAlpha((data).color[i][j]), ((data).color[i][j] & 16777215u)};
                (nodeArray[((4 * int(i)) + int(j))] = node);
            }
        }
    };
    struct VSOutput
    {
        float4 Position;
        float4 UV;
    };
    float4 main(VSOutput input)
    {
        float4 outColor = float4(0.0, 0.0, 0.0, 1.0);
        uint2 pixelAddr = uint2((uint2)((input).Position).xy);
        AOITControlSurface ctrlSurface = (AOITControlSurface)0;
        AOITLoadControlSurfaceSRV(pixelAddr, ctrlSurface);
        if ((!ctrlSurface.clear))
        {
            array<AOITNode, 4> nodeArray;
            AOITLoadDataSRV(pixelAddr, nodeArray);
            float trans = 1.0;
            float3 color = float3(0.0);
            for (uint i = uint(0); (i < uint(4)); (++i))
            {
                (color += (float3(trans) * UnpackRGB((nodeArray[i]).color)));
                (trans = ((nodeArray[i]).trans / float(255)));
            }
            (outColor = float4(color, ((nodeArray[(4 - 1)]).trans / float(255))));
        }
        return outColor;
    };

    Fragment_Shader(texture2d<uint> AOITClearMaskSRV, constant AOITColorData* AOITColorDataSRV) :
        AOITClearMaskSRV(AOITClearMaskSRV), AOITColorDataSRV(AOITColorDataSRV)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 Texcoord0;
};

struct main_output { float4 tmp [[color(0)]]; };

struct ArgBuffer0
{
    texture2d<uint> AOITClearMaskSRV [[id(5)]];
    constant Fragment_Shader::AOITColorData* AOITColorDataSRV [[id(7)]];
};

fragment main_output stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.UV = inputData.Texcoord0;
    Fragment_Shader main(argBuffer0.AOITClearMaskSRV, argBuffer0.AOITColorDataSRV);
    main_output output; output.tmp = main.main(input0);
    return output;
}
