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

	//FrustumGrid* p2::FrustumGrid::instance()
	//{
	//	if (myInstance == nullptr)
	//	{
	//		myInstance = new FrustumGrid();
	//	}
	//	return FrustumGrid::myInstance;
	//}

	//Vector4  FrustumGrid::toViewSpace(Vector2 screenSpacePosition, int screenWidth, int screenHeight)
	//{
	//	Vector3 ret = (clipToViewSpace * toClipSpace(screenSpacePosition, screenWidth, screenHeight)).getXYZ();
	//	ret /= ret.getW(); // lol because Vector3 is actually a Vector4 in denial
	//}

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
		lightIndices = eastl::vector<int[MAX_LIGHTS_PER_FRUSTUM]>(numFrustums);
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

				//Vector4 cornerTopLeft = { col * (float)GRID_SIZE / cameraWidth,			row * (float)GRID_SIZE / cameraHeight,			1, 1 };
				//
				//// view space
				//cornerTopLeft = cornerTopLeft * clipToViewSpace;
				//
				//Vector4 cornerTopRight = { (col + 1) * (float)GRID_SIZE / cameraWidth,	row * (float)GRID_SIZE / cameraHeight,			1, 1 };
				//Vector4 cornerBotLeft = { col * (float)GRID_SIZE / cameraWidth,			(row + 1) * (float)GRID_SIZE / cameraHeight,		1, 1 };
				//Vector4 cornerBotRight = { (col + 1) * (float)GRID_SIZE / cameraWidth,	(row + 1) * (float)GRID_SIZE / cameraHeight,		1,1 };

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

		//frustumBufferLoadDesc = {};
		//frustumBufferLoadDesc.mDesc.mDescriptors = DESCRIPTOR_TYPE_BUFFER; // only need to read from it
		//frustumBufferLoadDesc.mDesc.mMemoryUsage = RESOURCE_MEMORY_USAGE_GPU_ONLY;
		//frustumBufferLoadDesc.mDesc.mSize = sizeof(Frustum) * frustumData.size();
		//frustumBufferLoadDesc.mDesc.mStructStride = sizeof(Frustum);
		//frustumBufferLoadDesc.pData = frustumData.data();
		//frustumBufferLoadDesc.ppBuffer = &frustumBuffer;
		//addResource(&frustumBufferLoadDesc); // to the GPU!


		//frustumBufferUpdateDesc = { frustumBuffer, tempVertexBuffer.data() };
		//particleBufferUpdateDesc.mSize = sizeof(Vertex) * 6 * pParticleSystem->mLifeParticleCount;
		//updateResource(&particleBufferUpdateDesc);


		//pCameraController->update(deltaTime);
		//mat4        viewMat = pCameraController->getViewMatrix();
		//const float aspectInverse = (float)mSettings.mHeight / (float)mSettings.mWidth;
		//const float horizontal_fov = PI / 2.0f;
		//mat4        projMat = mat4::perspective(horizontal_fov, aspectInverse, zNear, zFar);    //view matrix
		//vec3        camPos = pCameraController->getViewPosition();
		//mat4        vpMatrix = projMat * viewMat;
		///************************************************************************/
		//// Light Update
		///************************************************************************/
		//const float lightZNear = -100.0f;
		//const float lightZFar = 100.0f;
		//vec3 lightPos = vec3(gLightCpuSettings.mLightPosition.x, gLightCpuSettings.mLightPosition.y, gLightCpuSettings.mLightPosition.z);
		//vec3 lightDir = normalize(gObjectsCenter - lightPos);
		//pLightView->moveTo(lightDir * lightZNear);
		//pLightView->lookAt(gObjectsCenter);
		//mat4 lightViewMat = pLightView->getViewMatrix();
		//mat4 lightProjMat = mat4::orthographic(-50.0f, 50.0f, -50.0f, 50.0f, 0.0f, lightZFar - lightZNear);
		//mat4 lightVPMatrix = lightProjMat * lightViewMat;
		///************************************************************************/
		//// Scene Update
		///************************************************************************/
		//UpdateScene(deltaTime, viewMat, camPos);
		///************************************************************************/
		//// Update Cameras
		///************************************************************************/
		//gCameraUniformData.mViewProject = vpMatrix;
		//gCameraUniformData.mViewMat = viewMat;
		//gCameraUniformData.mClipInfo = vec4(zNear * zFar, zNear - zFar, zFar, 0.0f);
		//gCameraUniformData.mPosition = vec4(pCameraController->getViewPosition(), 1);

		//gCameraLightUniformData.mViewProject = lightVPMatrix;
		//gCameraLightUniformData.mViewMat = lightViewMat;
		//gCameraLightUniformData.mClipInfo = vec4(lightZNear * lightZFar, lightZNear - lightZFar, lightZFar, 0.0f);
		//gCameraLightUniformData.mPosition = vec4(lightPos, 1);


	}

	inline int FrustumGrid::toFrustumIndex(int column, int row)
	{
		return (row * numColumns) + column;
	}

	//is sphere at least partially contained on the positive side of the plane? 
	//Returns true if sphere is intersecting with or on the positive side of the plane. Returns false if the sphere is entirely on the negative side of the plane
	inline bool isSphereContained(Plane plane, vec3 spherePos, float sphereRadius)
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
			Frustum frust = frustumData[frustIdx];


			int numLightsThisFrustum = 0;
			//for each light... 
			for (int lightIdx = 0; lightIdx < numLights; lightIdx++)
			{
				vec3 lightPosView = lightPositionsView[lightIdx];
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
					numLightsThisFrustum++;
					lightIndices[frustIdx][numLightsThisFrustum] = lightIdx;
				}

				//if too many lights in this frustum then staahp
				if (numLightsThisFrustum == MAX_LIGHTS_PER_FRUSTUM)
				{
					break;
				}
			}

			//report how many lights are contained
			lightCounts[frustIdx] = numLightsThisFrustum;

			// fill remaining light indices with -1 to indicate no light
			for (int i = numLightsThisFrustum; i < MAX_LIGHTS_PER_FRUSTUM; i++)
			{
				lightIndices[frustIdx][numLightsThisFrustum] = -1;
			}
		}
	}
}


#undef GRID_SIZE