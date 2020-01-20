#pragma once
#include "IResource.h"
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"

namespace p2 {
	struct RasterManager :
		public SingletonLocal<RasterManager>, public IResource
	{
		//Shared
		Renderer* m_renderer;

		//Owned
		RasterizerState* m_cullBoth;
		RasterizerState* m_cullFront;
		RasterizerState* m_cullBack;
		RasterizerState* m_cullNone;
		DepthState* m_depth;

		bool Init() final;
		void Exit() final;
		const char* GetName() final;

		RasterManager();
		~RasterManager();
	};
}
