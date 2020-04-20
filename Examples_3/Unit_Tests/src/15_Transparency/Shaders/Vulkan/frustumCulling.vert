/*
Takes camera, light and frustum uniform blocks
Converts lights and frustums to viewspace
Converts lights further from viewspace to frustum-space (expressed relative to the frustum)
lights go world->view->frustum
Culls lights
outputs array of light indices for each frustum, up to a max of MAX_LIGHTS_PER_FRUSTUM
*/

#version 450 core

layout (location = 0) in vec4 PositionIn;

const int MAX_LIGHTS_PER_FRUSTUM = 8;
layout (location = 0) out int[MAX_LIGHTS_PER_FRUSTUM] lightIndices;

struct Frustum(
	vec3 left;
	vec3 right;
	vec3 top;
	vec3 bottom;
};

//Hardcoded top left frustum as an example
const Frustum myFrust = {vec3{0.707, 0, 0.707}, vec3(-0.707, 0, -0.695), vec3(0.0, -0.8764, 0.481), vec3(0.0, 0.8886, -0.4586)}

// Takes Frustum planes, position of top left of frustum on the screen (in screen space), light position, and light range
// returns T if light is partially contained in frustum, F if not
bool lightCulling = {float near, float far, Frustum frust, vec2 frustumPos, vec3 lightPos, float lightRange}
	{
		//Convert light to view space
	}


void main()
{
	uint instanceID = gl_InstanceIndex + DrawInfoRootConstant.baseInstance;
	UV = UVIn.xyyy;
	
	NormalOut = normalize(objectInfo[instanceID].normalMat * vec4(NormalIn.xyz, 0));
	WorldPosition = objectInfo[instanceID].toWorld * PositionIn;
	gl_Position = camViewProj * WorldPosition;
	MatID = objectInfo[instanceID].matID;
}
