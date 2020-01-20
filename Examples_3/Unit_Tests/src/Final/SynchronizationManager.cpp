#include "SynchronizationManager.h"
namespace p2 {

	SynchronizationManager::SynchronizationManager()
	{
	}

	SynchronizationManager::~SynchronizationManager()
	{
	}

	bool SynchronizationManager::Init()
	{
		for (uint32_t i = 0; i < IMAGE_COUNT; ++i)
		{
			addFence(m_renderer, &m_renderCompleteFences[i]);
			addSemaphore(m_renderer, &m_renderCompleteSemaphores[i]);
		}
		addSemaphore(m_renderer, &m_imageAcquiredSemaphore);
		return true;
	}

	void SynchronizationManager::Unload()
	{
		removeSwapChain(m_renderer, m_swapChain);
		removeRenderTarget(m_renderer, m_depthBuffer);
	}

	void SynchronizationManager::Exit()
	{
		for (uint32_t i = 0; i < IMAGE_COUNT; ++i)
		{
			removeFence(m_renderer, m_renderCompleteFences[i]);
			removeSemaphore(m_renderer, m_renderCompleteSemaphores[i]);
		}
		removeSemaphore(m_renderer, m_imageAcquiredSemaphore);
	}

	const char* SynchronizationManager::GetName()
	{
		return "SynchronizationManager";
	}
}