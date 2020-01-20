#pragma once
#include "IResource.h"
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"

namespace p2 {
	struct VertexManager :
		public SingletonLocal<VertexManager>, public IResource
	{
		Buffer* cubeVertexData;
		Buffer* sphereVertexData;
		Buffer* skyboxVertexData;

		VertexLayout cubeVertexLayout;
		VertexLayout sphereVertexLayout;
		VertexLayout skyboxVertexLayout;

		const char* GetName() final;

		VertexManager();
		~VertexManager();
	};
}
