struct PsIn
{
    float2 texCoord : TEXCOORD;
    float4 position : SV_Position;
};
Texture2D<float4> inputRT : register(t0);
float3 ACESFilm(float3 x)
{
    float a = 2.51;
    float b = 0.030000000;
    float c = 2.43000008;
    float d = 0.58999996;
    float e = 0.14;
    return saturate(((x * (((float3 )(a) * x) + (float3 )(b))) / ((x * (((float3 )(c) * x) + (float3 )(d))) + (float3 )(e))));
};

float3 main(PsIn In) : SV_Target
{
    float3 colour = inputRT[In.position.xy].xyz;
    float exposure = (float )(0.7);
    (colour *= (float3 )(exposure));
    (colour = ACESFilm(colour));
    (colour = pow(abs(colour), (const float3 )((half )(1) / 2.20000004)));
    return colour;
};

