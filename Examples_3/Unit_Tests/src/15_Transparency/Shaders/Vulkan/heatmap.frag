#version 450 core
#extension GL_GOOGLE_include_directive : require

#include "shading.h"

uint GRID_SIZE = 32;
const float screenWidth =  1920.0;
const float screenHeight = 1080.0;
highp uint numColumns = uint(screenWidth / float(GRID_SIZE) + 0.5);	    //60
highp uint numRows = uint(screenHeight / float(GRID_SIZE) + 0.5);		//34

uint getFrustumIndex()
{
    uint col = uint(gl_FragCoord.x / GRID_SIZE);
    uint row = uint(gl_FragCoord.y / GRID_SIZE);
    return (row * numColumns) + col;
}

layout(location = 0) out vec4 FinalColor;

void main() {
    uint frustumIndex = getFrustumIndex();
	vec4 lightCountColor = mix(vec4(0, 1, 0, 1), vec4(1, 0, 0, 1), float(lightCounts[frustumIndex].x) / float(MAX_LIGHTS_PER_FRUSTUM));
    //vec4 lightCountColor = vec4(0, 1, 0, 0);
	FinalColor = lightCountColor;
}