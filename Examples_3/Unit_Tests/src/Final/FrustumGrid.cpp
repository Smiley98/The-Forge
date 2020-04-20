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

	Vector4 toClipSpace(Vector2 screenSpacePosition, int screenWidth, int screenHeight)
	{
		Vector4 clippy = { (screenSpacePosition[0] / screenWidth) * 2 - 1.0f,	((screenHeight-screenSpacePosition[1]) / screenHeight) * 2 - 1.0f , 1, 1 };
		return clippy;
	}

	void FrustumGrid::updateTiles(float zNear, float zFar, float horizontal_fov, int cameraWidth, int cameraHeight)
	{
		mat4 projMat = mat4::perspective(horizontal_fov, (float)cameraHeight / cameraWidth, zNear, zFar);
		mat4 clipToViewSpace = inverse(projMat);
		// create every tile

		numColumns = (int)ceil(cameraWidth / (float)GRID_SIZE);
		numRows = (int)ceil(cameraHeight / (float)GRID_SIZE);

		eastl::vector<Frustum> frustumData = eastl::vector<Frustum>(numColumns * numRows);
		//frustumData.reserve(numColumns * numRows);

		// create frustum planes, expressed in view space (before perspective divide)
		for (int col = 0; col < numColumns; col++)
		{
			for (int row = 0; row < numRows; row++)
			{
				// screen space to clip space:
				Vector2 cornerTopLeftScreen =	{ col * (float)GRID_SIZE,		row * (float)GRID_SIZE };
				Vector2 cornerTopRightScreen =	{ (col + 1) * (float)GRID_SIZE,	row * (float)GRID_SIZE };
				Vector2 cornerBotLeftScreen =	{ col * (float)GRID_SIZE,		(row + 1) * (float)GRID_SIZE };
				Vector2 cornerBotRightScreen =	{ (col + 1) * (float)GRID_SIZE,	(row + 1) * (float)GRID_SIZE };

				// clip space
				Vector4 cornerTopLeftClip =	toClipSpace(cornerTopLeftScreen	, cameraWidth, cameraHeight);
				Vector4 cornerTopRightClip =toClipSpace(cornerTopRightScreen, cameraWidth, cameraHeight);
				Vector4 cornerBotLeftClip = toClipSpace(cornerBotLeftScreen	, cameraWidth, cameraHeight);
				Vector4 cornerBotRightClip =toClipSpace(cornerBotRightScreen, cameraWidth, cameraHeight);


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
				float3 nLeft = { normal.getX(), normal.getY(), normal.getZ() };

				normal = normalize(cross(cornerBotRight, cornerTopRight));
				float3 nRight = { normal.getX(), normal.getY(), normal.getZ() };

				normal = normalize(cross(cornerTopRight, cornerTopLeft));
				float3 nTop = { normal.getX(), normal.getY(), normal.getZ() };

				normal = normalize(cross(cornerBotLeft, cornerBotRight));
				float3 nBot = { normal.getX(), normal.getY(), normal.getZ() };

				Frustum subfrustum = { nLeft, nRight, nTop, nBot };
				frustumData[(row * numColumns) + col] = subfrustum;
			}
		}

		frustumBufferLoadDesc = {};
		frustumBufferLoadDesc.mDesc.mDescriptors = DESCRIPTOR_TYPE_BUFFER; // only need to read from it
		frustumBufferLoadDesc.mDesc.mMemoryUsage = RESOURCE_MEMORY_USAGE_GPU_ONLY;
		frustumBufferLoadDesc.mDesc.mSize = sizeof(Frustum) * frustumData.size();
		frustumBufferLoadDesc.mDesc.mStructStride = sizeof(Frustum);
		frustumBufferLoadDesc.pData = frustumData.data();
		frustumBufferLoadDesc.ppBuffer = &frustumBuffer;
		addResource(&frustumBufferLoadDesc); // to the GPU!


		//frustumBufferUpdateDesc = { frustumBuffer, tempVertexBuffer.data() };
		//particleBufferUpdateDesc.mSize = sizeof(Vertex) * 6 * pParticleSystem->mLifeParticleCount;
		//updateResource(&particleBufferUpdateDesc);

		// Sphere-plane check
		//vec3 proj = project(sphere.pos onto plane)
		//vec3 planespace = sphere.pos - proj
		//float dist = dot(planespace, plane.normal)
		//return dist > sphere.r (if true, then we are on the +ve side of the plane)
		//


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
}


#undef GRID_SIZE