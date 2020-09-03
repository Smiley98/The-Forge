#define MAX_PLANETS 1    // Does not affect test, just for allocating space in uniform block. Must match with shader.

//Interfaces
#include "../../../../Common_3/OS/Interfaces/ICameraController.h"
#include "../../../../Common_3/OS/Interfaces/IApp.h"
#include "../../../../Common_3/OS/Interfaces/ILog.h"
#include "../../../../Common_3/OS/Interfaces/IInput.h"
#include "../../../../Common_3/OS/Interfaces/IFileSystem.h"
#include "../../../../Common_3/OS/Interfaces/ITime.h"
#include "../../../../Common_3/OS/Interfaces/IProfiler.h"
#include "../../../../Middleware_3/UI/AppUI.h"
#include "../../../../Common_3/Renderer/IRenderer.h"
#include "../../../../Common_3/Renderer/ResourceLoader.h"
#include "../../../../Common_3/OS/Math/MathTypes.h"
#include "../../../../Common_3/OS/Interfaces/IMemory.h"

#include "PathManager.h"
#include "QueueManager.h"
#include "SynchronizationManager.h"
#include "RasterManager.h"
#include "VertexManager.h"

/// Demo structures
struct PlanetInfoStruct
{
	mat4  mTransform;
	vec4  mColor;
};

struct UniformBlock
{
	mat4 mProjectionView;
	mat4 mWorldMatrices[MAX_PLANETS];
	vec4 mColors[MAX_PLANETS];

	// Point Light Information
	vec3 mLightPosition;
	vec3 mLightColor;
};

bool           gMicroProfiler = false;
bool           bPrevToggleMicroProfiler = false;
const uint     gNumPlanets = 1;

//Only object that I haven't wrapped.
Renderer* pRenderer = NULL;

Shader* pSphereShader = NULL;
Pipeline* pSpherePipeline = NULL;

Shader* pSkyBoxDrawShader = NULL;
Pipeline* pSkyBoxDrawPipeline = NULL;

RootSignature* pRootSignature = NULL;
Sampler* pSamplerSkyBox = NULL;
Texture* pSkyBoxTextures[6];

DescriptorSet* pDescriptorSetTexture = { NULL };
DescriptorSet* pDescriptorSetUniforms = { NULL };

Buffer* pProjViewUniformBuffer[IMAGE_COUNT] = { NULL };
Buffer* pSkyboxUniformBuffer[IMAGE_COUNT] = { NULL };

uint32_t gFrameIndex = 0;

UniformBlock     gUniformData;
UniformBlock     gUniformDataSky;
PlanetInfoStruct gPlanetInfoData[gNumPlanets];

ICameraController* pCameraController = NULL;

/// UI
UIApp gAppUI;
GpuProfiler* pGpuProfiler = NULL;
VirtualJoystickUI gVirtualJoystick;

const char* pSkyBoxImageFileNames[] = { "Skybox_right1",  "Skybox_left2",  "Skybox_top3",
										"Skybox_bottom4", "Skybox_front5", "Skybox_back6" };

TextDrawDesc gFrameTimeDraw = TextDrawDesc(0, 0xff00ffff, 18);

GuiComponent* pGui = NULL;

class Transformations : public IApp
{
private:
	p2::PathManager pathManager;
	p2::QueueManager queueManager;
	p2::SynchronizationManager syncManager;
	p2::RasterManager rasterManager;
	p2::VertexManager vertexManager;

