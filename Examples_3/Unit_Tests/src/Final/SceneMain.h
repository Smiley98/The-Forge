#pragma once
#include "Scene.h"
namespace p2 {
	class SceneMain :
		public Scene
	{
		void Update(float deltaTime) final;
		void Render() final;
	};
}


