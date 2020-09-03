#pragma once
#include "SingletonLocal.h"
namespace p2 {
	class Scene;
	class SceneManager :
		public SingletonLocal<SceneManager>
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

	private:
		SceneManager();

		Scene* s_scenes[SceneType::SIZE];
		Scene* s_sceneActive;
	};
}
 