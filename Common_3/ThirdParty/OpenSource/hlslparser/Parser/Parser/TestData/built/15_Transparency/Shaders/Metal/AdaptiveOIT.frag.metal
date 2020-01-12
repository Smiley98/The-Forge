#include <metal_stdlib>
using namespace metal;

inline void clip(float x) {
    if (x < 0.0) discard_fragment();
}
inline float rcp(float x) {
    return 1.0f / x;
}
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
    device AOITDepthData* AOITDepthDataUAV;
    device AOITColorData* AOITColorDataUAV;
    uint PackRGB(float3 color)
    {
        uint3 u = uint3(saturate(color) * float3(255) + float3(0.5));
        uint packedOutput = ((((u).z << uint(16)) | ((u).y << uint(8))) | (u).x);
        return packedOutput;
    };
    float3 UnpackRGB(uint packedInput)
    {
        float3 unpackedOutput;
        uint3 p = uint3((packedInput & 255u), ((packedInput >> uint(8)) & 255u), ((packedInput >> uint(16)) & 255u));
        (unpackedOutput = (float3(p) / float3(255)));
        return unpackedOutput;
    };
    uint PackRGBA(float4 color)
    {
        uint4 u = uint4(saturate(color) * float4(255) + float4(0.5));
        uint packedOutput = (((((u).w << uint(24)) | ((u).z << uint(16))) | ((u).y << uint(8))) | (u).x);
        return packedOutput;
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
    uint AOITAddrGenUAV(uint2 addr2D)
    {
        uint2 dim;
        dim[0] = AOITClearMaskUAV.get_width();
        dim[1] = AOITClearMaskUAV.get_height();
        return AOITAddrGen(addr2D, dim[0]);
    };
    void AOITLoadControlSurface(uint data, thread AOITControlSurface(& surface))
    {
        ((surface).clear = (((data & 1u))?(true):(false)));
        ((surface).opaque = (((data & 2u))?(true):(false)));
        ((surface).depth = as_type<float>(((data & 4294967292u) | 3u)));
    };
    void AOITLoadControlSurfaceUAV(uint2 pixelAddr, thread AOITControlSurface(& surface))
    {
        uint data = AOITClearMaskUAV.read((pixelAddr).xy);
        AOITLoadControlSurface(data, surface);
    };
    void AOITLoadDataUAV(uint2 pixelAddr, thread array<AOITNode, 4>(& nodeArray))
    {
        AOITData data;
        uint addr = AOITAddrGenUAV(pixelAddr);
        ((data).color = (array<uint4, 1>)(AOITColorDataUAV[addr]));
        ((data).depth = (array<float4, 1>)(AOITDepthDataUAV[addr]));
        for (uint i = uint(0); (i < uint(4 / 4)); (++i))
        {
            for (uint j = uint(0); (j < uint(4)); (++j))
            {
                AOITNode node = {(data).depth[i][j], UnpackUnnormAlpha((data).color[i][j]), ((data).color[i][j] & 16777215u)};
                (nodeArray[((4 * int(i)) + int(j))] = node);
            }
        }
    };
    void AOITStoreDataUAV(uint2 pixelAddr, array<AOITNode, 4> nodeArray)
    {
        AOITData data;
        uint addr = AOITAddrGenUAV(pixelAddr);
        for (uint i = uint(0); (i < uint(4 / 4)); (++i))
        {
            for (uint j = uint(0); (j < uint(4)); (++j))
            {
                ((data).depth[i][j] = (nodeArray[((4 * int(i)) + int(j))]).depth);
                ((data).color[i][j] = (((nodeArray[((4 * int(i)) + int(j))]).color & 16777215u) | (uint(nodeArray[((4 * int(i)) + int(j))].trans) << uint(24))));
            }
        }
        (AOITDepthDataUAV[addr] = (AOITDepthData)((data).depth));
        (AOITColorDataUAV[addr] = (AOITColorData)((data).color));
    };
    void AOITClearData(thread AOITData(& data), float depth, float4 color)
    {
        uint packedColor = PackRGBA(float4((float)0, (float)0, (float)0, (1.0 - (color).w)));
        for (uint i = uint(0); (i < uint(4 / 4)); (++i))
        {
            ((data).depth[i] = float4(3.402820e+38));
            ((data).color[i] = uint4(packedColor));
        }
        ((data).depth[0][0] = depth);
        ((data).color[0][0] = PackRGBA(float4(((color).www * (color).xyz), (1.0 - (color).w))));
    };
    void AOITInsertFragment(float fragmentDepth, float fragmentTrans, float3 fragmentColor, thread array<AOITNode, 4>(& nodeArray))
    {
        int i;
        array<float, 5> depth;
        array<float, 5> trans;
        array<uint, 5> color;
        for ((i = 0); (i < 4); (++i))
        {
            (depth[i] = (nodeArray[i]).depth);
            (trans[i] = (nodeArray[i]).trans);
            (color[i] = (nodeArray[i]).color);
        }
        int index = 0;
        float prevTrans = float(255);
        for ((i = 0); (i < 4); (++i))
        {
            if (fragmentDepth > depth[i])
            {
                (++index);
                (prevTrans = trans[i]);
            }
        }
        for ((i = (4 - 1)); (i >= 0); (--i))
        {
            if (index <= i)
            {
                (depth[(i + 1)] = depth[i]);
                (trans[(i + 1)] = (trans[i] * fragmentTrans));
                (color[(i + 1)] = color[i]);
            }
        }
        const float newFragTrans = (fragmentTrans * prevTrans);
        const uint newFragColor = PackRGB((fragmentColor * float3(1.0 - fragmentTrans)));
        (depth[index] = fragmentDepth);
        (trans[index] = newFragTrans);
        (color[index] = newFragColor);
        float EMPTY_NODE = as_type<float>((as_type<uint>(float((float)3.402820e+38)) & (uint)4294967295u - uint(1 << 8 - 1)));
        if (as_type<float>((as_type<uint>(float(depth[4])) & (uint)4294967295u - uint(1 << 8 - 1))) != EMPTY_NODE)
        {
            float3 toBeRemovedColor = UnpackRGB(color[4]);
            float3 toBeAccumulatedColor = UnpackRGB(color[(4 - 1)]);
            (color[(4 - 1)] = PackRGB((toBeAccumulatedColor + ((toBeRemovedColor * float3(trans[(4 - 1)])) * float3(rcp(trans[(4 - 2)]))))));
            (trans[(4 - 1)] = trans[4]);
        }
        for ((i = 0); (i < 4); (++i))
        {
            ((nodeArray[i]).depth = depth[i]);
            ((nodeArray[i]).trans = trans[i]);
            ((nodeArray[i]).color = color[i]);
        }
    };
    void WriteNewPixelToAOIT(float2 position, float depth, float4 color)
    {
        array<AOITNode, 4> nodeArray;
        uint2 pixelAddr = uint2((uint2)position);
        AOITControlSurface ctrlSurface = (AOITControlSurface)0;
        AOITLoadControlSurfaceUAV(pixelAddr, ctrlSurface);
        if (ctrlSurface.clear)
        {
            AOITData data;
            AOITClearData(data, depth, color);
            uint addr = AOITAddrGenUAV(pixelAddr);
            (AOITDepthDataUAV[addr] = (AOITDepthData)((data).depth));
            (AOITColorDataUAV[addr] = (AOITColorData)((data).color));
            (AOITClearMaskUAV.write(uint(0)pixelAddr));
        }
        else
        {
            AOITLoadDataUAV(pixelAddr, nodeArray);
            AOITInsertFragment(depth, (1.0 - (color).w), (color).xyz, nodeArray);
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
    struct Uniforms_LightUniformBlock
    {
        float4x4 lightViewProj;
        float4 lightDirection;
        float4 lightColor;
    };
    constant Uniforms_LightUniformBlock& LightUniformBlock;
    struct Uniforms_CameraUniform
    {
        float4x4 camViewProj;
        float4x4 camViewMat;
        float4 camClipInfo;
        float4 camPosition;
    };
    constant Uniforms_CameraUniform& CameraUniform;
    struct Uniforms_MaterialUniform
    {
        array<Material, 128> Materials;
    };
    constant Uniforms_MaterialUniform& MaterialUniform;
    array<texture2d<float>, 8> MaterialTextures;
    sampler LinearSampler;
    texture2d<float> VSM;
    sampler VSMSampler;
    float ChebyshevUpperBound(float2 moments, float t)
    {
        float p = float(t <= (moments).x);
        float variance = ((moments).y - ((moments).x * (moments).x));
        (variance = max((float)variance,(float)0.0010000000));
        float d = (t - (moments).x);
        float pMax = (variance / (variance + (d * d)));
        return max((float)p,(float)pMax);
    };
    float3 ShadowContribution(float2 shadowMapPos, float distanceToLight)
    {
        float2 moments = (VSM.sample(VSMSampler, shadowMapPos)).xy;
        float3 shadow = float3(ChebyshevUpperBound(moments, distanceToLight));
        return shadow;
    };
    float4 Shade(uint matID, float2 uv, float3 worldPos, float3 normal)
    {
        float nDotl = dot(normal, (-(LightUniformBlock.lightDirection).xyz));
        Material mat = MaterialUniform.Materials[matID];
        float4 matColor = ((((mat).TextureFlags & uint(1)))?(MaterialTextures[(mat).AlbedoTexID].sample(LinearSampler, uv)):((mat).Color));
        float3 viewVec = normalize((worldPos - (CameraUniform.camPosition).xyz));
        if (nDotl < 0.05)
        {
            (nDotl = 0.05);
        }
        float3 diffuse = (((LightUniformBlock.lightColor).xyz * (matColor).xyz) * float3(nDotl));
        float3 specular = ((LightUniformBlock.lightColor).xyz * float3(pow(saturate(dot(reflect((-(LightUniformBlock.lightDirection).xyz), normal), viewVec)), 10.0)));
        float3 finalColor = saturate((diffuse + (specular * float3(0.5))));
        float4 shadowMapPos = ((LightUniformBlock.lightViewProj)*(float4(worldPos, 1.0)));
        ((shadowMapPos).y = (-(shadowMapPos).y));
        ((shadowMapPos).xy = (((shadowMapPos).xy + float2(1.0)) * float2(0.5)));
        if (clamp((shadowMapPos).x, 0.010000000, 0.99) == (shadowMapPos).x && (clamp((shadowMapPos).y, 0.010000000, 0.99) == (shadowMapPos).y) && ((shadowMapPos).z > 0.0))
        {
            float3 lighting = ShadowContribution((shadowMapPos).xy, (shadowMapPos).z);
            (finalColor *= lighting);
        }
        return float4(finalColor, (matColor).a);
    };
    struct VSOutput
    {
        float4 Position;
        float4 WorldPosition;
        float4 Normal;
        float4 UV;
        uint MatID;
    };
    void main(VSOutput input)
    {
        float4 finalColor = Shade((input).MatID, ((input).UV).xy, ((input).WorldPosition).xyz, normalize(((input).Normal).xyz));
        if (finalColor.a > 0.010000000)
        {
            WriteNewPixelToAOIT(((input).Position).xy, ((input).Position).z, finalColor);
            return;
        }
        clip((-1.0));
    };

    Fragment_Shader(texture2d<uint, access::read_write> AOITClearMaskUAV, device AOITDepthData* AOITDepthDataUAV, device AOITColorData* AOITColorDataUAV, constant Uniforms_LightUniformBlock& LightUniformBlock, constant Uniforms_CameraUniform& CameraUniform, constant Uniforms_MaterialUniform& MaterialUniform, array<texture2d<float>, 8> MaterialTextures, sampler LinearSampler, texture2d<float> VSM, sampler VSMSampler) :
        AOITClearMaskUAV(AOITClearMaskUAV), AOITDepthDataUAV(AOITDepthDataUAV), AOITColorDataUAV(AOITColorDataUAV), LightUniformBlock(LightUniformBlock), CameraUniform(CameraUniform), MaterialUniform(MaterialUniform), MaterialTextures(MaterialTextures), LinearSampler(LinearSampler), VSM(VSM), VSMSampler(VSMSampler)
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 POSITION;
    float4 NORMAL;
    float4 TEXCOORD0;
    uint MAT_ID;
};

struct ArgBuffer0
{
    texture2d<uint, access::read_write> AOITClearMaskUAV [[id(0)]];
    sampler LinearSampler [[id(0)]];
    device Fragment_Shader::AOITDepthData* AOITDepthDataUAV [[id(1)]];
    texture2d<float> VSM [[id(1)]];
    device Fragment_Shader::AOITColorData* AOITColorDataUAV [[id(2)]];
    sampler VSMSampler [[id(2)]];
    array<texture2d<float>, 8> MaterialTextures [[id(100)]];
};

struct ArgBuffer1
{
    constant Fragment_Shader::Uniforms_CameraUniform& CameraUniform [[id(1)]];
    constant Fragment_Shader::Uniforms_MaterialUniform& MaterialUniform [[id(2)]];
    constant Fragment_Shader::Uniforms_LightUniformBlock& LightUniformBlock [[id(3)]];
};

fragment void stageMain(
	main_input inputData [[stage_in]],
    constant ArgBuffer0& argBuffer0 [[buffer(0)]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    Fragment_Shader::VSOutput input0;
    input0.Position = inputData.SV_POSITION;
    input0.WorldPosition = inputData.POSITION;
    input0.Normal = inputData.NORMAL;
    input0.UV = inputData.TEXCOORD0;
    input0.MatID = inputData.MAT_ID;
    Fragment_Shader main(argBuffer0.AOITClearMaskUAV, argBuffer0.AOITDepthDataUAV, argBuffer0.AOITColorDataUAV, argBuffer1.LightUniformBlock, argBuffer1.CameraUniform, argBuffer1.MaterialUniform, argBuffer0.MaterialTextures, argBuffer0.LinearSampler, argBuffer0.VSM, argBuffer0.VSMSampler);
    return main.main(input0);
}
