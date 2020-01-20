#pragma once
#include "Utilities.h"
namespace p2 {
	//Non-global singleton so we can have express explicit relations by passing objects around rather than having global state.
	template<typename T>
	class SingletonLocal {
	protected:
		SingletonLocal();
		virtual ~SingletonLocal();

	private:
		static bool s_initialized;
	};

	template<typename T>
	bool SingletonLocal<T>::s_initialized = false;

	template<typename T>
	inline SingletonLocal<T>::SingletonLocal()
	{
		if (!s_initialized)
			s_initialized = true;
		else
			debugAssert(false);
	}

	template<typename T>
	inline SingletonLocal<T>::~SingletonLocal()
	{
		debugAssert(s_initialized);
		s_initialized = false;
	}

}