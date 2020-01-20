#include "VertexManager.h"
#include "../../../../Common_3/Renderer/ResourceLoader.h"

namespace p2 {
	bool VertexManager::Init()
	{
		initSphere();
		initCube();
		initSkybox();
		return true;
	}

	void VertexManager::Exit()
	{
		removeResource(m_cubeVertexBuffer);
		removeResource(m_sphereVertexBuffer);
		removeResource(m_skyboxVertexBuffer);
	}

	const char* VertexManager::GetName()
	{
		return "VertexManager";
	}

	VertexManager::VertexManager()
	{
	}

	VertexManager::~VertexManager()
	{
	}

	void VertexManager::initCube()
	{
		int numberOfCubeAttributes;
		float* pCubePoints;
		generateCuboidPoints(&pCubePoints, &numberOfCubeAttributes);
		uint64_t cubeDataSize = numberOfCubeAttributes * sizeof(float);
		BufferLoadDesc cubeVbDesc = {};
		cubeVbDesc.mDesc.mDescriptors = DESCRIPTOR_TYPE_VERTEX_BUFFER;
		cubeVbDesc.mDesc.mMemoryUsage = RESOURCE_MEMORY_USAGE_GPU_ONLY;
		cubeVbDesc.mDesc.mSize = cubeDataSize;
		cubeVbDesc.mDesc.mVertexStride = sizeof(float) * 6;
		cubeVbDesc.pData = pCubePoints;
		cubeVbDesc.ppBuffer = &m_cubeVertexBuffer;
		addResource(&cubeVbDesc);
		conf_free(pCubePoints);

		m_cubeVertexLayout.mAttribCount = 2;
		m_cubeVertexLayout.mAttribs[0].mSemantic = SEMANTIC_POSITION;
		m_cubeVertexLayout.mAttribs[0].mFormat = TinyImageFormat_R32G32B32_SFLOAT;
		m_cubeVertexLayout.mAttribs[0].mBinding = 0;
		m_cubeVertexLayout.mAttribs[0].mLocation = 0;
		m_cubeVertexLayout.mAttribs[0].mOffset = 0;
		m_cubeVertexLayout.mAttribs[1].mSemantic = SEMANTIC_NORMAL;
		m_cubeVertexLayout.mAttribs[1].mFormat = TinyImageFormat_R32G32B32_SFLOAT;
		m_cubeVertexLayout.mAttribs[1].mBinding = 0;
		m_cubeVertexLayout.mAttribs[1].mLocation = 1;
		m_cubeVertexLayout.mAttribs[1].mOffset = 3 * sizeof(float);

		m_cubeVertexCount = numberOfCubeAttributes / (m_cubeVertexLayout.mAttribCount * 3);
	}

	void VertexManager::initSphere()
	{
		int numberOfSphereAttributes;
		float* pSpherePoints;
		generateSpherePoints(&pSpherePoints, &numberOfSphereAttributes, 10, 5.0f);
		uint64_t sphereDataSize = numberOfSphereAttributes * sizeof(float);
		BufferLoadDesc sphereVbDesc = {};
		sphereVbDesc.mDesc.mDescriptors = DESCRIPTOR_TYPE_VERTEX_BUFFER;
		sphereVbDesc.mDesc.mMemoryUsage = RESOURCE_MEMORY_USAGE_GPU_ONLY;
		sphereVbDesc.mDesc.mSize = sphereDataSize;
		sphereVbDesc.mDesc.mVertexStride = sizeof(float) * 6;
		sphereVbDesc.pData = pSpherePoints;
		sphereVbDesc.ppBuffer = &m_sphereVertexBuffer;
		addResource(&sphereVbDesc);
		conf_free(pSpherePoints);

		m_sphereVertexLayout.mAttribCount = 2;
		m_sphereVertexLayout.mAttribs[0].mSemantic = SEMANTIC_POSITION;
		m_sphereVertexLayout.mAttribs[0].mFormat = TinyImageFormat_R32G32B32_SFLOAT;
		m_sphereVertexLayout.mAttribs[0].mBinding = 0;
		m_sphereVertexLayout.mAttribs[0].mLocation = 0;
		m_sphereVertexLayout.mAttribs[0].mOffset = 0;
		m_sphereVertexLayout.mAttribs[1].mSemantic = SEMANTIC_NORMAL;
		m_sphereVertexLayout.mAttribs[1].mFormat = TinyImageFormat_R32G32B32_SFLOAT;
		m_sphereVertexLayout.mAttribs[1].mBinding = 0;
		m_sphereVertexLayout.mAttribs[1].mLocation = 1;
		m_sphereVertexLayout.mAttribs[1].mOffset = 3 * sizeof(float);

		m_sphereVertexCount = numberOfSphereAttributes / 6;
	}

