#pragma once
#include "IResource.h"
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"

namespace p2 {
	struct VertexManager :
		public SingletonLocal<VertexManager>, public IResource
	{
		//Shared

		//Owned
		Buffer* m_cubeVertexBuffer;
		Buffer* m_sphereVertexBuffer;
		Buffer* m_skyboxVertexBuffer;

		VertexLayout m_cubeVertexLayout;
		VertexLayout m_sphereVertexLayout;
		VertexLayout m_skyboxVertexLayout;

		uint32_t m_cubeVertexCount;
		uint32_t m_skyboxVertexCount;
		uint32_t m_sphereVertexCount;

		bool Init() final;
		void Exit() final;

		const char* GetName() final;

		VertexManager();
		~VertexManager();

	private:
		void initCube();
		void initSphere();
		void initSkybox();
	};
}
