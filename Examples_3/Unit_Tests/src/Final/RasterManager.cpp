#include "RasterManager.h"

namespace p2 {
	bool RasterManager::Init()
	{
		RasterizerStateDesc desc = {};

		desc.mCullMode = CULL_MODE_BOTH;
		addRasterizerState(m_renderer, &desc, &m_cullBoth);

		desc = {};
		desc.mCullMode = CULL_MODE_FRONT;
		addRasterizerState(m_renderer, &desc, &m_cullFront);

		desc = {};
		desc.mCullMode = CULL_MODE_BACK;
		addRasterizerState(m_renderer, &desc, &m_cullBack);

		desc = {};
		desc.mCullMode = CULL_MODE_NONE;
		addRasterizerState(m_renderer, &desc, &m_cullNone);

		DepthStateDesc depthStateDesc = {};
		depthStateDesc.mDepthTest = true;
		depthStateDesc.mDepthWrite = true;
		depthStateDesc.mDepthFunc = CMP_LEQUAL;
		addDepthState(m_renderer, &depthStateDesc, &m_depth);

		return true;
	}

	void RasterManager::Exit()
	{
		removeRasterizerState(m_cullBoth);
		removeRasterizerState(m_cullFront);
		removeRasterizerState(m_cullBack);
		removeRasterizerState(m_cullNone);
		removeDepthState(m_depth);
	}

	const char* RasterManager::GetName()
	{
		return "RasterManager";
	}

	RasterManager::RasterManager()
	{
	}

	RasterManager::~RasterManager()
	{
	}
}
