cbuffer SceneConstantBuffer : register(b0, space1)
{
    float4x4 orthProjMatrix;
    float2 mousePosition;
    float2 resolution;
    float time;
    uint renderMode;
    uint laneSize;
    uint padding;
};

struct PSInput
{
    float4 position : SV_POSITION;
    float4 color : COLOR;
};
float texPattern(float2 position)
{
    float scale = (float )(0.13);
    float t = (sin((position.x * scale)) + cos((position.y * scale)));
    float c = smoothstep((const float )(0.0), (const float )(0.2), (t * t));
    return c;
};

float4 main(PSInput input) : SV_TARGET
{
    float4 outputColor;
    float texP = texPattern(input.position.xy);
    (outputColor = ((float4 )(texP) * input.color));
    switch (renderMode)
    {
        case 1:
        {
            break;
        }
        case 2:
        {
            (outputColor = (float4 )((float )(WaveGetLaneIndex()) / float(laneSize)));
            break;
        }
        case 3:
        {
            if (WaveIsFirstLane())
            {
                (outputColor = float4(1.0, 1.0, 1.0, 1.0));
            }
            break;
        }
        case 4:
        {
            if (WaveIsFirstLane())
            {
                (outputColor = float4(1.0, 1.0, 1.0, 1.0));
            }
            if (WaveGetLaneIndex() == WaveActiveMax(WaveGetLaneIndex()))
            {
                (outputColor = float4(1.0, 0.0, 0.0, 1.0));
            }
            break;
        }
        case 5:
        {
            uint4 activeLaneMask = WaveActiveBallot(true);
            uint numActiveLanes = (((countbits(activeLaneMask.x) + countbits(activeLaneMask.y)) + countbits(activeLaneMask.z)) + countbits(activeLaneMask.w));
            float activeRatio = ((float )(numActiveLanes) / float(laneSize));
            (outputColor = float4(activeRatio, activeRatio, activeRatio, 1.0));
            break;
        }
        case 6:
        {
            (outputColor = WaveReadLaneFirst(outputColor));
            break;
        }
        case 7:
        {
            uint4 activeLaneMask = WaveActiveBallot(true);
            uint numActiveLanes = (((countbits(activeLaneMask.x) + countbits(activeLaneMask.y)) + countbits(activeLaneMask.z)) + countbits(activeLaneMask.w));
            float4 avgColor = (WaveActiveSum(outputColor) / (float4 )(float(numActiveLanes)));
            (outputColor = avgColor);
            break;
        }
        case 8:
        {
            float4 basePos = WaveReadLaneFirst(input.position);
            float4 prefixSumPos = WavePrefixSum((input.position - basePos));
            uint4 activeLaneMask = WaveActiveBallot(true);
            uint numActiveLanes = (((countbits(activeLaneMask.x) + countbits(activeLaneMask.y)) + countbits(activeLaneMask.z)) + countbits(activeLaneMask.w));
            (outputColor = (prefixSumPos / (float4 )(numActiveLanes)));
            break;
        }
        case 9:
        {
            float dx = (QuadReadAcrossX(input.position.x) - input.position.x);
            float dy = (QuadReadAcrossY(input.position.y) - input.position.y);
            if (dx > (float )(0) && (dy > (float )(0)))
            {
                (outputColor = float4(1, 0, 0, 1));
            }
            else if (((dx < (float )(0)) && (dy > (float )(0))))
            {
                (outputColor = float4(0, 1, 0, 1));
            }
            else if (((dx > (float )(0)) && (dy < (float )(0))))
            {
                (outputColor = float4(0, 0, 1, 1));
            }
            else if (((dx < (float )(0)) && (dy < (float )(0))))
            {
                (outputColor = float4(1, 1, 1, 1));
            }
            else
            {
                (outputColor = float4(0, 0, 0, 1));
            }
            break;
        }
        default:
        {
            break;
        }
    }
    return outputColor;
};

