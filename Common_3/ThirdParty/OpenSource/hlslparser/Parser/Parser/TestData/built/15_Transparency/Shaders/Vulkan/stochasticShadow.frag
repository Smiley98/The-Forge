#version 450 core

precision highp float;
precision highp int; 
vec4 MulMat(mat4 lhs, vec4 rhs)
{
    vec4 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1] + lhs[0][2]*rhs[2] + lhs[0][3]*rhs[3];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1] + lhs[1][2]*rhs[2] + lhs[1][3]*rhs[3];
	dst[2] = lhs[2][0]*rhs[0] + lhs[2][1]*rhs[1] + lhs[2][2]*rhs[2] + lhs[2][3]*rhs[3];
	dst[3] = lhs[3][0]*rhs[0] + lhs[3][1]*rhs[1] + lhs[3][2]*rhs[2] + lhs[3][3]*rhs[3];
    return dst;
}


layout(location = 0) in vec4 fragInput_POSITION;
layout(location = 1) in vec4 fragInput_NORMAL;
layout(location = 2) in vec4 fragInput_TEXCOORD0;
layout(location = 3) in flat uint fragInput_MAT_ID;
layout(location = 0) out vec2 rast_FragData0; 
layout(location = 1) out vec2 rast_FragData1; 
layout(location = 2) out vec2 rast_FragData2; 

struct Material
{
    vec4 Color;
    vec4 Transmission;
    float RefractionRatio;
    float Collimation;
    vec2 Padding;
    uint TextureFlags;
    uint AlbedoTexID;
    uint MetallicTexID;
    uint RoughnessTexID;
    uint EmissiveTexID;
    uvec3 Padding2;
};
struct ObjectInfo
{
    mat4 toWorld;
    mat4 normalMat;
    uint matID;
};
layout(row_major, push_constant) uniform DrawInfoRootConstant_Block
{
    uint baseInstance;
}DrawInfoRootConstant;

layout(row_major, set = 1, binding = 0) uniform ObjectUniformBlock
{
    ObjectInfo objectInfo[128];
};

layout(row_major, set = 1, binding = 3) uniform LightUniformBlock
{
    mat4 lightViewProj;
    vec4 lightDirection;
    vec4 lightColor;
};

layout(row_major, set = 1, binding = 1) uniform CameraUniform
{
    mat4 camViewProj;
    mat4 camViewMat;
    vec4 camClipInfo;
    vec4 camPosition;
};

layout(row_major, set = 1, binding = 2) uniform MaterialUniform
{
    Material Materials[128];
};

