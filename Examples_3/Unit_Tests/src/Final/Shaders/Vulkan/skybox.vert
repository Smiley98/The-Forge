#version 450 core
#define MAX_PLANETS 1

layout(location = 0) in vec4 vs_in_position;

layout (std140, UPDATE_FREQ_PER_FRAME, binding=0) uniform uniformBlock{
	uniform mat4 viewProject;
    uniform mat4 toWorld[MAX_PLANETS];
    uniform vec4 color[MAX_PLANETS];

    // Point Light Information
    uniform vec3 lightPosition;
    uniform vec3 lightColor;
};

out gl_PerVertex
{
  vec4 gl_Position;
};

layout(location = 0) out INVOCATION
{
  vec4 texcoord;
  int side;
} vs_out;


void main(void)
{
    //viewProject should be uploaded such that there isn't a translation.
    gl_Position = viewProject * vec4(vs_in_position.xyz, 1.0);
    
    //We use vertex positions as our texture coordinates since the texture is a cube not a 2d texture.
    vs_out.texcoord = vs_in_position;

    //Indicate which side of the skybox cube we're intersecting.
    vs_out.side = int(vs_in_position.w);
}
