//#include "stdafx.h"
#include "SceneManager.h"
#include "SceneMain.h"
#include "Utilities.h"
#include "../../../../Common_3/OS/Interfaces/IMemory.h"

namespace p2 {
	SceneManager::SceneManager()
	{
		s_scenes[MAIN] = conf_new(SceneMain);
		s_sceneActive = s_scenes[MAIN];
		s_sceneActive->OnEnter();
	}

	SceneManager::~SceneManager()
	{
		conf_delete(s_scenes[MAIN]);
	}

	void SceneManager::Change(SceneType sceneType)
	{
		debugAssert(sceneType < SceneType::SIZE);
		s_sceneActive->OnExit();
		s_sceneActive = s_scenes[sceneType];
		s_sceneActive->OnEnter();
	}

	//Strongly consider leaving these commented. External use opens up a lot of room for error.
	/*const Scene& SceneManager::GetScene(SceneType sceneType)
	{
		return *s_scenes[sceneType];
	}

	const Scene& SceneManager::GetSceneActive()
	{
		return *s_sceneActive;
	}*/

	void SceneManager::Update(float deltaTime)
	{
		s_sceneActive->Update(deltaTime);
	}

	void SceneManager::Render()
	{
		s_sceneActive->Render();
	}

}
