#version 450 core
#extension GL_GOOGLE_include_directive : require

#include "shading.h"


//layout(location = 0) in vec4 WorldPosition;
//layout(location = 1) in vec4 NormalOut;
//layout(location = 2) in vec4 UV;
//layout (location = 0) in vec4 heatMap;

layout(location = 0) out vec4 FinalColor;

void main()
{
	FinalColor = vec4(lightIndices[0]);
}

//#version 450 core
//#extension GL_GOOGLE_include_directive : require
//#include "shading.h"
//
//
//layout(location = 0) in vec4 heatMap;
//layout(location = 0) out vec4 outColor;
//
//void main() {
//    
//    //outColor = vec4(1.0, 0.0, 0.0, 1.0);
//    outColor = heatMap;
//}