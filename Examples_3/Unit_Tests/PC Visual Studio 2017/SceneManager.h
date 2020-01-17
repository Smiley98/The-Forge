#pragma once
#include "Singleton.h"
namespace p2 {
	class Scene;
	class SceneManager :
		public Singleton<SceneManager>
	{
	public:
		~SceneManager();

		void Update(float deltaTime);
		void Render();

		enum SceneType : unsigned int {
			MENU,
			INSTRUCTION,
			MAIN,
			END,
			NUM_SCENES
		};

		void Change(SceneType sceneType);
		const Scene& GetScene(SceneType sceneType);
		const Scene& GetSceneActive();

	private:
		SceneManager();

		Scene* s_scenes[SceneType::NUM_SCENES];
		Scene* s_sceneActive;
	};
}
