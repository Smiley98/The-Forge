#pragma once
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"

namespace p2 {
	struct RasterManager :
		public SingletonLocal<RasterManager>
	{
		//CCW, LEQUAL, depth writing.
		RasterizerState standard;
		RasterizerState noCullingOrDepth;

		RasterManager();
		~RasterManager();
	};
}