	void barrier(Cmd* cmd);
	void present(Cmd* cmd);
	void bindTexture(Cmd* cmd);
	void setView(Cmd* cmd);
	void bindRenderTarget(Cmd* cmd, bool clear = false);
	void drawCube(Cmd* cmd);
	void drawSphere(Cmd* cmd);
	void drawSkybox(Cmd* cmd);

public:
	bool Init()
	{
		pathManager.Init();

		RendererDesc settings = { 0 };
		initRenderer(GetName(), &settings, &pRenderer);
		if (!pRenderer)
			return false;

		queueManager.m_renderer = pRenderer;
		syncManager.m_renderer = pRenderer;
		rasterManager.m_renderer = pRenderer;

		queueManager.Init();
		syncManager.Init();
		rasterManager.Init();

		//Any calls to addResource() require the loader to be initialized, which is why vertex manager init is called after.
		initResourceLoaderInterface(pRenderer);
		vertexManager.Init();

		// Loads Skybox Textures
		for (int i = 0; i < 6; ++i)
		{
			PathHandle textureFilePath = fsCopyPathInResourceDirectory(RD_TEXTURES, pSkyBoxImageFileNames[i]);
			TextureLoadDesc textureDesc = {};
			textureDesc.pFilePath = textureFilePath;
			textureDesc.ppTexture = &pSkyBoxTextures[i];
			addResource(&textureDesc, true);
		}

		if (!gVirtualJoystick.Init(pRenderer, "circlepad", RD_TEXTURES))
		{
			LOGF(LogLevel::eERROR, "Could not initialize Virtual Joystick.");
			return false;
		}

		ShaderLoadDesc skyShader = {};
		skyShader.mStages[0] = { "skybox.vert", NULL, 0, RD_SHADER_SOURCES };
		skyShader.mStages[1] = { "skybox.frag", NULL, 0, RD_SHADER_SOURCES };
		ShaderLoadDesc basicShader = {};
		basicShader.mStages[0] = { "basic.vert", NULL, 0, RD_SHADER_SOURCES };
		basicShader.mStages[1] = { "basic.frag", NULL, 0, RD_SHADER_SOURCES };

		addShader(pRenderer, &skyShader, &pSkyBoxDrawShader);
		addShader(pRenderer, &basicShader, &pSphereShader);

		SamplerDesc samplerDesc = { FILTER_LINEAR,
									FILTER_LINEAR,
									MIPMAP_MODE_NEAREST,
									ADDRESS_MODE_CLAMP_TO_EDGE,
									ADDRESS_MODE_CLAMP_TO_EDGE,
									ADDRESS_MODE_CLAMP_TO_EDGE };
		addSampler(pRenderer, &samplerDesc, &pSamplerSkyBox);

		Shader* shaders[] = { pSphereShader, pSkyBoxDrawShader };
		const char* pStaticSamplers[] = { "uSampler0" };
		RootSignatureDesc rootDesc = {};
		rootDesc.mStaticSamplerCount = 1;
		rootDesc.ppStaticSamplerNames = pStaticSamplers;
		rootDesc.ppStaticSamplers = &pSamplerSkyBox;
		rootDesc.mShaderCount = 2;
		rootDesc.ppShaders = shaders;
		addRootSignature(pRenderer, &rootDesc, &pRootSignature);

		DescriptorSetDesc desc = { pRootSignature, DESCRIPTOR_UPDATE_FREQ_NONE, 1 };
		addDescriptorSet(pRenderer, &desc, &pDescriptorSetTexture);

		//This means only support 2 uniform clocks.
		desc = { pRootSignature, DESCRIPTOR_UPDATE_FREQ_PER_FRAME, IMAGE_COUNT * 2 };
		addDescriptorSet(pRenderer, &desc, &pDescriptorSetUniforms);

		BufferLoadDesc ubDesc = {};
		ubDesc.mDesc.mDescriptors = DESCRIPTOR_TYPE_UNIFORM_BUFFER;
		ubDesc.mDesc.mMemoryUsage = RESOURCE_MEMORY_USAGE_CPU_TO_GPU;
		ubDesc.mDesc.mSize = sizeof(UniformBlock);
		ubDesc.mDesc.mFlags = BUFFER_CREATION_FLAG_PERSISTENT_MAP_BIT;
		ubDesc.pData = NULL;
		for (uint32_t i = 0; i < IMAGE_COUNT; ++i)
		{
			ubDesc.ppBuffer = &pProjViewUniformBuffer[i];
			addResource(&ubDesc);
			ubDesc.ppBuffer = &pSkyboxUniformBuffer[i];
			addResource(&ubDesc);
		}
		finishResourceLoading();

		// Sun
		gPlanetInfoData[0].mTransform = mat4::identity();
		//gPlanetInfoData[0].mColor = vec4(0.9f, 0.6f, 0.1f, 0.0f);
		gPlanetInfoData[0].mColor = vec4(1.0f, 1.0f, 1.0f, 0.0f);

		if (!gAppUI.Init(pRenderer))
			return false;

		gAppUI.LoadFont("TitilliumText/TitilliumText-Bold.otf", RD_BUILTIN_FONTS);

		GuiDesc guiDesc = {};
		float   dpiScale = getDpiScale().x;
		guiDesc.mStartSize = vec2(140.0f, 320.0f);
		guiDesc.mStartPosition = vec2(mSettings.mWidth / dpiScale - guiDesc.mStartSize.getX() * 1.1f, guiDesc.mStartSize.getY() * 0.5f);

		pGui = gAppUI.AddGuiComponent("Micro profiler", &guiDesc);

		pGui->AddWidget(CheckboxWidget("Toggle Micro Profiler", &gMicroProfiler));

		//CameraMotionParameters cmp{ 160.0f, 600.0f, 200.0f };
		CameraMotionParameters cmp{ 16.0f, 60.0f, 20.0f };
		vec3                   camPos{ 48.0f, 48.0f, 20.0f };
		vec3                   lookAt{ 0 };

		pCameraController = createFpsCameraController(camPos, lookAt);

		pCameraController->setMotionParameters(cmp);

		if (!initInputSystem(pWindow))
			return false;

		// Initialize microprofiler and it's UI.
		initProfiler();

		// Gpu profiler can only be added after initProfile.
		addGpuProfiler(pRenderer, queueManager.m_graphicsQueue, &pGpuProfiler, "GpuProfiler");

		// App Actions
		InputActionDesc actionDesc = { InputBindings::BUTTON_FULLSCREEN, [](InputActionContext* ctx) { toggleFullscreen(((IApp*)ctx->pUserData)->pWindow); return true; }, this };
		addInputAction(&actionDesc);
		actionDesc = { InputBindings::BUTTON_EXIT, [](InputActionContext* ctx) { requestShutdown(); return true; } };
		addInputAction(&actionDesc);
		actionDesc =
		{
			InputBindings::BUTTON_ANY, [](InputActionContext* ctx)
			{
				bool capture = gAppUI.OnButton(ctx->mBinding, ctx->mBool, ctx->pPosition);
				setEnableCaptureInput(capture && INPUT_ACTION_PHASE_CANCELED != ctx->mPhase);
				return true;
			}, this
		};
		addInputAction(&actionDesc);
		typedef bool (*CameraInputHandler)(InputActionContext* ctx, uint32_t index);
		static CameraInputHandler onCameraInput = [](InputActionContext* ctx, uint32_t index)
		{
			if (!gMicroProfiler && !gAppUI.IsFocused() && *ctx->pCaptured)
			{
				gVirtualJoystick.OnMove(index, ctx->mPhase != INPUT_ACTION_PHASE_CANCELED, ctx->pPosition);
				index ? pCameraController->onRotate(ctx->mFloat2) : pCameraController->onMove(ctx->mFloat2);
			}
			return true;
		};
		actionDesc = { InputBindings::FLOAT_RIGHTSTICK, [](InputActionContext* ctx) { return onCameraInput(ctx, 1); }, NULL, 20.0f, 200.0f, 0.5f };
		addInputAction(&actionDesc);
		actionDesc = { InputBindings::FLOAT_LEFTSTICK, [](InputActionContext* ctx) { return onCameraInput(ctx, 0); }, NULL, 20.0f, 200.0f, 1.0f };
		addInputAction(&actionDesc);
		actionDesc = { InputBindings::BUTTON_NORTH, [](InputActionContext* ctx) { pCameraController->resetView(); return true; } };
		addInputAction(&actionDesc);

		// Prepare descriptor sets
		DescriptorData params[6] = {};
		params[0].pName = "RightText";
		params[0].ppTextures = &pSkyBoxTextures[0];
		params[1].pName = "LeftText";
		params[1].ppTextures = &pSkyBoxTextures[1];
		params[2].pName = "TopText";
		params[2].ppTextures = &pSkyBoxTextures[2];
		params[3].pName = "BotText";
		params[3].ppTextures = &pSkyBoxTextures[3];
		params[4].pName = "FrontText";
		params[4].ppTextures = &pSkyBoxTextures[4];
		params[5].pName = "BackText";
		params[5].ppTextures = &pSkyBoxTextures[5];
		updateDescriptorSet(pRenderer, 0, pDescriptorSetTexture, 6, params);

		for (uint32_t i = 0; i < IMAGE_COUNT; ++i)
		{
			DescriptorData params[1] = {};
			params[0].pName = "uniformBlock";
			params[0].ppBuffers = &pSkyboxUniformBuffer[i];
			updateDescriptorSet(pRenderer, i * 2 + 0, pDescriptorSetUniforms, 1, params);

			params[0].ppBuffers = &pProjViewUniformBuffer[i];
			updateDescriptorSet(pRenderer, i * 2 + 1, pDescriptorSetUniforms, 1, params);
		}

		return true;
	}

