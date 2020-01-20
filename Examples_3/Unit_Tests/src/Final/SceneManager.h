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
			//MENU,
			//INSTRUCTION,
			MAIN,
			//END,
			SIZE
		};

		void Change(SceneType sceneType);

		//Honestly these shouldn't exist. There's shouldn't be any reason to externally get/set a scene.
		//Scenes should be well-defined upon initialization.
		//const Scene& GetScene(SceneType sceneType);
		//const Scene& GetSceneActive();

	private:
		SceneManager();

		Scene* s_scenes[SceneType::SIZE];
		Scene* s_sceneActive;
	};
}
 