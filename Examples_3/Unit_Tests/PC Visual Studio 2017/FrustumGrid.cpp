#include "../src/Final/FrustumGrid.h"

#define FRUSTUM_GRID_SIZE 256

namespace p2
{

	FrustumGrid& p2::FrustumGrid::instance()
	{
		if (myInstance == nullptr)
		{
			myInstance = new FrustumGrid();
		}
		return *FrustumGrid::myInstance;
	}

	void FrustumGrid::updateTiles(float zNear, float zFar, float horizontal_fov, float cameraWidth, float cameraHeight)
	{
		float zDist = zFar - zNear;
		float3 eyePos = { 0,0,0 };
		// create every tile

		numColumns = ceil(cameraWidth / FRUSTUM_GRID_SIZE);
		numRows = ceil(cameraHeight / FRUSTUM_GRID_SIZE);

		eastl::vector<Frustum> frustumData = eastl::vector<Frustum>(numColumns * numRows);
		//frustumData.reserve(numColumns * numRows);

		// create frustum planes, expressed in camera space (before perspective divide to clip space)
		for (int col = 0; col < numColumns; col++)
		{
			for (int row = 0; row < numColumns; row++)
			{
				Vector3 cornerTopLeft = { (float)col * FRUSTUM_GRID_SIZE, (float)row * FRUSTUM_GRID_SIZE, zFar };
				Vector3 cornerTopRight = { (float)(col * FRUSTUM_GRID_SIZE) + FRUSTUM_GRID_SIZE, (float)row * FRUSTUM_GRID_SIZE, zFar };
				Vector3 cornerBotLeft = { (float)col * FRUSTUM_GRID_SIZE, (float)(row * FRUSTUM_GRID_SIZE) + FRUSTUM_GRID_SIZE, zFar };
				Vector3 cornerBotRight = { (float)(col * FRUSTUM_GRID_SIZE) + FRUSTUM_GRID_SIZE, (float)(row * FRUSTUM_GRID_SIZE) + FRUSTUM_GRID_SIZE, zFar };

				// left plane normal
				Vector3 normal = normalize(cross(cornerBotLeft, cornerTopLeft));
				float3 nLeft = { normal.getX(), normal.getY(), normal.getZ() };

				normal = normalize(cross(cornerBotLeft, cornerTopLeft));
				float3 nRight = { normal.getX(), normal.getY(), normal.getZ() };

				normal = normalize(cross(cornerBotLeft, cornerTopLeft));
				float3 nTop = { normal.getX(), normal.getY(), normal.getZ() };

				normal = normalize(cross(cornerBotLeft, cornerTopLeft));
				float3 nBot = { normal.getX(), normal.getY(), normal.getZ() };

				Frustum subfrustum = { nLeft, nRight, nTop, nBot};
				frustumData.push_back(subfrustum);
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