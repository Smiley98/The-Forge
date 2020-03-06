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
		{	//The resource directory root doesn't really matter as long as all exes are in the same directory (which they are).
			PathHandle resourceDirRoot = fsAppendPathComponent(programDirectory, "../../../src/Final");
			fsSetResourceDirectoryRootPath(resourceDirRoot);

			//Add my stuff to /Textures and /Meshes.
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
