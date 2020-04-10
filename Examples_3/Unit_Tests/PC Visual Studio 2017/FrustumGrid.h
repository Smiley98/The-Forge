#pragma once
//Math
#include "../../../Common_3/OS/Math/MathTypes.h"

#include "../../../Common_3/ThirdParty/OpenSource/EASTL/vector.h"

#include "../../../Common_3/Renderer/IRenderer.h"
#include "../../../Common_3/Renderer/ResourceLoader.h"

namespace p2
{
	struct Plane
	{
		float3 normal;   // Plane normal.
		float  distance;   // Distance to origin.
	};

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
	private:
		FrustumGrid();
		static FrustumGrid* myInstance;

		int numRows;
		int numColumns;

	public:
		FrustumGrid& instance();
		void updateTiles(float zNear = 1.0f, float zFar = 4000.0f, float horizontal_fov = 3.14159 / 2.0f, float aspectWidth = 1920, float aspectHeight = 1080);
		Buffer* frustumBuffer;
		BufferLoadDesc frustumBufferLoadDesc;
		//BufferUpdateDesc frustumBufferUpdateDesc; // dont need this because its constant?
	};
}
