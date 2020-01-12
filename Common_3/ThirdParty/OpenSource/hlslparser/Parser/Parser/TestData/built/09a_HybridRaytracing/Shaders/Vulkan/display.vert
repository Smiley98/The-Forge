#version 450 core

precision highp float;
precision highp int; 

layout(location = 0) out vec2 vertOutput_TEXCOORD;

struct PsIn
{
    vec2 texCoord;
    vec4 position;
};
PsIn HLSLmain(uint VertexID)
{
    PsIn Out;
    vec4 position;
    ((position).x = float((((VertexID == uint(2)))?(3.0):((-1.0)))));
    ((position).y = float((((VertexID == uint(0)))?((-3.0)):(1.0))));
    ((position).zw = vec2(1.0));
    ((Out).position = position);
    ((Out).texCoord = (((position).xy * vec2(0.5, (-0.5))) + vec2(0.5)));
    return Out;
}
void main()
{
    uint VertexID;
    VertexID = gl_VertexIndex;
    PsIn result = HLSLmain(VertexID);
    vertOutput_TEXCOORD = result.texCoord;
    gl_Position = result.position;
}
