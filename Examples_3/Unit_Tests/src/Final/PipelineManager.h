#pragma once
#include "Singleton.h"
namespace p2 {
	class Pipeline;
	class PipelineManager :
		public Singleton<PipelineManager>
	{
	public:
		enum PipelineType : unsigned int {
			EXAMPLE,
			NUM_PIPELINES
		};

	private:
		Pipeline* s_pipelines[PipelineType::NUM_PIPELINES];
		Pipeline* s_pipelineActive;
	};
}


