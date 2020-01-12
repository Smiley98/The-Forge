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
RasterizerOrderedTexture2D<uint> AOITClearMaskUAV : register(u0, space0);
RWStructuredBuffer<AOITDepthData> AOITDepthDataUAV : register(u1, space0);
RWStructuredBuffer<AOITColorData> AOITColorDataUAV : register(u2, space0);
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

uint AOITAddrGenUAV(uint2 addr2D)
{
    uint2 dim;
    AOITClearMaskUAV.GetDimensions(dim[0], dim[1]);
    return AOITAddrGen(addr2D, dim[0]);
};

void AOITLoadControlSurface(in uint data, inout AOITControlSurface surface)
{
    (surface.clear = (((data & 1))?(true):(false)));
    (surface.opaque = (((data & 2))?(true):(false)));
    (surface.depth = asfloat(((data & 4294967292) | 3)));
};

void AOITLoadControlSurfaceUAV(in uint2 pixelAddr, inout AOITControlSurface surface)
{
    uint data = AOITClearMaskUAV[pixelAddr];
    AOITLoadControlSurface(data, surface);
};

void AOITStoreControlSurfaceUAV(uint2 pixelAddr, in AOITControlSurface surface)
{
    uint data;
    (data = (asuint(surface.depth) & 4294967292));
    (data |= ((surface.opaque)?(2):(0)));
    (data |= ((surface.clear)?(1):(0)));
    (AOITClearMaskUAV[pixelAddr] = data);
};

void AOITLoadDataUAV(in uint2 pixelAddr, out AOITNode nodeArray[4])
{
    AOITData data;
    uint addr = AOITAddrGenUAV(pixelAddr);
    (data.color = AOITColorDataUAV[addr]);
    (data.depth = AOITDepthDataUAV[addr]);
    [unroll]
    for (uint i = (uint )(0); (i < (uint )(4 / 4)); ++i)
    {
        [unroll]
        for (uint j = (uint )(0); (j < (uint )(4)); ++j)
        {
            AOITNode node = {data.depth[i][j], UnpackUnnormAlpha(data.color[i][j]), (data.color[i][j] & 16777215)};
            (nodeArray[((4 * (int )(i)) + (int )(j))] = node);
        }
    }
};

