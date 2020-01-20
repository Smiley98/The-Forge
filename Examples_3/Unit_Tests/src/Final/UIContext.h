#pragma once
#include "../../../../Middleware_3/UI/AppUI.h"
namespace p2 {
	struct UIContext {
		UIApp gAppUI;
		GpuProfiler* pGpuProfiler = NULL;
		VirtualJoystickUI gVirtualJoystick;
		bool           gMicroProfiler = false;
		bool           bPrevToggleMicroProfiler = false;
	};
}