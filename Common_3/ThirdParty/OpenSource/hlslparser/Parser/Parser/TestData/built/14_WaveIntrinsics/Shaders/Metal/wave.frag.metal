#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct PSInput
    {
        float4 position;
        float4 color;
    };
    float texPattern(float2 position)
    {
        float scale = float(0.13);
        float t = (sin(((position).x * scale)) + cos(((position).y * scale)));
        float c = smoothstep(float(0.0), float(0.2), (t * t));
        return c;
    };
    float4 main(PSInput input, uint simd_lane_id)
    {
        float4 outputColor;
        float texP = texPattern(((input).position).xy);
        (outputColor = (float4(texP) * (input).color));
        switch (SceneConstantBuffer.renderMode)
        {
            case 1:
            {
                break;
            }
            case 2:
            {
                (outputColor = float4(float(simd_lane_id) / float((float)SceneConstantBuffer.laneSize)));
                break;
            }
            case 3:
            {
                if (simd_is_first())
                {
                    (outputColor = float4((float)1.0, (float)1.0, (float)1.0, (float)1.0));
                }
                break;
            }
            case 4:
            {
                if (simd_is_first())
                {
                    (outputColor = float4((float)1.0, (float)1.0, (float)1.0, (float)1.0));
                }
                if (simd_lane_id == simd_max(simd_lane_id))
                {
                    (outputColor = float4((float)1.0, (float)0.0, (float)0.0, (float)1.0));
                }
                break;
            }
            case 5:
            {
                uint4 activeLaneMask = simd_ballot(true);
                uint numActiveLanes = (((popcount((activeLaneMask).x) + popcount((activeLaneMask).y)) + popcount((activeLaneMask).z)) + popcount((activeLaneMask).w));
                float activeRatio = (float(numActiveLanes) / float((float)SceneConstantBuffer.laneSize));
                (outputColor = float4(activeRatio, activeRatio, activeRatio, (float)1.0));
                break;
            }
            case 6:
            {
                (outputColor = simd_broadcast_first(outputColor));
                break;
            }
            case 7:
            {
                uint4 activeLaneMask = simd_ballot(true);
                uint numActiveLanes = (((popcount((activeLaneMask).x) + popcount((activeLaneMask).y)) + popcount((activeLaneMask).z)) + popcount((activeLaneMask).w));
                float4 avgColor = (simd_sum(outputColor) / float4(float((float)numActiveLanes)));
                (outputColor = avgColor);
                break;
            }
            case 8:
            {
                float4 basePos = simd_broadcast_first((input).position);
                float4 prefixSumPos = simd_prefix_exclusive_sum(((input).position - basePos));
                uint4 activeLaneMask = simd_ballot(true);
                uint numActiveLanes = (((popcount((activeLaneMask).x) + popcount((activeLaneMask).y)) + popcount((activeLaneMask).z)) + popcount((activeLaneMask).w));
                (outputColor = (prefixSumPos / float4(numActiveLanes)));
                break;
            }
            case 9:
            {
                float dx = (quad_shuffle(((input).position).x, 1) - ((input).position).x);
                float dy = (quad_shuffle(((input).position).y, 2) - ((input).position).y);
                if (dx > float(0) && (dy > float(0)))
                {
                    (outputColor = float4((float)1, (float)0, (float)0, (float)1));
                }
                else if (((dx < float(0)) && (dy > float(0))))
                {
                    (outputColor = float4((float)0, (float)1, (float)0, (float)1));
                }
                else if (((dx > float(0)) && (dy < float(0))))
                {
                    (outputColor = float4((float)0, (float)0, (float)1, (float)1));
                }
                else if (((dx < float(0)) && (dy < float(0))))
                {
                    (outputColor = float4((float)1, (float)1, (float)1, (float)1));
                }
                else
                {
                    (outputColor = float4((float)0, (float)0, (float)0, (float)1));
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

    Fragment_Shader()
    {}
};

struct main_input
{
    float4 SV_POSITION [[position]];
    float4 COLOR;
};


fragment float4 stageMain(
	main_input inputData [[stage_in]],
    uint simd_lane_id [[thread_index_in_simdgroup]])
{
    uint simd_lane_id0;
    simd_lane_id0 = simd_lane_id;
    Fragment_Shader::PSInput input0;
    input0.position = inputData.SV_POSITION;
    input0.color = inputData.COLOR;
    Fragment_Shader main;
    return main.main(input0, simd_lane_id0);
}