void AOITStoreDataUAV(in uint2 pixelAddr, AOITNode nodeArray[4])
{
    AOITData data;
    uint addr = AOITAddrGenUAV(pixelAddr);
    [unroll]
    for (uint i = (uint )(0); (i < (uint )(4 / 4)); ++i)
    {
        [unroll]
        for (uint j = (uint )(0); (j < (uint )(4)); ++j)
        {
            (data.depth[i][j] = nodeArray[((4 * (int )(i)) + (int )(j))].depth);
            (data.color[i][j] = ((nodeArray[((4 * (int )(i)) + (int )(j))].color & 16777215) | ((uint )(nodeArray[((4 * (int )(i)) + (int )(j))].trans) << (uint )(24))));
        }
    }
    (AOITDepthDataUAV[addr] = data.depth);
    (AOITColorDataUAV[addr] = data.color);
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

void WriteNewPixelToAOIT(float2 position, float depth, float4 color)
{
    AOITNode nodeArray[4];
    uint2 pixelAddr = uint2(position);
    AOITControlSurface ctrlSurface = (AOITControlSurface )(0);
    AOITLoadControlSurfaceUAV(pixelAddr, ctrlSurface);
    if (ctrlSurface.clear)
    {
        AOITData data;
        AOITClearData(data, depth, color);
        uint addr = AOITAddrGenUAV(pixelAddr);
        (AOITDepthDataUAV[addr] = data.depth);
        (AOITColorDataUAV[addr] = data.color);
        (AOITClearMaskUAV[pixelAddr] = (uint )(0));
    }
    else
    {
        AOITLoadDataUAV(pixelAddr, nodeArray);
        AOITInsertFragment(depth, (1.0 - color.w), color.xyz, nodeArray);
        AOITStoreDataUAV(pixelAddr, nodeArray);
    }
};

struct Material
{
    float4 Color;
    float4 Transmission;
    float RefractionRatio;
    float Collimation;
    float2 Padding;
    uint TextureFlags;
    uint AlbedoTexID;
    uint MetallicTexID;
    uint RoughnessTexID;
    uint EmissiveTexID;
    uint3 Padding2;
};
struct ObjectInfo
{
    float4x4 toWorld;
    float4x4 normalMat;
    uint matID;
};
cbuffer DrawInfoRootConstant : register(b0, space0)
{
    uint baseInstance = (uint )(0);
};

cbuffer ObjectUniformBlock : register(b0, space1)
{
    ObjectInfo objectInfo[128];
};

cbuffer LightUniformBlock : register(b3, space1)
{
    float4x4 lightViewProj;
    float4 lightDirection;
    float4 lightColor;
};

cbuffer CameraUniform : register(b1, space1)
{
    float4x4 camViewProj;
    float4x4 camViewMat;
    float4 camClipInfo;
    float4 camPosition;
};

cbuffer MaterialUniform : register(b2, space1)
{
    Material Materials[128];
};

Texture2D<float4> MaterialTextures[8] : register(t100, space0);
SamplerState LinearSampler : register(s0, space0);
Texture2D<float4> VSM : register(t1, space0);
SamplerState VSMSampler : register(s2, space0);
float2 ComputeMoments(float depth)
{
    float2 moments;
    (moments.x = depth);
    float2 pd = float2(ddx(depth), ddy(depth));
    (moments.y = ((depth * depth) + (0.25 * dot(pd, pd))));
    return moments;
};

float ChebyshevUpperBound(float2 moments, float t)
{
    float p = (float )(t <= moments.x);
    float variance = (moments.y - (moments.x * moments.x));
    (variance = max(variance, 0.0010000000));
    float d = (t - moments.x);
    float pMax = (variance / (variance + (d * d)));
    return max(p, pMax);
};

float3 ShadowContribution(float2 shadowMapPos, float distanceToLight)
{
    float2 moments = VSM.Sample(VSMSampler, shadowMapPos).xy;
    float3 shadow = (float3 )(ChebyshevUpperBound(moments, distanceToLight));
    return shadow;
};

float4 Shade(uint matID, float2 uv, float3 worldPos, float3 normal)
{
    float nDotl = dot(normal, -lightDirection.xyz);
    Material mat = Materials[matID];
    float4 matColor = (((mat.TextureFlags & (uint )(1)))?(MaterialTextures[mat.AlbedoTexID].Sample(LinearSampler, uv)):(mat.Color));
    float3 viewVec = normalize((worldPos - camPosition.xyz));
    if (nDotl < 0.05)
    {
        (nDotl = 0.05);
    }
    float3 diffuse = ((lightColor.xyz * matColor.xyz) * (float3 )(nDotl));
    float3 specular = (lightColor.xyz * (float3 )(pow(saturate(dot(reflect(-lightDirection.xyz, normal), viewVec)), 10.0)));
    float3 finalColor = saturate((diffuse + (specular * (float3 )(0.5))));
    float4 shadowMapPos = mul(lightViewProj, float4(worldPos, 1.0));
    (shadowMapPos.y = -shadowMapPos.y);
    (shadowMapPos.xy = ((shadowMapPos.xy + (float2 )(1.0)) * (float2 )(0.5)));
    if (clamp(shadowMapPos.x, 0.010000000, 0.99) == shadowMapPos.x && (clamp(shadowMapPos.y, 0.010000000, 0.99) == shadowMapPos.y) && (shadowMapPos.z > 0.0))
    {
        float3 lighting = ShadowContribution(shadowMapPos.xy, shadowMapPos.z);
        (finalColor *= lighting);
    }
    return float4(finalColor, matColor.a);
};

struct VSOutput
{
    float4 Position : SV_POSITION;
    float4 WorldPosition : POSITION;
    float4 Normal : NORMAL;
    float4 UV : TEXCOORD0;
    uint MatID : MAT_ID;
};
[earlydepthstencil]
void main(VSOutput input)
{
    float4 finalColor = Shade(input.MatID, input.UV.xy, input.WorldPosition.xyz, normalize(input.Normal.xyz));
    if (finalColor.a > 0.010000000)
    {
        WriteNewPixelToAOIT(input.Position.xy, input.Position.z, finalColor);
        return;
    }
    clip(-1.0);
};