layout(set = 0, binding = 100) uniform texture2D MaterialTextures[8];
layout(set = 0, binding = 0) uniform sampler LinearSampler;
layout(set = 0, binding = 1) uniform texture2D VSM;
layout(set = 0, binding = 2) uniform sampler VSMSampler;
vec2 ComputeMoments(float depth)
{
    vec2 moments;
    ((moments).x = depth);
    vec2 pd = vec2(dFdx(depth), dFdy(depth));
    ((moments).y = ((depth * depth) + (0.25 * dot(pd, pd))));
    return moments;
}
float ChebyshevUpperBound(vec2 moments, float t)
{
    float p = float((t <= (moments).x));
    float variance = ((moments).y - ((moments).x * (moments).x));
    (variance = max(variance, 0.0010000000));
    float d = (t - (moments).x);
    float pMax = (variance / (variance + (d * d)));
    return max(p, pMax);
}
vec3 ShadowContribution(vec2 shadowMapPos, float distanceToLight)
{
    vec2 moments = (texture(sampler2D(VSM, VSMSampler), shadowMapPos)).xy;
    vec3 shadow = vec3(ChebyshevUpperBound(moments, distanceToLight));
    return shadow;
}
vec4 Shade(uint matID, vec2 uv, vec3 worldPos, vec3 normal)
{
    float nDotl = dot(normal, (-(lightDirection).xyz));
    Material mat = Materials[matID];
    vec4 matColor = ((bool(((mat).TextureFlags & uint(1))))?(texture(sampler2D(MaterialTextures[(mat).AlbedoTexID], LinearSampler), uv)):((mat).Color));
    vec3 viewVec = normalize((worldPos - (camPosition).xyz));
    if((nDotl < 0.05))
    {
        (nDotl = 0.05);
    }
    vec3 diffuse = (((lightColor).xyz * (matColor).xyz) * vec3(nDotl));
    vec3 specular = ((lightColor).xyz * vec3(pow(clamp(dot(reflect((-(lightDirection).xyz), normal), viewVec), 0.0, 1.0),float(10.0))));
    vec3 finalColor = clamp((diffuse + (specular * vec3(0.5))), 0.0, 1.0);
    vec4 shadowMapPos = MulMat(lightViewProj,vec4(worldPos, 1.0));
    ((shadowMapPos).y = (-(shadowMapPos).y));
    ((shadowMapPos).xy = (((shadowMapPos).xy + vec2(1.0)) * vec2(0.5)));
    if((((clamp((shadowMapPos).x, 0.010000000, 0.99) == (shadowMapPos).x) && (clamp((shadowMapPos).y, 0.010000000, 0.99) == (shadowMapPos).y)) && ((shadowMapPos).z > 0.0)))
    {
        vec3 lighting = ShadowContribution((shadowMapPos).xy, (shadowMapPos).z);
        (finalColor *= lighting);
    }
    return vec4(finalColor, (matColor).a);
}
float hash(vec3 p)
{
    (p = fract(((p * vec3(0.31830990)) + vec3(0.1))));
    (p *= vec3(17.0));
    return fract(((((p).x * (p).y) * (p).z) * (((p).x + (p).y) + (p).z)));
}
float noise(in vec3 x)
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    (f = ((f * f) * (vec3(3.0) - (vec3(2.0) * f))));
    return mix(mix(mix(hash((p + vec3(0, 0, 0))), hash((p + vec3(1, 0, 0))), (f).x), mix(hash((p + vec3(0, 1, 0))), hash((p + vec3(1, 1, 0))), (f).x), (f).y), mix(mix(hash((p + vec3(0, 0, 1))), hash((p + vec3(1, 0, 1))), (f).x), mix(hash((p + vec3(0, 1, 1))), hash((p + vec3(1, 1, 1))), (f).x), (f).y), (f).z);
}
struct VSOutput
{
    vec4 Position;
    vec4 WorldPosition;
    vec4 Normal;
    vec4 UV;
    uint MatID;
};
struct PSOutput
{
    vec2 RedVarianceShadowMap;
    vec2 GreenVarianceShadowMap;
    vec2 BlueVarianceShadowMap;
};
PSOutput HLSLmain(VSOutput input1)
{
    Material mat = Materials[(input1).MatID];
    vec4 matColor = ((bool(((mat).TextureFlags & uint(1))))?(texture(sampler2D(MaterialTextures[(mat).AlbedoTexID], LinearSampler), ((input1).UV).xy)):((mat).Color));
    vec3 p = vec3(((vec4(1.0) - (mat).Transmission) * vec4((matColor).a)));
    float e = noise((((input1).WorldPosition).xyz * vec3(10000.0)));
    vec3 normal = normalize(((input1).Normal).xyz);
    vec3 ld = vec3(camViewMat[2][0], camViewMat[2][1], camViewMat[2][2]);
    float s = clamp((((mat).RefractionRatio - 1.0) * 0.5), 0.0, 1.0);
    float g = ((2.0 * clamp((1.0 - pow(dot(normalize(normal), (-(ld).xyz)),float(((128.0 * s) * s)))), 0.0, 1.0)) - 1.0);
    (p = min(vec3(1.0), (vec3((1.0 + (g * pow(s,float(0.2))))) * p)));
    PSOutput output1;
    vec2 moments = ComputeMoments(((input1).Position).z);
    ((output1).RedVarianceShadowMap = max(moments, vec2((e > (p).r))));
    ((output1).GreenVarianceShadowMap = max(moments, vec2((e > (p).g))));
    ((output1).BlueVarianceShadowMap = max(moments, vec2((e > (p).b))));
    return output1;
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.WorldPosition = fragInput_POSITION;
    input1.Normal = fragInput_NORMAL;
    input1.UV = fragInput_TEXCOORD0;
    input1.MatID = fragInput_MAT_ID;
    PSOutput result = HLSLmain(input1);
    rast_FragData0 = result.RedVarianceShadowMap;
    rast_FragData1 = result.GreenVarianceShadowMap;
    rast_FragData2 = result.BlueVarianceShadowMap;
}
