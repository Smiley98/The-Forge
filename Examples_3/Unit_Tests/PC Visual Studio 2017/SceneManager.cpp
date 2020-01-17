//#include "stdafx.h"
#include "SceneManager.h"
#include "SceneMain.h"
#include "Utilities.h"

namespace p2 {
	SceneManager::SceneManager()
	{
		s_scenes[MAIN] = new SceneMain();
		s_sceneActive = s_scenes[MAIN];
		s_sceneActive->OnEnter();
	}

	SceneManager::~SceneManager()
	{
		delete s_scenes[MAIN];
	}

	void SceneManager::Change(SceneType sceneType)
	{
		debugAssert(sceneType < SceneType::NUM_SCENES);
		s_sceneActive->OnExit();
		s_sceneActive = s_scenes[sceneType];
		s_sceneActive->OnEnter();
	}

	const Scene& SceneManager::GetScene(SceneType sceneType)
	{
		return *s_scenes[sceneType];
	}

	const Scene& SceneManager::GetSceneActive()
	{
		return *s_sceneActive;
	}

	void SceneManager::Update(float deltaTime)
	{
		s_sceneActive->Update(deltaTime);
	}

	void SceneManager::Render()
	{
		s_sceneActive->Render();
	}

}
