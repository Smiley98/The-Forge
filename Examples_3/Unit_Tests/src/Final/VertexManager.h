#pragma once
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"

namespace p2 {
	struct VertexManager :
		public SingletonLocal<VertexManager>
	{
		Buffer* cubeVertexData;
		Buffer* sphereVertexData;
		Buffer* skyboxVertexData;

		VertexLayout cubeVertexLayout;
		VertexLayout sphereVertexLayout;
		VertexLayout skyboxVertexLayout;

		VertexManager();
		~VertexManager();
	};
}
