#pragma once
#include "IResource.h"
#include "SingletonLocal.h"
#include "../../../../Common_3/Renderer/IRenderer.h"

namespace p2 {
	struct ShaderManager :
		public SingletonLocal<ShaderManager>, public IResource
	{
		//Does some fancy shit to figure out which side of the cube we're looking at
		Shader* skyboxShader;

		//Yeah you read this variable name correctly. Instanced rendering and gouraud lighting. Weird combination.
		Shader* instancedGouraudShader;

		//The only shader here that's actually useful. Standard rendering, phong lighting in the fragment shader.
		Shader* phong;

		const char* GetName() final;

		ShaderManager();
		~ShaderManager();
	};
}
