#pragma once
#include "ScreenBufferDef.h"
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"

namespace p2 {
	struct SynchronizationManager :
		public SingletonLocal<SynchronizationManager>
	{
		Fence* renderCompleteFences[IMAGE_COUNT] = { NULL };
		Semaphore* renderCompleteSemaphores[IMAGE_COUNT] = { NULL };
		Semaphore* imageAcquiredSemaphore = NULL;
		SwapChain* swapChain = NULL;
		RenderTarget* depthBuffer = NULL;

		SynchronizationManager();
		~SynchronizationManager();
	};
}
