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
    float4 depth[1];
    uint4 color[1];
};
struct AOITDepthData
{
    float4 depth[1];
};
struct AOITColorData
{
    uint4 color[1];
};
Texture2D<uint> AOITClearMaskSRV : register(t5, space0);
StructuredBuffer<AOITDepthData> AOITDepthDataSRV : register(t6, space0);
StructuredBuffer<AOITColorData> AOITColorDataSRV : register(t7, space0);
uint PackRGB(float3 color)
{
    uint3 u = (uint3 )(saturate(color) * (float3 )(255) + (float3 )(0.5));
    uint packedOutput = (((u.z << (uint )(16)) | (u.y << (uint )(8))) | u.x);
    return packedOutput;
};

float3 UnpackRGB(uint packedInput)
{
    float3 unpackedOutput;
    uint3 p = uint3((packedInput & 255), ((packedInput >> (uint )(8)) & 255), ((packedInput >> (uint )(16)) & 255));
    (unpackedOutput = ((float3 )(p) / (float3 )(255)));
    return unpackedOutput;
};

uint PackRGBA(float4 color)
{
    uint4 u = (uint4 )(saturate(color) * (float4 )(255) + (float4 )(0.5));
    uint packedOutput = ((((u.w << (uint )(24)) | (u.z << (uint )(16))) | (u.y << (uint )(8))) | u.x);
    return packedOutput;
};

float4 UnpackRGBA(uint packedInput)
{
    float4 unpackedOutput;
    uint4 p = uint4((packedInput & 255), ((packedInput >> (uint )(8)) & 255), ((packedInput >> (uint )(16)) & 255), (packedInput >> (uint )(24)));
    (unpackedOutput = ((float4 )(p) / (float4 )(255)));
    return unpackedOutput;
};

float UnpackUnnormAlpha(uint packedInput)
{
    return (float )(packedInput >> (uint )(24));
};

uint AOITAddrGen(uint2 addr2D, uint width)
{
    (width = (width >> (uint )(1)));
    uint2 tileAddr2D = (addr2D >> (uint2 )(1));
    uint tileAddr1D = ((tileAddr2D[0] + (width * tileAddr2D[1])) << (uint )(2));
    uint2 pixelAddr2D = (addr2D & (uint2 )(1));
    uint pixelAddr1D = ((pixelAddr2D[1] << (uint )(1)) + pixelAddr2D[0]);
    return (tileAddr1D | pixelAddr1D);
};

uint AOITAddrGenSRV(uint2 addr2D)
{
    uint2 dim;
    AOITClearMaskSRV.GetDimensions(dim[0], dim[1]);
    return AOITAddrGen(addr2D, dim[0]);
};

void AOITLoadControlSurface(in uint data, inout AOITControlSurface surface)
{
    (surface.clear = (((data & 1))?(true):(false)));
    (surface.opaque = (((data & 2))?(true):(false)));
    (surface.depth = asfloat(((data & 4294967292) | 3)));
};

void AOITLoadControlSurfaceSRV(in uint2 pixelAddr, inout AOITControlSurface surface)
{
    uint data = AOITClearMaskSRV[pixelAddr];
    AOITLoadControlSurface(data, surface);
};

void AOITLoadDataSRV(in uint2 pixelAddr, out AOITNode nodeArray[4])
{
    AOITData data;
    uint addr = AOITAddrGenSRV(pixelAddr);
    (data.color = AOITColorDataSRV[addr]);
    [unroll]
    for (uint i = (uint )(0); (i < (uint )(4 / 4)); ++i)
    {
        [unroll]
        for (uint j = (uint )(0); (j < (uint )(4)); ++j)
        {
            AOITNode node = {0, UnpackUnnormAlpha(data.color[i][j]), (data.color[i][j] & 16777215)};
            (nodeArray[((4 * (int )(i)) + (int )(j))] = node);
        }
    }
};

