#version 450 core
#extension GL_GOOGLE_include_directive : require

#include "shaderDefs.h"

//layout (location = 0) in vec4 PositionIn;
//layout (location = 1) in vec3 NormalIn;
//layout (location = 2) in vec2 UVIn;

//layout (location = 0) out vec4 WorldPosition;
//layout (location = 1) out vec4 NormalOut;
//layout (location = 2) out vec4 UV;

//layout (location = 0) out vec4 heatMap;

void main()
{
	//uint instanceID = gl_InstanceIndex + DrawInfoRootConstant.baseInstance;
	//UV = UVIn.xyyy;
	//NormalOut = normalize(objectInfo[instanceID].normalMat * vec4(NormalIn.xyz, 0));
	//WorldPosition = objectInfo[instanceID].toWorld * PositionIn;
	//gl_Position = camViewProj * WorldPosition;
	
	//heatMap = testData;
}


//#version 450 core
//#extension GL_GOOGLE_include_directive : require
//#include "shaderDefs.h"
//
//layout (location = 0) out vec4 heatMap;
//
//out gl_PerVertex
//{
//    vec4 gl_Position;
//};
//
//vec2 positions[3] = vec2[](
//    vec2(-1.0,  1.0),
//    vec2(-1.0, -3.0),
//    vec2( 3.0,  1.0)
//);
//
//void main()
//{
//   gl_Position = vec4(positions[gl_VertexIndex], 0.0, 1.0);
//}