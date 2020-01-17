#include "Utilities.h"
#include <cassert>
#include <cstdio>
#include <cstdarg>

namespace p2 {

	void debugAssert(bool expression)
	{
#ifdef _DEBUG
		assert(expression);
#endif
	}

	void debugPrintf(const char* format, ...)
	{
#ifdef _DEBUG
		va_list arguments;
		va_start(arguments, format);
		printf(format, arguments);
		va_end(arguments);
#endif
	}

}
