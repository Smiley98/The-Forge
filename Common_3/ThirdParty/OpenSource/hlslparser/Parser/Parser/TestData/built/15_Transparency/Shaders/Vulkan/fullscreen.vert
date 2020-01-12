#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) out vec4 vertOutput_TEXCOORD0;

struct VSOutput
{
    vec4 Position;
    vec4 UV;
};
VSOutput HLSLmain(uint VertexID)
{
    VSOutput output1;
    ((output1).UV = vec4(((VertexID << uint(1)) & uint(2)), (VertexID & uint(2)), 0, 0));
    ((output1).Position = vec4(((((output1).UV).xy * vec2(2, (-2))) + vec2((-1), 1)), 0, 1));
    return output1;
}
void main()
{
    uint VertexID;
    VertexID = gl_VertexIndex;
    VSOutput result = HLSLmain(VertexID);
    gl_Position = result.Position;
    vertOutput_TEXCOORD0 = result.UV;
}
