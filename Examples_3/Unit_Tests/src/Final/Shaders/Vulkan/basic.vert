#version 450 core
#define MAX_PLANETS 1

layout(location = 0) in vec4 Position;
layout(location = 1) in vec4 Normal;

layout(location = 0) out vec4 Color;

layout (std140, UPDATE_FREQ_PER_FRAME, binding=0) uniform uniformBlock {
    uniform mat4 viewProject;
    uniform mat4 toWorld[MAX_PLANETS];
    uniform vec4 color[MAX_PLANETS];

    // Point Light Information
    uniform vec3 lightPosition;
    uniform vec3 lightColor;
};

void main ()
{
    mat4 mvp = viewProject * toWorld[gl_InstanceIndex];
	gl_Position = mvp * vec4(Position.xyz, 1.0f);
	
	vec4 normal = normalize(toWorld[gl_InstanceIndex] * vec4(Normal.xyz, 0.0f));
	vec4 pos = toWorld[gl_InstanceIndex] * vec4(Position.xyz, 1.0f);
	
	float lightIntensity = 1.0f;
    float quadraticCoeff = 1.2;
    float ambientCoeff = 0.4;
	
	vec3 lightDir;

    if (color[gl_InstanceIndex].w == 0) // Special case for Sun, so that it is lit from its top
        lightDir = vec3(0.0f, 1.0f, 0.0f);
    else
        lightDir = normalize(lightPosition - pos.xyz);
	
    float distance = length(lightDir);
    float attenuation = 1.0 / (quadraticCoeff * distance * distance);
    float intensity = lightIntensity * attenuation;

    vec3 baseColor = color[gl_InstanceIndex].xyz;
    vec3 blendedColor = lightColor * baseColor * lightIntensity;
    vec3 diffuse = blendedColor * max(dot(normal.xyz, lightDir), 0.0);
    vec3 ambient = baseColor * ambientCoeff;
    Color = vec4(diffuse + ambient, 1.0);
}
