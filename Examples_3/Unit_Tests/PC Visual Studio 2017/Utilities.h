#pragma once
namespace p2 {
	//class Utilities
	//{
		//Careful about this. The assertion only runs on debug configurations,
		//but the function still calls so be careful writing expensive conditions ie array search.
		//Simply explicitly wrap things in debug preprocessor if conditions are expensive.
		void debugAssert(bool expression);
		void debugPrintf(const char* format, ...);
	//};
}
