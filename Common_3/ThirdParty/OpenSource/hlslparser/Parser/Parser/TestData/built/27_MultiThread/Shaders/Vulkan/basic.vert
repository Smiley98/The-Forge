#version 450 core

precision highp float;
precision highp int; 
mat4 MulMat(mat4 lhs, mat4 rhs)
{
    mat4 dst;
	dst[0][0] = lhs[0][0]*rhs[0][0] + lhs[0][1]*rhs[1][0] + lhs[0][2]*rhs[2][0] + lhs[0][3]*rhs[3][0];
	dst[0][1] = lhs[0][0]*rhs[0][1] + lhs[0][1]*rhs[1][1] + lhs[0][2]*rhs[2][1] + lhs[0][3]*rhs[3][1];
	dst[0][2] = lhs[0][0]*rhs[0][2] + lhs[0][1]*rhs[1][2] + lhs[0][2]*rhs[2][2] + lhs[0][3]*rhs[3][2];
	dst[0][3] = lhs[0][0]*rhs[0][3] + lhs[0][1]*rhs[1][3] + lhs[0][2]*rhs[2][3] + lhs[0][3]*rhs[3][3];
	dst[1][0] = lhs[1][0]*rhs[0][0] + lhs[1][1]*rhs[1][0] + lhs[1][2]*rhs[2][0] + lhs[1][3]*rhs[3][0];
	dst[1][1] = lhs[1][0]*rhs[0][1] + lhs[1][1]*rhs[1][1] + lhs[1][2]*rhs[2][1] + lhs[1][3]*rhs[3][1];
	dst[1][2] = lhs[1][0]*rhs[0][2] + lhs[1][1]*rhs[1][2] + lhs[1][2]*rhs[2][2] + lhs[1][3]*rhs[3][2];
	dst[1][3] = lhs[1][0]*rhs[0][3] + lhs[1][1]*rhs[1][3] + lhs[1][2]*rhs[2][3] + lhs[1][3]*rhs[3][3];
	dst[2][0] = lhs[2][0]*rhs[0][0] + lhs[2][1]*rhs[1][0] + lhs[2][2]*rhs[2][0] + lhs[2][3]*rhs[3][0];
	dst[2][1] = lhs[2][0]*rhs[0][1] + lhs[2][1]*rhs[1][1] + lhs[2][2]*rhs[2][1] + lhs[2][3]*rhs[3][1];
	dst[2][2] = lhs[2][0]*rhs[0][2] + lhs[2][1]*rhs[1][2] + lhs[2][2]*rhs[2][2] + lhs[2][3]*rhs[3][2];
	dst[2][3] = lhs[2][0]*rhs[0][3] + lhs[2][1]*rhs[1][3] + lhs[2][2]*rhs[2][3] + lhs[2][3]*rhs[3][3];
	dst[3][0] = lhs[3][0]*rhs[0][0] + lhs[3][1]*rhs[1][0] + lhs[3][2]*rhs[2][0] + lhs[3][3]*rhs[3][0];
	dst[3][1] = lhs[3][0]*rhs[0][1] + lhs[3][1]*rhs[1][1] + lhs[3][2]*rhs[2][1] + lhs[3][3]*rhs[3][1];
	dst[3][2] = lhs[3][0]*rhs[0][2] + lhs[3][1]*rhs[1][2] + lhs[3][2]*rhs[2][2] + lhs[3][3]*rhs[3][2];
	dst[3][3] = lhs[3][0]*rhs[0][3] + lhs[3][1]*rhs[1][3] + lhs[3][2]*rhs[2][3] + lhs[3][3]*rhs[3][3];
    return dst;
}

vec4 MulMat(mat4 lhs, vec4 rhs)
{
    vec4 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1] + lhs[0][2]*rhs[2] + lhs[0][3]*rhs[3];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1] + lhs[1][2]*rhs[2] + lhs[1][3]*rhs[3];
	dst[2] = lhs[2][0]*rhs[0] + lhs[2][1]*rhs[1] + lhs[2][2]*rhs[2] + lhs[2][3]*rhs[3];
	dst[3] = lhs[3][0]*rhs[0] + lhs[3][1]*rhs[1] + lhs[3][2]*rhs[2] + lhs[3][3]*rhs[3];
    return dst;
}


layout(location = 0) in vec4 POSITION;
layout(location = 1) in vec4 NORMAL;
layout(location = 0) out vec4 vertOutput_COLOR;

layout(row_major, set = 3, binding = 0) uniform uniformBlock
{
    mat4 mvp;
    vec4 color[815];
    vec4 lightPosition;
    vec4 lightColor;
    mat4 toWorld[815];
};

struct VSInput
{
    vec4 Position;
    vec4 Normal;
};
struct VSOutput
{
    vec4 Position;
    vec4 Color;
};
VSOutput HLSLmain(VSInput input1, uint InstanceID)
{
    VSOutput result;
    mat4 tempMat = MulMat(mvp,toWorld[InstanceID]);
    ((result).Position = MulMat(tempMat,(input1).Position));
    vec4 normal = normalize(MulMat(toWorld[InstanceID],vec4(((input1).Normal).xyz, 0.0)));
    vec4 pos = MulMat(toWorld[InstanceID],vec4(((input1).Position).xyz, 1.0));
    float lightIntensity = 1.0;
    float quadraticCoeff = float(1.20000004);
    float ambientCoeff = float(0.4);
    vec3 lightDir = normalize(((lightPosition).xyz - (pos).xyz));
    float distance = length(lightDir);
    float attenuation = (float(1.0) / ((quadraticCoeff * distance) * distance));
    float intensity = (lightIntensity * attenuation);
    vec3 baseColor = (color[InstanceID]).xyz;
    vec3 blendedColor = (((lightColor).xyz * baseColor))*(lightIntensity);
    vec3 diffuse = (blendedColor)*(max(dot((normal).xyz, lightDir), float(0.0)));
    vec3 ambient = (baseColor)*(ambientCoeff);
    ((result).Color = vec4((diffuse + ambient), 1.0));
    return result;
}
void main()
{
    VSInput input1;
    input1.Position = POSITION;
    input1.Normal = NORMAL;
    uint InstanceID;
    InstanceID = gl_InstanceIndex;
    VSOutput result = HLSLmain(input1, InstanceID);
    gl_Position = result.Position;
    vertOutput_COLOR = result.Color;
}
