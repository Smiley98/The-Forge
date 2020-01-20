#include "PathManager.h"
#include "../../../../Common_3/OS/Interfaces/IFileSystem.h"

extern ResourceDirectory RD_MIDDLEWARE_TEXT;
extern ResourceDirectory RD_MIDDLEWARE_UI;

namespace p2 {
	PathManager::PathManager()
	{
	}

	PathManager::~PathManager()
	{
	}

	bool PathManager::Init()
	{
		PathHandle programDirectory = fsCopyProgramDirectoryPath();
		if (!fsPlatformUsesBundledResources())
		{
			PathHandle resourceDirRoot = fsAppendPathComponent(programDirectory, "../../../src/01_Transformations");
			fsSetResourceDirectoryRootPath(resourceDirRoot);

			fsSetRelativePathForResourceDirectory(RD_TEXTURES, "../../UnitTestResources/Textures");
			fsSetRelativePathForResourceDirectory(RD_MESHES, "../../UnitTestResources/Meshes");
			fsSetRelativePathForResourceDirectory(RD_BUILTIN_FONTS, "../../UnitTestResources/Fonts");
			fsSetRelativePathForResourceDirectory(RD_ANIMATIONS, "../../UnitTestResources/Animation");
			fsSetRelativePathForResourceDirectory(RD_MIDDLEWARE_TEXT, "../../../../Middleware_3/Text");
			fsSetRelativePathForResourceDirectory(RD_MIDDLEWARE_UI, "../../../../Middleware_3/UI");
		}
		return true;
	}

	const char* PathManager::GetName()
	{
		return "PathManager";
	}
}
