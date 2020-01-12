#version 450 core

precision highp float;
precision highp int; 
void clip1(float x) { if (x < 0.0) discard;  }
void clip1(vec2  x) { if (any(lessThan(x, vec2(0.0, 0.0)))) discard;  }
void clip1(vec3  x) { if (any(lessThan(x, vec3(0.0, 0.0, 0.0)))) discard;  }
void clip1(vec4  x) { if (any(lessThan(x, vec4(0.0, 0.0, 0.0, 0.0)))) discard;  }

layout(location = 0) in vec4 fragInput_Texcoord0;
layout(location = 0) out vec4 rast_FragData0; 

struct VSOutput
{
    vec4 Position;
    vec4 UV;
};
layout(set = 0, binding = 0) uniform sampler PointSampler;
layout(set = 0, binding = 0) uniform texture2D AccumulationTexture;
layout(set = 0, binding = 1) uniform texture2D RevealageTexture;
float MaxComponent(vec4 v)
{
    return max(max(max((v).x, (v).y), (v).z), (v).w);
}
vec4 HLSLmain(VSOutput input1)
{
    float revealage = (texture(sampler2D(RevealageTexture, PointSampler), ((input1).UV).xy)).r;
    clip1(((1.0 - revealage) - 0.000010000000));
    vec4 accumulation = texture(sampler2D(AccumulationTexture, PointSampler), ((input1).UV).xy);
    if(isinf(MaxComponent(abs(accumulation))))
    {
        ((accumulation).rgb = vec3((accumulation).a));
    }
    vec3 averageColor = ((accumulation).rgb / vec3(max((accumulation).a, 0.000010000000)));
    return vec4(averageColor, (1.0 - revealage));
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.UV = fragInput_Texcoord0;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