void AOITClearData(inout AOITData data, float depth, float4 color)
{
    uint packedColor = PackRGBA(float4(0, 0, 0, (1.0 - color.w)));
    [unroll]
    for (uint i = (uint )(0); (i < (uint )(4 / 4)); ++i)
    {
        (data.depth[i] = (float4 )(3.402820e+38));
        (data.color[i] = (uint4 )(packedColor));
    }
    (data.depth[0][0] = depth);
    (data.color[0][0] = PackRGBA(float4((color.www * color.xyz), (1.0 - color.w))));
};

void AOITInsertFragment(in float fragmentDepth, in float fragmentTrans, in float3 fragmentColor, inout AOITNode nodeArray[4])
{
    int i;
    float depth[5];
    float trans[5];
    uint color[5];
    [unroll]
    for ((i = 0); (i < 4); ++i)
    {
        (depth[i] = nodeArray[i].depth);
        (trans[i] = nodeArray[i].trans);
        (color[i] = nodeArray[i].color);
    }
    int index = 0;
    float prevTrans = (float )(255);
    [unroll]
    for ((i = 0); (i < 4); ++i)
    {
        if (fragmentDepth > depth[i])
        {
            ++index;
            (prevTrans = trans[i]);
        }
    }
    [unroll]
    for ((i = (4 - 1)); (i >= 0); --i)
    {
        [flatten]
        if (index <= i)
        {
            (depth[(i + 1)] = depth[i]);
            (trans[(i + 1)] = (trans[i] * fragmentTrans));
            (color[(i + 1)] = color[i]);
        }
    }
    const float newFragTrans = (fragmentTrans * prevTrans);
    const uint newFragColor = PackRGB((fragmentColor * (float3 )(1.0 - fragmentTrans)));
    (depth[index] = fragmentDepth);
    (trans[index] = newFragTrans);
    (color[index] = newFragColor);
    float EMPTY_NODE = asfloat((asuint(float(3.402820e+38)) & (uint )(4294967295 - (uint )(1 << 8 - 1))));
    [flatten]
    if (asfloat((asuint(float(depth[4])) & (uint )(4294967295 - (uint )(1 << 8 - 1)))) != EMPTY_NODE)
    {
        float3 toBeRemovedColor = UnpackRGB(color[4]);
        float3 toBeAccumulatedColor = UnpackRGB(color[(4 - 1)]);
        (color[(4 - 1)] = PackRGB((toBeAccumulatedColor + ((toBeRemovedColor * (float3 )(trans[4 - 1])) * (float3 )(rcp(trans[(4 - 2)]))))));
        (trans[(4 - 1)] = trans[4]);
    }
    [unroll]
    for ((i = 0); (i < 4); ++i)
    {
        (nodeArray[i].depth = depth[i]);
        (nodeArray[i].trans = trans[i]);
        (nodeArray[i].color = color[i]);
    }
};

struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 UV : Texcoord0;
};
float4 main(VSOutput input) : SV_Target
{
    float4 outColor = float4(0.0, 0.0, 0.0, 1.0);
    uint2 pixelAddr = uint2(input.Position.xy);
    AOITControlSurface ctrlSurface = (AOITControlSurface )(0);
    AOITLoadControlSurfaceSRV(pixelAddr, ctrlSurface);
    if (!ctrlSurface.clear)
    {
        AOITNode nodeArray[4];
        AOITLoadDataSRV(pixelAddr, nodeArray);
        float trans = 1.0;
        float3 color = (float3 )(0.0);
        [unroll]
        for (uint i = (uint )(0); (i < (uint )(4)); ++i)
        {
            (color += ((float3 )(trans) * UnpackRGB(nodeArray[i].color)));
            (trans = (nodeArray[i].trans / (float )(255)));
        }
        (outColor = float4(color, (nodeArray[(4 - 1)].trans / (float )(255))));
    }
    return outColor;
};

