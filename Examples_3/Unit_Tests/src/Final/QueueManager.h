#pragma once
#include "IResource.h"
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"
#include <memory>

//Should be called CommandManager instead.
namespace p2 {
	struct QueueManager :
		public SingletonLocal<QueueManager>, public IResource
	{
		//Shared
		Renderer* m_renderer;
		//Renderer& m_renderer;

		//Owned
		Queue* m_graphicsQueue = NULL;
		CmdPool* m_commandPool = NULL;
		Cmd** m_commands = NULL;

		//QueueManager(const Renderer& renderer);
		QueueManager();
		~QueueManager();

		bool Init() final;

		void Unload() final;
		void Exit() final;

		const char* GetName() final;
	};
}
