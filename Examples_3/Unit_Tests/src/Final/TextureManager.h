#pragma once
#include "IResource.h"
#include "SingletonLocal.h"

namespace p2 {
	struct TextureManager :
		public SingletonLocal<TextureManager>, public IResource
	{
		const char* GetName() final;

		TextureManager();
		~TextureManager();
	};
}
