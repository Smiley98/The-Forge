#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) in vec2 fragInput_TEXCOORD;
layout(location = 0) out vec4 rast_FragData0; 

struct VSOutput
{
    vec4 Position;
    vec2 TexCoord;
};
vec4 HLSLmain(VSOutput input1)
{
    float tol = 0.0025000000;
    float res = 0.05;
    vec4 backgroundColor = vec4(0.49, 0.64000000, 0.68, 1.0);
    vec4 lineColor = vec4(0.39, 0.41, 0.37, 1.0);
    vec4 originColor = vec4(0.0, 0.0, 0.0, 1.0);
    if(((abs((((input1).TexCoord).x - 0.5)) <= tol) && (abs((((input1).TexCoord).y - 0.5)) <= tol)))
    {
        return originColor;
    }
    else if (((((mod(((input1).TexCoord).x, res) >= (res - tol)) || (mod(((input1).TexCoord).x, res) < tol)) || (mod(((input1).TexCoord).y, res) >= (res - tol))) || (mod(((input1).TexCoord).y, res) < tol)))
    {
        return lineColor;
    }
    else
    {
        return backgroundColor;
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
