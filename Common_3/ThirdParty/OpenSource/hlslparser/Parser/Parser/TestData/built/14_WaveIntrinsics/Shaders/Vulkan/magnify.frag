#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec2 fragInput_TEXCOORD;
layout(location = 0) out vec4 rast_FragData0; 

layout(row_major, set = 1, binding = 0) uniform SceneConstantBuffer
{
    mat4 orthProjMatrix;
    vec2 mousePosition;
    vec2 resolution;
    float time;
    uint renderMode;
    uint laneSize;
    uint padding;
};

struct PSInput
{
    vec4 position;
    vec2 uv;
};
layout(set = 0, binding = 1) uniform texture2D g_texture;
layout(set = 0, binding = 2) uniform sampler g_sampler;
vec4 HLSLmain(PSInput input1)
{
    float aspectRatio = ((resolution).x / (resolution).y);
    float magnifiedFactor = 6.0;
    float magnifiedAreaSize = 0.05;
    float magnifiedAreaBorder = 0.0050000000;
    vec2 normalizedPixelPos = (input1).uv;
    vec2 normalizedMousePos = (mousePosition / resolution);
    vec2 diff = abs((normalizedPixelPos - normalizedMousePos));
    vec4 color = texture(sampler2D(g_texture, g_sampler), normalizedPixelPos);
    if((((diff).x < (magnifiedAreaSize + magnifiedAreaBorder)) && ((diff).y < ((magnifiedAreaSize + magnifiedAreaBorder) * aspectRatio))))
    {
        (color = vec4(0.0, 1.0, 1.0, 1.0));
    }
    if((((diff).x < magnifiedAreaSize) && ((diff).y < (magnifiedAreaSize * aspectRatio))))
    {
        (color = texture(sampler2D(g_texture, g_sampler), (normalizedMousePos + ((normalizedPixelPos - normalizedMousePos) / vec2(magnifiedFactor)))));
    }
    return color;
}
void main()
{
    PSInput input1;
    input1.position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.uv = fragInput_TEXCOORD;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
