#include "QueueManager.h"
#include "ScreenBufferDef.h"

namespace p2 {
	/*QueueManager::QueueManager(const Renderer& renderer) : m_renderer(const_cast<Renderer&>(renderer))
	{
	}*/

	QueueManager::QueueManager()
	{
	}

	QueueManager::~QueueManager()
	{
	}

	bool QueueManager::Init()
	{
		QueueDesc queueDesc = {};
		queueDesc.mType = CMD_POOL_DIRECT;
		queueDesc.mFlag = QUEUE_FLAG_INIT_MICROPROFILE;
		addQueue(m_renderer, &queueDesc, &m_graphicsQueue);
		addCmdPool(m_renderer, m_graphicsQueue, false, &m_commandPool);
		addCmd_n(m_commandPool, false, IMAGE_COUNT, &m_commands);
		return true;
	}

	void QueueManager::Unload()
	{
		waitQueueIdle(m_graphicsQueue);
	}

	void QueueManager::Exit()
	{
		waitQueueIdle(m_graphicsQueue);
		removeCmd_n(m_commandPool, IMAGE_COUNT, m_commands);
		removeCmdPool(m_renderer, m_commandPool);
		removeQueue(m_graphicsQueue);
	}

	const char* QueueManager::GetName()
	{
		return "QueueManager";
	}
}