	void Exit()
	{
		queueManager.Exit();
		syncManager.Exit();
		rasterManager.Exit();
		vertexManager.Exit();

		exitInputSystem();

		destroyCameraController(pCameraController);

		gVirtualJoystick.Exit();

		gAppUI.Exit();

		// Exit profile
		exitProfiler();

		for (uint32_t i = 0; i < IMAGE_COUNT; ++i)
		{
			removeResource(pProjViewUniformBuffer[i]);
			removeResource(pSkyboxUniformBuffer[i]);
		}

		removeDescriptorSet(pRenderer, pDescriptorSetTexture);
		removeDescriptorSet(pRenderer, pDescriptorSetUniforms);

		for (uint i = 0; i < 6; ++i)
			removeResource(pSkyBoxTextures[i]);

		removeSampler(pRenderer, pSamplerSkyBox);
		removeShader(pRenderer, pSphereShader);
		removeShader(pRenderer, pSkyBoxDrawShader);
		removeRootSignature(pRenderer, pRootSignature);

		removeGpuProfiler(pRenderer, pGpuProfiler);
		removeResourceLoaderInterface(pRenderer);
		removeRenderer(pRenderer);
	}

	bool Load()
	{
		if (!addSwapChain())
			return false;

		if (!addDepthBuffer())
			return false;

		if (!gAppUI.Load(syncManager.m_swapChain->ppSwapchainRenderTargets))
			return false;

		if (!gVirtualJoystick.Load(syncManager.m_swapChain->ppSwapchainRenderTargets[0]))
			return false;

		loadProfiler(&gAppUI, mSettings.mWidth, mSettings.mHeight);

		PipelineDesc desc = {};
		desc.mType = PIPELINE_TYPE_GRAPHICS;
		GraphicsPipelineDesc& pipelineSettings = desc.mGraphicsDesc;
		pipelineSettings.mPrimitiveTopo = PRIMITIVE_TOPO_TRI_LIST;
		pipelineSettings.mRenderTargetCount = 1;
		pipelineSettings.pDepthState = rasterManager.m_depth;
		pipelineSettings.pColorFormats = &syncManager.m_swapChain->ppSwapchainRenderTargets[0]->mDesc.mFormat;
		pipelineSettings.mSampleCount = syncManager.m_swapChain->ppSwapchainRenderTargets[0]->mDesc.mSampleCount;
		pipelineSettings.mSampleQuality = syncManager.m_swapChain->ppSwapchainRenderTargets[0]->mDesc.mSampleQuality;
		pipelineSettings.mDepthStencilFormat = syncManager.m_depthBuffer->mDesc.mFormat;
		pipelineSettings.pRootSignature = pRootSignature;
		pipelineSettings.pShaderProgram = pSphereShader;
		//This is okay for now because the sphere and the cube have the same vertex layout.
		pipelineSettings.pVertexLayout = &vertexManager.m_sphereVertexLayout;
		pipelineSettings.pRasterizerState = rasterManager.m_cullFront;
		addPipeline(pRenderer, &desc, &pSpherePipeline);

		//Fingers fucking crossed.
		pipelineSettings.pVertexLayout = &vertexManager.m_skyboxVertexLayout;
		pipelineSettings.pDepthState = NULL;
		pipelineSettings.pRasterizerState = rasterManager.m_cullNone;
		pipelineSettings.pShaderProgram = pSkyBoxDrawShader;
		addPipeline(pRenderer, &desc, &pSkyBoxDrawPipeline);

		return true;
	}

