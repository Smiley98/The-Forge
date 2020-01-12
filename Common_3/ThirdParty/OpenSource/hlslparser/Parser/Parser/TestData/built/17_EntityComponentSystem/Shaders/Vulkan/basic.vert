#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) out vec3 vertOutput_COLOR0;
layout(location = 1) out vec2 vertOutput_TEXCOORD0;

layout(row_major, push_constant) uniform RootConstant_Block
{
    float aspect;
}RootConstant;

struct InstanceData
{
    vec4 posScale;
    vec4 colorIndex;
};
layout(row_major, set = 1, binding = 0) buffer instanceBuffer
{
    InstanceData instanceBuffer_Data[];
};

struct VSOutput
{
    vec4 pos;
    vec3 color;
    vec2 uv;
};
VSOutput HLSLmain(in uint vertexId, in uint instanceId)
{
    VSOutput result;
    float x = float((vertexId / uint(2)));
    float y = float((vertexId & uint(1)));
    (((result).pos).x = (((instanceBuffer_Data[instanceId]).posScale).x + ((x - 0.5) * ((instanceBuffer_Data[instanceId]).posScale).z)));
    (((result).pos).y = (((instanceBuffer_Data[instanceId]).posScale).y + (((y - 0.5) * ((instanceBuffer_Data[instanceId]).posScale).z) * RootConstant.aspect)));
    (((result).pos).z = 0.0);
    (((result).pos).w = 1.0);
    ((result).uv = vec2(((x + ((instanceBuffer_Data[instanceId]).colorIndex).w) / float(8)), (float(1) - y)));
    ((result).color = ((instanceBuffer_Data[instanceId]).colorIndex).rgb);
    return result;
}
void main()
{
    uint vertexId;
    vertexId = gl_VertexIndex;
    uint instanceId;
    instanceId = gl_InstanceIndex;
    VSOutput result = HLSLmain(vertexId, instanceId);
    gl_Position = result.pos;
    vertOutput_COLOR0 = result.color;
    vertOutput_TEXCOORD0 = result.uv;
}
