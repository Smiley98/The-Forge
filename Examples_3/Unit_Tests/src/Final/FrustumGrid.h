#pragma once
//Math
#include "../../Common_3/OS/Math/MathTypes.h"
#include "../../Common_3/Renderer/ResourceLoader.h"
#include "../../Common_3/ThirdParty/OpenSource/EASTL/vector.h"

#define MAX_LIGHTS_PER_FRUSTUM 64

struct Buffer;
struct LightUniformBlock;
struct CameraUniform;

namespace p2
{

	//stored in constant-normal form
	struct Plane
	{
		vec3 normal;			// Plane normal.
		float normalOffset;		// Distance along the plane normal to translate from the origin.
	};

	struct Frustum //actually missing near and far, but those can be shared
	{
		// frustum planes, expressed in view space
		Plane left;
		Plane right;
		Plane top;
		Plane bottom;
	};

	class FrustumGrid
	{
	public:
		// for each frustum, an array of light indices
		eastl::vector<int> lightIndices;
		eastl::vector<int> lightCounts;

		FrustumGrid();
		~FrustumGrid();

		// updated once for camera changes
		void computeTiles(float zNear = 1.0f, float zFar = 4000.0f, float horizontal_fov = 3.14159 / 2.0f, int cameraWidth = 1920, int cameraHeight = 1080);
		
		// every frame, perform light-frustum culling and update lightCounts and lightIndices
		void updateFrustumCulling(const vec4* lightPositions, const float* lightSizes, int numLights, const mat4& viewMatrix);

		inline int toFrustumIndex(int column, int row);

	private:
		Vector4 toClipSpace(Vector2 screenSpacePosition, int screenWidth, int screenHeight);
		//Vector4 toViewSpace(Vector2 screenSpacePosition, int screenWidth, int screenHeight);
		
		eastl::vector<Frustum> frustumData;
		int numRows;
		int numColumns;

		// shared between all sub-frustums
		Plane nearPlane;
		Plane farPlane;
	};
}
