#pragma once
#include "SingletonLocal.h"

namespace p2 {
	struct TextureManager :
		public SingletonLocal<TextureManager>
	{
		TextureManager();
		~TextureManager();
	};
}
