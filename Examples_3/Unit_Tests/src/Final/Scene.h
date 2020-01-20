#pragma once
namespace p2 {
	class SceneManager;
	class Scene abstract
	{
		friend SceneManager;
	public:
		Scene() {}
		virtual ~Scene() {}

		virtual void Update(float deltaTime) = 0;
		virtual void Render() = 0;

	protected:
		virtual void OnEnter() {}
		virtual void OnExit() {}
	};
}
