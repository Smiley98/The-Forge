#pragma once
//Math
#include "../../Common_3/OS/Math/MathTypes.h"
#include "../../Common_3/Renderer/ResourceLoader.h"

struct Buffer;

namespace p2
{
	//struct Plane
	//{
	//	float3 normal;   // Plane normal.
	//	float  distance;   // Distance to origin.
	//};

	struct Frustum
	{
		// normals
		float3 left;
		float3 right;
		float3 top;
		float3 bottom;

		//Plane left;
		//Plane right;
		//Plane top;
		//Plane bottom;
	};


	class FrustumGrid
	{
	public:
		FrustumGrid();
		~FrustumGrid();
		
		//static FrustumGrid* myInstance;

		//screen to view

		int numRows;
		int numColumns;
		//static FrustumGrid* instance();
		void updateTiles(float zNear = 1.0f, float zFar = 4000.0f, float horizontal_fov = 3.14159 / 2.0f, int cameraWidth = 1920, int cameraHeight = 1080);
		Buffer* frustumBuffer;
		BufferLoadDesc frustumBufferLoadDesc;
		//BufferUpdateDesc frustumBufferUpdateDesc;
	};
}