	void Unload()
	{
		queueManager.Unload();

		unloadProfiler();
		gAppUI.Unload();

		gVirtualJoystick.Unload();

		removePipeline(pRenderer, pSkyBoxDrawPipeline);
		removePipeline(pRenderer, pSpherePipeline);

		syncManager.Unload();
	}

	void Update(float deltaTime)
	{
		updateInputSystem(mSettings.mWidth, mSettings.mHeight);
		pCameraController->update(deltaTime);

		static float currentTime = 0.0f;
		currentTime += deltaTime * 1000.0f;

		// update camera with time
		mat4 viewMat = pCameraController->getViewMatrix();

		const float aspectInverse = (float)mSettings.mHeight / (float)mSettings.mWidth;
		const float horizontal_fov = PI / 2.0f;
		mat4 projMat = mat4::perspective(horizontal_fov, aspectInverse, 0.1f, 1000.0f);
		gUniformData.mProjectionView = projMat * viewMat;

		//Reset to identity matrix with a scale of 5.
		gPlanetInfoData[0].mTransform = mat4::scale(vec3(5.0f));

		// point light parameters
		gUniformData.mLightPosition = vec3(0, 0, 0);
		gUniformData.mWorldMatrices[0] = gPlanetInfoData[0].mTransform;
		gUniformData.mColors[0] = gPlanetInfoData[0].mColor;

		//Zero the translation for the skybox view matrix.
		viewMat.setTranslation(vec3(0.0f));
		gUniformDataSky = gUniformData;
		gUniformDataSky.mProjectionView = projMat * viewMat;

		if (gMicroProfiler != bPrevToggleMicroProfiler)
		{
			toggleProfiler();
			bPrevToggleMicroProfiler = gMicroProfiler;
		}
		gAppUI.Update(deltaTime);
	}

