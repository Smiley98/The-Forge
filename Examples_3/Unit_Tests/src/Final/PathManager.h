#pragma once
#include "IResource.h"
#include "SingletonLocal.h"

namespace p2 {
	struct PathManager :
		public SingletonLocal<PathManager>, public IResource
	{
		PathManager();
		~PathManager();

		bool Init() final;
		//bool Load() final;

		//void Unload() final;
		//void Exit() final;

		const char* GetName() final;
	};
}
