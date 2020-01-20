#pragma once
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"

namespace p2 {
	struct QueueManager :
		public SingletonLocal<QueueManager>
	{
		Queue* graphicsQueue = NULL;
		CmdPool* cmdPool = NULL;
		Cmd** cmds = NULL;

		QueueManager();
		~QueueManager();
	};
}
