struct VSOutput
{
    float4 pos : SV_Position;
    float3 color : COLOR0;
    float2 uv : TEXCOORD0;
};
Texture2D<float4> uTexture0 : register(t1);
SamplerState uSampler0 : register(s2);
float4 main(VSOutput input) : SV_Target0
{
    float4 diffuse = uTexture0.Sample(uSampler0, input.uv);
    float lum = dot(diffuse.rgb, (const float3 )(0.333));
    (diffuse.rgb = lerp(diffuse.rgb, lum.xxx, (const float3 )(0.8)));
    (diffuse.rgb *= input.color.rgb);
    return diffuse;
};

