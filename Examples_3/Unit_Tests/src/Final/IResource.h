#pragma once

namespace p2 {
	struct IResource
	{
		virtual bool Init() { return true; };
		virtual void Exit() {};

		virtual bool Load() { return true; };
		virtual void Unload() {};

		virtual const char* GetName() = 0;
	};

	struct IDynamicResource :
		public IResource
	{
			virtual void Update(float deltaTime) = 0;
	};

	struct IRenderResource :
		public IDynamicResource
	{
		virtual void Draw() = 0;
	};
}
