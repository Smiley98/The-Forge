#include "FrustumGrid.h"
#include "../../Common_3/ThirdParty/OpenSource/EASTL/vector.h"
#include "../../Common_3/Renderer/IRenderer.h"

#define GRID_SIZE 32

namespace p2
{
	FrustumGrid::FrustumGrid()
	{
	}
	FrustumGrid::~FrustumGrid()
	{
	}

	Vector4  FrustumGrid::toClipSpace(Vector2 screenSpacePosition, int screenWidth, int screenHeight)
	{
		Vector4 clippy = { (screenSpacePosition[0] / screenWidth) * 2 - 1.0f,	((screenHeight - screenSpacePosition[1]) / screenHeight) * 2 - 1.0f , 1, 1 };
		return clippy;
	}

	void FrustumGrid::computeTiles(float zNear, float zFar, float horizontal_fov, int cameraWidth, int cameraHeight)
	{
		nearPlane = { vec3(0,0,1), zNear };
		farPlane = { vec3(0,0,-1), -zFar };

		mat4 projMat = mat4::perspective(horizontal_fov, (float)cameraHeight / cameraWidth, zNear, zFar);
		mat4 clipToViewSpace = inverse(projMat);
		// create every tile

		numColumns = (int)ceil(cameraWidth / (float)GRID_SIZE);
		numRows = (int)ceil(cameraHeight / (float)GRID_SIZE);
		int numFrustums = numColumns * numRows;

		frustumData = eastl::vector<Frustum>(numFrustums);
		//lightIndices = eastl::vector<int[4]>(numFrustums * MAX_LIGHTS_PER_FRUSTUM);
		lightCounts = eastl::vector<int>(numFrustums);

		// create frustum planes, expressed in view space (before perspective divide)
		for (int col = 0; col < numColumns; col++)
		{
			for (int row = 0; row < numRows; row++)
			{
				// screen space to clip space:
				Vector2 cornerTopLeftScreen = { col * (float)GRID_SIZE,		row * (float)GRID_SIZE };
				Vector2 cornerTopRightScreen = { (col + 1) * (float)GRID_SIZE,	row * (float)GRID_SIZE };
				Vector2 cornerBotLeftScreen = { col * (float)GRID_SIZE,		(row + 1) * (float)GRID_SIZE };
				Vector2 cornerBotRightScreen = { (col + 1) * (float)GRID_SIZE,	(row + 1) * (float)GRID_SIZE };

				// clip space
				Vector4 cornerTopLeftClip = toClipSpace(cornerTopLeftScreen, cameraWidth, cameraHeight);
				Vector4 cornerTopRightClip = toClipSpace(cornerTopRightScreen, cameraWidth, cameraHeight);
				Vector4 cornerBotLeftClip = toClipSpace(cornerBotLeftScreen, cameraWidth, cameraHeight);
				Vector4 cornerBotRightClip = toClipSpace(cornerBotRightScreen, cameraWidth, cameraHeight);

				// view space
				Vector3 cornerTopLeft = (clipToViewSpace * cornerTopLeftClip).getXYZ();
				cornerTopLeft /= cornerTopLeft.getW(); // lol because Vector3 is actually a Vector4 in denial

				Vector3 cornerTopRight = (clipToViewSpace * cornerTopRightClip).getXYZ();
				cornerTopRight /= cornerTopRight.getW();

				Vector3 cornerBotLeft = (clipToViewSpace * cornerBotLeftClip).getXYZ();
				cornerBotLeft /= cornerBotLeft.getW();

				Vector3 cornerBotRight = (clipToViewSpace * cornerBotRightClip).getXYZ();
				cornerBotRight /= cornerBotRight.getW();

				// left plane normal
				Vector3 normal = normalize(cross(cornerTopLeft, cornerBotLeft));
				vec3 nLeft = { normal.getX(), normal.getY(), normal.getZ() };
				//Signed distance of plane from origin to known point that lies on the plane
				float dLeft = dot(normal, cornerTopLeft);

				normal = normalize(cross(cornerBotRight, cornerTopRight));
				vec3 nRight = { normal.getX(), normal.getY(), normal.getZ() };
				float dRight = dot(normal, cornerBotRight);

				normal = normalize(cross(cornerTopRight, cornerTopLeft));
				vec3 nTop = { normal.getX(), normal.getY(), normal.getZ() };
				float dTop = dot(normal, cornerTopRight);

				normal = normalize(cross(cornerBotLeft, cornerBotRight));
				vec3 nBot = { normal.getX(), normal.getY(), normal.getZ() };
				float dBot = dot(normal, cornerBotLeft);

				Frustum subfrustum = {
					Plane{nLeft, dLeft},
					Plane{nRight, dRight},
					Plane{nTop, dTop},
					Plane{nBot, dBot}
				};

				int frustumIndex = toFrustumIndex(col, row);

				frustumData[frustumIndex] = subfrustum;
			}
		}
	}

