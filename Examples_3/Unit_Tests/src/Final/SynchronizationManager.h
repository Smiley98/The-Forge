#pragma once
#include "ScreenBufferDef.h"
#include "IResource.h"
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"

namespace p2 {
	struct SynchronizationManager :
		public SingletonLocal<SynchronizationManager>, public IResource
	{
		//Shared
		Renderer* m_renderer;

		//Owned
		Fence* m_renderCompleteFences[IMAGE_COUNT] = { NULL };
		Semaphore* m_renderCompleteSemaphores[IMAGE_COUNT] = { NULL };
		Semaphore* m_imageAcquiredSemaphore = NULL;
		SwapChain* m_swapChain = NULL;
		RenderTarget* m_depthBuffer = NULL;

		SynchronizationManager();
		~SynchronizationManager();

		bool Init() final;

		void Unload() final;
		void Exit() final;

		const char* GetName() final;
	};
}