	void VertexManager::initSkybox()
	{
		//Generate sky box vertex buffer
		float skyBoxPoints[] = {
			10.0f,  -10.0f, -10.0f, 6.0f,    // -z
			-10.0f, -10.0f, -10.0f, 6.0f,   -10.0f, 10.0f,  -10.0f, 6.0f,   -10.0f, 10.0f,
			-10.0f, 6.0f,   10.0f,  10.0f,  -10.0f, 6.0f,   10.0f,  -10.0f, -10.0f, 6.0f,

			-10.0f, -10.0f, 10.0f,  2.0f,    //-x
			-10.0f, -10.0f, -10.0f, 2.0f,   -10.0f, 10.0f,  -10.0f, 2.0f,   -10.0f, 10.0f,
			-10.0f, 2.0f,   -10.0f, 10.0f,  10.0f,  2.0f,   -10.0f, -10.0f, 10.0f,  2.0f,

			10.0f,  -10.0f, -10.0f, 1.0f,    //+x
			10.0f,  -10.0f, 10.0f,  1.0f,   10.0f,  10.0f,  10.0f,  1.0f,   10.0f,  10.0f,
			10.0f,  1.0f,   10.0f,  10.0f,  -10.0f, 1.0f,   10.0f,  -10.0f, -10.0f, 1.0f,

			-10.0f, -10.0f, 10.0f,  5.0f,    // +z
			-10.0f, 10.0f,  10.0f,  5.0f,   10.0f,  10.0f,  10.0f,  5.0f,   10.0f,  10.0f,
			10.0f,  5.0f,   10.0f,  -10.0f, 10.0f,  5.0f,   -10.0f, -10.0f, 10.0f,  5.0f,

			-10.0f, 10.0f,  -10.0f, 3.0f,    //+y
			10.0f,  10.0f,  -10.0f, 3.0f,   10.0f,  10.0f,  10.0f,  3.0f,   10.0f,  10.0f,
			10.0f,  3.0f,   -10.0f, 10.0f,  10.0f,  3.0f,   -10.0f, 10.0f,  -10.0f, 3.0f,

			10.0f,  -10.0f, 10.0f,  4.0f,    //-y
			10.0f,  -10.0f, -10.0f, 4.0f,   -10.0f, -10.0f, -10.0f, 4.0f,   -10.0f, -10.0f,
			-10.0f, 4.0f,   -10.0f, -10.0f, 10.0f,  4.0f,   10.0f,  -10.0f, 10.0f,  4.0f,
		};

		uint64_t       skyBoxDataSize = 4 * 6 * 6 * sizeof(float);
		BufferLoadDesc skyboxVbDesc = {};
		skyboxVbDesc.mDesc.mDescriptors = DESCRIPTOR_TYPE_VERTEX_BUFFER;
		skyboxVbDesc.mDesc.mMemoryUsage = RESOURCE_MEMORY_USAGE_GPU_ONLY;
		skyboxVbDesc.mDesc.mSize = skyBoxDataSize;
		skyboxVbDesc.mDesc.mVertexStride = sizeof(float) * 4;
		skyboxVbDesc.pData = skyBoxPoints;
		skyboxVbDesc.ppBuffer = &m_skyboxVertexBuffer;
		addResource(&skyboxVbDesc);

		m_skyboxVertexLayout.mAttribCount = 1;
		m_skyboxVertexLayout.mAttribs[0].mSemantic = SEMANTIC_POSITION;
		m_skyboxVertexLayout.mAttribs[0].mFormat = TinyImageFormat_R32G32B32A32_SFLOAT;
		m_skyboxVertexLayout.mAttribs[0].mBinding = 0;
		m_skyboxVertexLayout.mAttribs[0].mLocation = 0;
		m_skyboxVertexLayout.mAttribs[0].mOffset = 0;

		m_skyboxVertexCount = 36;
	}
}