	inline int FrustumGrid::toFrustumIndex(int column, int row)
	{
		return (row * numColumns) + column;
	}

	//is sphere at least partially contained on the positive side of the plane? 
	//Returns true if sphere is intersecting with or on the positive side of the plane. Returns false if the sphere is entirely on the negative side of the plane
	inline bool isSphereContained(const Plane& plane, const vec3& spherePos, float sphereRadius)
	{
		// signed distance check. ez. dot product
		float distFromPlane = dot(plane.normal, spherePos) - plane.normalOffset; 		
		// is the distance to the plane larger than the radius of the sphere? if the sphere is large enough even though the center is outside the plane, it could still peek into the +ve side
		return (distFromPlane + sphereRadius > 0);
	}

	void FrustumGrid::updateFrustumCulling(const vec4* lightPositions, const float* lightSizes, int numLights, const mat4& viewMatrix)
	{
		/*
		Takes camera, light and frustum uniform blocks
		Converts lights and frustums to viewspace
		Culls lights
		outputs array of light indices for each frustum, up to a max of MAX_LIGHTS_PER_FRUSTUM
		*/

		//CAN AND SHOULD BE PARALLELIZED. DEFINITELY SHOULD BE ON THE GPU but we too stoop fo' dat :/

		eastl::vector<vec3> lightPositionsView = eastl::vector<vec3>(numLights);

		//put lights into view space. can be omitted if passed in view space...
		for (int lightIdx = 0; lightIdx < numLights; lightIdx++)
		{
			lightPositionsView[lightIdx] = (viewMatrix * lightPositions[lightIdx]).getXYZ();
		}

		//for each frustum... 
		for (int frustIdx = 0; frustIdx < frustumData.size(); frustIdx++)
		{
			//does the light fit in this frustum?
			const Frustum& frust = frustumData[frustIdx];

			int numLightsThisFrustum = 0;
			//for each light... 
			for (int lightIdx = 0; lightIdx < numLights; lightIdx++)
			{
				const vec3& lightPosView = lightPositionsView[lightIdx];
				float lightSize = lightSizes[lightIdx];

				//The light must be at least partially contained in all 6 planes of the frustum to count. Else it can be culled
				if (isSphereContained(frust.left, lightPosView, lightSize)
					&& isSphereContained(frust.right, lightPosView, lightSize)
					&& isSphereContained(frust.top, lightPosView, lightSize)
					&& isSphereContained(frust.bottom, lightPosView, lightSize)
					&& isSphereContained(nearPlane, lightPosView, lightSize)
					&& isSphereContained(farPlane, lightPosView, lightSize)
					)
				{
					lightIndices[(frustIdx * MAX_LIGHTS_PER_FRUSTUM + numLightsThisFrustum)].a = lightIdx;
					numLightsThisFrustum++;
				}
				else
				{
					continue;
				}

				//if too many lights in this frustum then staahp
				if (numLightsThisFrustum == MAX_LIGHTS_PER_FRUSTUM)
				{
					break;
				}
			}

			//report how many lights are contained
			//lightCounts[frustIdx] = numLightsThisFrustum;

			// fill last light index with -1 to indicate no more lights
			if (numLightsThisFrustum != MAX_LIGHTS_PER_FRUSTUM)
			{
				lightIndices[(frustIdx * MAX_LIGHTS_PER_FRUSTUM + numLightsThisFrustum)].a = -1;
			}
		}
	}
}


#undef GRID_SIZE