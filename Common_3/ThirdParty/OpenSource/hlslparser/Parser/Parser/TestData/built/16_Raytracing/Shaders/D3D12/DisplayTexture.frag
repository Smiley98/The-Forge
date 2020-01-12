struct PsIn
{
    float4 position : SV_Position;
    float2 texCoord : TEXCOORD;
};
Texture2D<float4> uTex0 : register(t0, space1);
SamplerState uSampler0 : register(s1);
float4 main(PsIn In) : SV_Target
{
    return uTex0.Sample(uSampler0, In.texCoord);
};

