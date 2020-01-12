#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec4 fragInput_TEXCOORD;
layout(location = 0) out vec4 rast_FragData0; 

layout(row_major, set = 0, binding = 0) uniform uniformBlock
{
    mat4 mvp;
    mat4 toWorld[20];
    vec4 color[20];
    vec3 lightPosition;
    vec3 lightColor;
};

struct VSOutput
{
    vec4 Position;
    vec4 TexCoord;
};
layout(set = 0, binding = 7) uniform sampler uSampler0;
layout(set = 0, binding = 1) uniform texture2D RightText;
layout(set = 0, binding = 2) uniform texture2D LeftText;
layout(set = 0, binding = 3) uniform texture2D TopText;
layout(set = 0, binding = 4) uniform texture2D BotText;
layout(set = 0, binding = 5) uniform texture2D FrontText;
layout(set = 0, binding = 6) uniform texture2D BackText;
vec4 HLSLmain(VSOutput input1)
{
    vec2 newtextcoord;
    float side = round(((input1).TexCoord).w);
    if((side == 1.0))
    {
        (newtextcoord = ((((input1).TexCoord).zy / vec2(20)) + vec2(0.5)));
        (newtextcoord = vec2((float(1) - (newtextcoord).x), (float(1) - (newtextcoord).y)));
        return texture(sampler2D(RightText, uSampler0), newtextcoord);
    }
    else if ((side == 2.0))
    {
        (newtextcoord = ((((input1).TexCoord).zy / vec2(20)) + vec2(0.5)));
        (newtextcoord = vec2((newtextcoord).x, (float(1) - (newtextcoord).y)));
        return texture(sampler2D(LeftText, uSampler0), newtextcoord);
    }
    else if ((side == 4.0))
    {
        (newtextcoord = ((((input1).TexCoord).xz / vec2(20)) + vec2(0.5)));
        (newtextcoord = vec2((newtextcoord).x, (float(1) - (newtextcoord).y)));
        return texture(sampler2D(BotText, uSampler0), newtextcoord);
    }
    else if ((side == 5.0))
    {
        (newtextcoord = ((((input1).TexCoord).xy / vec2(20)) + vec2(0.5)));
        (newtextcoord = vec2((newtextcoord).x, (float(1) - (newtextcoord).y)));
        return texture(sampler2D(FrontText, uSampler0), newtextcoord);
    }
    else if ((side == 6.0))
    {
        (newtextcoord = ((((input1).TexCoord).xy / vec2(20)) + vec2(0.5)));
        (newtextcoord = vec2((float(1) - (newtextcoord).x), (float(1) - (newtextcoord).y)));
        return texture(sampler2D(BackText, uSampler0), newtextcoord);
    }
    else
    {
        (newtextcoord = ((((input1).TexCoord).xz / vec2(20)) + vec2(0.5)));
        (newtextcoord = vec2((newtextcoord).x, (newtextcoord).y));
        return texture(sampler2D(TopText, uSampler0), newtextcoord);
    }
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.TexCoord = fragInput_TEXCOORD;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
