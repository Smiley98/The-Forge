#version 450 core

layout (std140, UPDATE_FREQ_PER_FRAME, binding=0) uniform uniformBlock {
    uniform mat4 viewProject;
    uniform vec4 color;
};

layout(location = 0) out vec4 outColor;

void main ()
{
	outColor = color;
}
