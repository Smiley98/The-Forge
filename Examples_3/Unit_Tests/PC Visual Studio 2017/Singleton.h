#pragma once

namespace p2 {
    template<class T>
    class Singleton
    {
    public:
        Singleton(T&&) = delete;
        Singleton(const T&) = delete;
        Singleton& operator=(T&&) = delete;
        Singleton& operator=(const T&) = delete;

        static T& Instance();

    protected:
        Singleton();
        virtual ~Singleton();
    };

    template<class T>
    inline T& Singleton<T>::Instance()
    {
        static T inst;
        return inst;
    }

    template<class T>
    inline Singleton<T>::~Singleton()
    {
    }

    template<class T>
    inline Singleton<T>::Singleton()
    {
    }
}