	void Draw()
	{
		acquireNextImage(pRenderer, syncManager.m_swapChain, syncManager.m_imageAcquiredSemaphore, NULL, &gFrameIndex);
		Semaphore* pRenderCompleteSemaphore = syncManager.m_renderCompleteSemaphores[gFrameIndex];
		Fence* pRenderCompleteFence = syncManager.m_renderCompleteFences[gFrameIndex];
		FenceStatus fenceStatus;
		Cmd* cmd = queueManager.m_commands[gFrameIndex];

		BufferUpdateDesc skyboxViewProjCbv = { pSkyboxUniformBuffer[gFrameIndex], &gUniformDataSky };
		updateResource(&skyboxViewProjCbv);

		gUniformData.mColors[0] = vec4(1.0f, 0.0f, 0.0f, 1.0f);
		BufferUpdateDesc viewProjCbv = { pProjViewUniformBuffer[gFrameIndex], &gUniformData };
		updateResource(&viewProjCbv);

		getFenceStatus(pRenderer, pRenderCompleteFence, &fenceStatus);
		if (fenceStatus == FENCE_STATUS_INCOMPLETE)
			waitForFences(pRenderer, 1, &pRenderCompleteFence);
		
		beginCmd(cmd);
		setView(cmd);
		bindRenderTarget(cmd, true);
		bindTexture(cmd);
		drawSkybox(cmd);
		drawSphere(cmd);
		endCmd(cmd);
		queueSubmit(queueManager.m_graphicsQueue, 1, &cmd, pRenderCompleteFence, 1, &syncManager.m_imageAcquiredSemaphore, 1, &pRenderCompleteSemaphore);

		getFenceStatus(pRenderer, pRenderCompleteFence, &fenceStatus);
		if (fenceStatus == FENCE_STATUS_INCOMPLETE)
			waitForFences(pRenderer, 1, &pRenderCompleteFence);
		
		gUniformData.mColors[0] = vec4(0.0f, 1.0f, 0.0f, 1.0f);
		gUniformData.mWorldMatrices[0].setTranslation(vec3(10.0f, 0.0f, 0.0f));
		updateResource(&viewProjCbv);
		
		beginCmd(cmd);
		setView(cmd);
		bindRenderTarget(cmd);
		drawCube(cmd);
		endCmd(cmd);
		queueSubmit(queueManager.m_graphicsQueue, 1, &cmd, pRenderCompleteFence, 1, &syncManager.m_imageAcquiredSemaphore, 1, &pRenderCompleteSemaphore);

		//Submits an image for presentation (only call this after all draw calls are finished).
		queuePresent(queueManager.m_graphicsQueue, syncManager.m_swapChain, gFrameIndex, 1, &pRenderCompleteSemaphore);
	}

