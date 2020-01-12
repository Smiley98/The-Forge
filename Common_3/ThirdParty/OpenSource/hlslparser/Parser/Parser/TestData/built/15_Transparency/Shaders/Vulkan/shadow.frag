#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) out vec2 rast_FragData0; 

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
struct VSOutput
{
    vec4 Position;
};
vec2 HLSLmain(VSOutput input1)
{
    return ComputeMoments(((input1).Position).z);
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    vec2 result = HLSLmain(input1);
    rast_FragData0 = result;
}
