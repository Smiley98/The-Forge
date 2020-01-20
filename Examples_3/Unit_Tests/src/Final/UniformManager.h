#pragma once
#include "ScreenBufferDef.h"
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"
#include "../../../../Common_3/OS/Math/MathTypes.h"

namespace p2 {
	struct UniformManager :
		public SingletonLocal<UniformManager>
	{
		Buffer* uniformBuffers[IMAGE_COUNT] = { NULL };
		Buffer* uniformBuffersSkybox[IMAGE_COUNT] = { NULL };

		struct UniformBlock {
			mat4 mProjectView;
			//2 planets. I should stop using indices when I make my non-instanced vertex shader.
			mat4 mToWorldMat[2];
			vec4 mColor[2];

			vec3 mLightPosition;
			vec3 mLightColor;
		} uniformData;

		UniformManager();
		~UniformManager();
	};
}