	const char* GetName() { return "01_Transformations"; }

	bool addSwapChain()
	{
		SwapChainDesc swapChainDesc = {};
		swapChainDesc.mWindowHandle = pWindow->handle;
		swapChainDesc.mPresentQueueCount = 1;
		swapChainDesc.ppPresentQueues = &queueManager.m_graphicsQueue;//&pGraphicsQueue;
		swapChainDesc.mWidth = mSettings.mWidth;
		swapChainDesc.mHeight = mSettings.mHeight;
		swapChainDesc.mImageCount = IMAGE_COUNT;
		swapChainDesc.mSampleCount = SAMPLE_COUNT_1;
		swapChainDesc.mColorFormat = getRecommendedSwapchainFormat(true);
		swapChainDesc.mEnableVsync = false;
		::addSwapChain(pRenderer, &swapChainDesc, &syncManager.m_swapChain);

		return syncManager.m_swapChain != NULL;
	}

	bool addDepthBuffer()
	{
		// Add depth buffer
		RenderTargetDesc depthRT = {};
		depthRT.mArraySize = 1;
		depthRT.mClearValue.depth = 1.0f;
		depthRT.mClearValue.stencil = 0;
		depthRT.mDepth = 1;
		depthRT.mFormat = TinyImageFormat_D32_SFLOAT;
		depthRT.mHeight = mSettings.mHeight;
		depthRT.mSampleCount = SAMPLE_COUNT_1;
		depthRT.mSampleQuality = 0;
		depthRT.mWidth = mSettings.mWidth;
		depthRT.mFlags = TEXTURE_CREATION_FLAG_ON_TILE;
		addRenderTarget(pRenderer, &depthRT, &syncManager.m_depthBuffer);

		return syncManager.m_depthBuffer != NULL;
	}
};

DEFINE_APPLICATION_MAIN(Transformations)

void Transformations::barrier(Cmd* cmd)
{
	RenderTarget* pRenderTarget = syncManager.m_swapChain->ppSwapchainRenderTargets[gFrameIndex];
	TextureBarrier barriers[] = { { pRenderTarget->pTexture, RESOURCE_STATE_RENDER_TARGET }, { syncManager.m_depthBuffer->pTexture, RESOURCE_STATE_DEPTH_WRITE }, };
	cmdResourceBarrier(cmd, 0, NULL, 2, barriers);
}

void Transformations::present(Cmd* cmd) {
	RenderTarget* pRenderTarget = syncManager.m_swapChain->ppSwapchainRenderTargets[gFrameIndex];
	TextureBarrier barriers[] = { pRenderTarget->pTexture, RESOURCE_STATE_PRESENT };
	cmdResourceBarrier(cmd, 0, NULL, 1, barriers);
}

void Transformations::bindTexture(Cmd* cmd)
{
	cmdBindDescriptorSet(cmd, 0, pDescriptorSetTexture);
}

void Transformations::setView(Cmd* cmd)
{
	RenderTarget* pRenderTarget = syncManager.m_swapChain->ppSwapchainRenderTargets[gFrameIndex];
	cmdSetViewport(cmd, 0.0f, 0.0f, (float)pRenderTarget->mDesc.mWidth, (float)pRenderTarget->mDesc.mHeight, 0.0f, 1.0f);
	cmdSetScissor(cmd, 0, 0, pRenderTarget->mDesc.mWidth, pRenderTarget->mDesc.mHeight);
}

void Transformations::bindRenderTarget(Cmd* cmd, bool clear)
{
	RenderTarget* pRenderTarget = syncManager.m_swapChain->ppSwapchainRenderTargets[gFrameIndex];
	if (clear)
	{
		LoadActionsDesc loadActions = {};
		loadActions.mLoadActionsColor[0] = LOAD_ACTION_CLEAR;
		loadActions.mClearColorValues[0].r = 1.0f;
		loadActions.mClearColorValues[0].g = 1.0f;
		loadActions.mClearColorValues[0].b = 1.0f;
		loadActions.mClearColorValues[0].a = 1.0f;
		loadActions.mLoadActionDepth = LOAD_ACTION_CLEAR;
		loadActions.mClearDepth.depth = 1.0f;
		loadActions.mClearDepth.stencil = 0;
		cmdBindRenderTargets(cmd, 1, &pRenderTarget, syncManager.m_depthBuffer, &loadActions, NULL, NULL, -1, -1);
	}
	else
		cmdBindRenderTargets(cmd, 1, &pRenderTarget, syncManager.m_depthBuffer, NULL, NULL, NULL, -1, -1);
}

void Transformations::drawCube(Cmd* cmd)
{
	cmdBindPipeline(cmd, pSpherePipeline);
	cmdBindDescriptorSet(cmd, gFrameIndex * 2 + 1, pDescriptorSetUniforms);
	cmdBindVertexBuffer(cmd, 1, &vertexManager.m_cubeVertexBuffer, NULL);
	cmdDraw(cmd, vertexManager.m_cubeVertexCount, 0);
}

void Transformations::drawSphere(Cmd* cmd)
{
	cmdBindPipeline(cmd, pSpherePipeline);
	cmdBindDescriptorSet(cmd, gFrameIndex * 2 + 1, pDescriptorSetUniforms);
	cmdBindVertexBuffer(cmd, 1, &vertexManager.m_sphereVertexBuffer, NULL);
	cmdDrawInstanced(cmd, vertexManager.m_sphereVertexCount, 0, gNumPlanets, 0);
}

void Transformations::drawSkybox(Cmd* cmd)
{
	cmdBindPipeline(cmd, pSkyBoxDrawPipeline);
	cmdBindDescriptorSet(cmd, gFrameIndex * 2 + 0, pDescriptorSetUniforms);
	cmdBindVertexBuffer(cmd, 1, &vertexManager.m_skyboxVertexBuffer, NULL);
	cmdDraw(cmd, vertexManager.m_skyboxVertexCount, 0);
}
