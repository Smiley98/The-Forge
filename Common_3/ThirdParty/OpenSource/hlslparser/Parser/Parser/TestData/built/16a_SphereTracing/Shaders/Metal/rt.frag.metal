#include <metal_stdlib>
using namespace metal;

struct Fragment_Shader
{
    struct Uniforms_u_input
    {
        float4 resolution;
        float4x4 invView;
    };
    constant Uniforms_u_input& u_input;
    float sdPlane(float3 p)
    {
        return (p).y;
    };
    float sdSphere(float3 p, float s)
    {
        return (length(p) - s);
    };
    float sdBox(float3 p, float3 b)
    {
        float3 d = (abs(p) - b);
        return (min((float)max((float)d.x,(float)max((float)d.y,(float)d.z)),(float)float(0.0)) + length(max((float3)d,(float3)float3(0.0))));
    };
    float udRoundBox(float3 p, float3 b, float r)
    {
        return (length(max((float3)abs(p) - b,(float3)float3(0.0))) - r);
    };
    float sdTorus(float3 p, float2 t)
    {
        return (length(float2((length((p).xz) - (t).x), (p).y)) - (t).y);
    };
    float sdHexPrism(float3 p, float2 h)
    {
        float3 q = abs(p);
        float d1 = ((q).z - (h).y);
        float d2 = (max((float)q.x * float(0.8660250) + ((q).y * float(0.5)),(float)q.y) - (h).x);
        return (length(max((float2)float2(d1, d2),(float2)float2(0.0))) + min((float)max((float)d1,(float)d2),(float)float(0.0)));
    };
    float sdCapsule(float3 p, float3 a, float3 b, float r)
    {
        float3 pa = (p - a), ba = (b - a);
        float h = clamp((dot(pa, ba) / dot(ba, ba)), float(0.0), float(1.0));
        return (length((pa - (ba * float3(h)))) - r);
    };
    float sdTriPrism(float3 p, float2 h)
    {
        float3 q = abs(p);
        float d1 = ((q).z - (h).y);
        float d2 = (max((float)q.x * float(0.8660250) + ((p).y * float(0.5)),(float)(-p.y)) - ((h).x * float(0.5)));
        return (length(max((float2)float2(d1, d2),(float2)float2(0.0))) + min((float)max((float)d1,(float)d2),(float)float(0.0)));
    };
    float sdCylinder(float3 p, float2 h)
    {
        float2 d = (abs(float2(length((p).xz), (p).y)) - h);
        return (min((float)max((float)d.x,(float)d.y),(float)float(0.0)) + length(max((float2)d,(float2)float2(0.0))));
    };
    float sdCone(float3 p, float3 c)
    {
        float2 q = float2(length((p).xz), (p).y);
        float d1 = ((-(q).y) - (c).z);
        float d2 = max((float)dot(q, (c).xy),(float)q.y);
        return (length(max((float2)float2(d1, d2),(float2)float2(0.0))) + min((float)max((float)d1,(float)d2),(float)float(0.0)));
    };
    float sdConeSection(float3 p, float h, float r1, float r2)
    {
        float d1 = ((-(p).y) - h);
        float q = ((p).y - h);
        float si = ((float(0.5) * (r1 - r2)) / h);
        float d2 = max((float)sqrt((dot((p).xz, (p).xz) * (float(1.0) - (si * si)))) + (q * si) - r2,(float)q);
        return (length(max((float2)float2(d1, d2),(float2)float2(0.0))) + min((float)max((float)d1,(float)d2),(float)float(0.0)));
    };
    float sdPryamid4(float3 p, float3 h)
    {
        float box = sdBox((p - float3((float)0, (float((-2.0)) * (h).z), (float)0)), float3(float(2.0) * (h).z));
        float d = float(0.0);
        (d = max((float)d,(float)abs(dot(p, float3((-(h).x), (h).y, (float)0)))));
        (d = max((float)d,(float)abs(dot(p, float3((h).x, (h).y, (float)0)))));
        (d = max((float)d,(float)abs(dot(p, float3((float)0, (h).y, (h).x)))));
        (d = max((float)d,(float)abs(dot(p, float3((float)0, (h).y, (-(h).x))))));
        float octa = (d - (h).z);
        return max((float)(-box),(float)octa);
    };
    float length2(float2 p)
    {
        return sqrt((((p).x * (p).x) + ((p).y * (p).y)));
    };
    float length6(float2 p)
    {
        (p = ((p * p) * p));
        (p = (p * p));
        return pow(((p).x + (p).y), float(1.0 / 6.0));
    };
    float length8(float2 p)
    {
        (p = (p * p));
        (p = (p * p));
        (p = (p * p));
        return pow(((p).x + (p).y), float(1.0 / 8.0));
    };
    float sdTorus82(float3 p, float2 t)
    {
        float2 q = float2((length2((p).xz) - (t).x), (p).y);
        return (length8(q) - (t).y);
    };
    float sdTorus88(float3 p, float2 t)
    {
        float2 q = float2((length8((p).xz) - (t).x), (p).y);
        return (length8(q) - (t).y);
    };
    float sdCylinder6(float3 p, float2 h)
    {
        return max((float)length6((p).xz) - (h).x,(float)abs((p).y) - (h).y);
    };
    float opS(float d1, float d2)
    {
        return max((float)(-d2),(float)d1);
    };
    float2 opU(float2 d1, float2 d2)
    {
        return ((((d1).x < (d2).x))?(d1):(d2));
    };
    float3 opRep(float3 p, float3 c)
    {
        return (abs(fmod(p, c)) - (float3(0.5) * c));
    };
    float3 opTwist(float3 p)
    {
        float c = cos(((float(10.0) * (p).y) + float(10.0)));
        float s = sin(((float(10.0) * (p).y) + float(10.0)));
        float2x2 m = float2x2(c, (-s), s, c);
        return float3(((m)*((p).xz)), (p).y);
    };
    float2 map(float3 pos)
    {
        float2 res = opU(float2(sdPlane(pos), (float)1.0), float2(sdSphere((pos - float3((float)0.0, (float)0.25, (float)0.0)), float(0.25)), (float)46.9000015));
        (res = opU(res, float2(sdBox((pos - float3((float)1.0, (float)0.25, (float)0.0)), float3(0.25)), (float)3.0)));
        (res = opU(res, float2(udRoundBox((pos - float3((float)1.0, (float)0.25, (float)1.0)), float3(0.15), float(0.1)), (float)41.0)));
        (res = opU(res, float2(sdTorus((pos - float3((float)0.0, (float)0.25, (float)1.0)), float2((float)0.2, (float)0.05)), (float)25.0)));
        (res = opU(res, float2(sdCapsule(pos, float3((float)(-1.29999996), (float)0.1, (float)(-0.1)), float3((float)(-0.8), (float)0.5, (float)0.2), float(0.1)), (float)31.8999996)));
        (res = opU(res, float2(sdTriPrism((pos - float3((float)(-1.0), (float)0.25, (float)(-1.0))), float2((float)0.25, (float)0.05)), (float)43.5)));
        (res = opU(res, float2(sdCylinder((pos - float3((float)1.0, (float)0.3, (float)(-1.0))), float2((float)0.1, (float)0.2)), (float)8.0)));
        (res = opU(res, float2(sdCone((pos - float3((float)0.0, (float)0.5, (float)(-1.0))), float3((float)0.8, (float)0.6, (float)0.3)), (float)55.0)));
        (res = opU(res, float2(sdTorus82((pos - float3((float)0.0, (float)0.25, (float)2.0)), float2((float)0.2, (float)0.05)), (float)50.0)));
        (res = opU(res, float2(sdTorus88((pos - float3((float)(-1.0), (float)0.25, (float)2.0)), float2((float)0.2, (float)0.05)), (float)43.0)));
        (res = opU(res, float2(sdCylinder6((pos - float3((float)1.0, (float)0.3, (float)2.0)), float2((float)0.1, (float)0.2)), (float)12.0)));
        (res = opU(res, float2(sdHexPrism((pos - float3((float)(-1.0), (float)0.2, (float)1.0)), float2((float)0.25, (float)0.05)), (float)17.0)));
        (res = opU(res, float2(sdPryamid4((pos - float3((float)(-1.0), (float)0.15, (float)(-2.0))), float3((float)0.8, (float)0.6, (float)0.25)), (float)37.0)));
        (res = opU(res, float2(opS(udRoundBox((pos - float3((float)(-2.0), (float)0.2, (float)1.0)), float3(0.15), float(0.05)), sdSphere((pos - float3((float)(-2.0), (float)0.2, (float)1.0)), float(0.25))), (float)13.0)));
        (res = opU(res, float2(opS(sdTorus82((pos - float3((float)(-2.0), (float)0.2, (float)0.0)), float2((float)0.2, (float)0.1)), sdCylinder(opRep(float3((atan2(((pos).x + float(2.0)), (pos).z) / float(6.28310012)), (pos).y, (float(0.020000000) + (float(0.5) * length((pos - float3((float)(-2.0), (float)0.2, (float)0.0)))))), float3((float)0.05, (float)1.0, (float)0.05)), float2((float)0.020000000, (float)0.6))), (float)51.0)));
        (res = opU(res, float2(((float(0.5) * sdSphere((pos - float3((float)(-2.0), (float)0.25, (float)(-1.0))), float(0.2))) + (((float(0.030000000) * sin((float(50.0) * (pos).x))) * sin((float(50.0) * (pos).y))) * sin((float(50.0) * (pos).z)))), (float)65.0)));
        (res = opU(res, float2((float(0.5) * sdTorus(opTwist((pos - float3((float)(-2.0), (float)0.25, (float)2.0))), float2((float)0.2, (float)0.05))), (float)46.7000007)));
        (res = opU(res, float2(sdConeSection((pos - float3((float)0.0, (float)0.35, (float)(-2.0))), float(0.15), float(0.2), float(0.1)), (float)13.67000008)));
        return res;
    };
    float2 castRay(float3 ro, float3 rd)
    {
        float tmin = float(1.0);
        float tmax = float(20.0);
        float tp1 = ((float(0.0) - (ro).y) / (rd).y);
        if (tp1 > float(0.0))
        {
            (tmax = min((float)tmax,(float)tp1));
        }
        float tp2 = ((float(1.6) - (ro).y) / (rd).y);
        if (tp2 > float(0.0))
        {
            if (ro.y > float(1.6))
            {
                (tmin = max((float)tmin,(float)tp2));
            }
            else
            {
                (tmax = min((float)tmax,(float)tp2));
            }
        }
        float t = tmin;
        float m = float((-1.0));
        for (int i = 0; (i < 64); (i++))
        {
            float precis = (float(0.00050000000) * t);
            float2 res = map((ro + (rd * float3(t))));
            if (res.x < precis || (t > tmax))
            {
                break;
            }
            (t += (res).x);
            (m = (res).y);
        }
        if (t > tmax)
        {
            (m = float((-1.0)));
        }
        return float2(t, m);
    };
    float softshadow(float3 ro, float3 rd, float mint, float tmax)
    {
        float res = float(1.0);
        float t = mint;
        for (int i = 0; (i < 16); (i++))
        {
            float h = (map((ro + (rd * float3(t))))).x;
            (res = min((float)res,(float)float(8.0) * h / t));
            (t += clamp(h, float(0.020000000), float(0.1)));
            if (h < float(0.0010000000) || (t > tmax))
            {
                break;
            }
        }
        return saturate(res);
    };
    float3 calcNormal(float3 pos)
    {
        float2 e = ((float2((float)1.0, (float)(-1.0)) * float2(0.57730000)) * float2(0.00050000000));
        return normalize((((((e).xyy * float3(map((pos + (e).xyy)).x)) + ((e).yyx * float3(map((pos + (e).yyx)).x))) + ((e).yxy * float3(map((pos + (e).yxy)).x))) + ((e).xxx * float3(map((pos + (e).xxx)).x))));
    };
    float calcAO(float3 pos, float3 nor)
    {
        float occ = float(0.0);
        float sca = float(1.0);
        for (int i = 0; (i < 5); (i++))
        {
            float hr = (float(0.010000000) + ((float(0.12000000) * float((float)i)) / float(4.0)));
            float3 aopos = ((nor * float3(hr)) + pos);
            float dd = (map(aopos)).x;
            (occ += ((-(dd - hr)) * sca));
            (sca *= float(0.95));
        }
        return clamp((float(1.0) - (float(3.0) * occ)), float(0.0), float(1.0));
    };
    float3 render(float3 ro, float3 rd)
    {
        float3 col = (float3((float)0.7, (float)0.9, (float)1.0) + float3(rd.y * float(0.8)));
        float2 res = castRay(ro, rd);
        float t = (res).x;
        float m = (res).y;
        if (m > float((-0.5)))
        {
            float3 pos = (ro + (float3(t) * rd));
            float3 nor = calcNormal(pos);
            float3 ref = reflect(rd, nor);
            (col = (float3(0.45) + (float3(0.35) * sin((float3((float)0.05, (float)0.080000000, (float)0.1) * float3(m - float(1.0)))))));
            if (m < float(1.5))
            {
                float f = fmod(abs((floor((float(5.0) * (pos).z)) + floor((float(5.0) * (pos).x)))), float(2.0));
                (col = float3(float(0.3) + (float(0.1) * f)));
            }
            float occ = calcAO(pos, nor);
            float3 lig = normalize(float3((float)(-0.4), (float)0.7, (float)(-0.6)));
            float amb = clamp((float(0.5) + (float(0.5) * (nor).y)), float(0.0), float(1.0));
            float dif = clamp(dot(nor, lig), float(0.0), float(1.0));
            float bac = (clamp(dot(nor, normalize(float3((-(lig).x), (float)0.0, (-(lig).z)))), float(0.0), float(1.0)) * clamp((float(1.0) - (pos).y), float(0.0), float(1.0)));
            float dom = smoothstep(float((-0.1)), float(0.1), (ref).y);
            float fre = pow(clamp((float(1.0) + dot(nor, rd)), float(0.0), float(1.0)), float(2.0));
            float spe = pow(clamp(dot(ref, lig), float(0.0), float(1.0)), float(16.0));
            (dif *= softshadow(pos, lig, float(0.020000000), float(2.5)));
            (dom *= softshadow(pos, ref, float(0.020000000), float(2.5)));
            float3 lin = float3(0.0);
            (lin += (float3(float(1.29999996) * dif) * float3((float)1.0, (float)0.8, (float)0.55)));
            (lin += ((float3(float(2.0) * spe) * float3((float)1.0, (float)0.9, (float)0.7)) * float3(dif)));
            (lin += ((float3(float(0.4) * amb) * float3((float)0.4, (float)0.6, (float)1.0)) * float3(occ)));
            (lin += ((float3(float(0.5) * dom) * float3((float)0.4, (float)0.6, (float)1.0)) * float3(occ)));
            (lin += ((float3(float(0.5) * bac) * float3((float)0.25, (float)0.25, (float)0.25)) * float3(occ)));
            (lin += ((float3(float(0.25) * fre) * float3((float)1.0, (float)1.0, (float)1.0)) * float3(occ)));
            (col = (col * lin));
            (col = mix(col, float3((float)0.8, (float)0.9, (float)1.0), float3(float(1.0) - exp((((float((-0.00020000000)) * t) * t) * t)))));
        }
        return saturate(col);
    };
    float4 main(float4 pixelCoord)
    {
        float3 tot = float3(0.0);
        float2 p = (((-(u_input.resolution).xy) + (float2(2.0) * (pixelCoord).xy)) / float2(u_input.resolution.y));
        ((p).y = (-(p).y));
        float3 rd = (((u_input.invView)*(normalize(float4((p).xy, (float)2.0, (float)0.0))))).xyz;
        float3 ro = float3((u_input.invView[0]).w, (u_input.invView[1]).w, (u_input.invView[2]).w);
        float3 col = render(ro, rd);
        (col = pow(col, float3(0.4545)));
        (tot += col);
        return float4(tot, (float)1.0);
    };

    Fragment_Shader(constant Uniforms_u_input& u_input) :
        u_input(u_input)
    {}
};
struct ArgBuffer1
{
    constant Fragment_Shader::Uniforms_u_input& u_input [[id(0)]];
};

fragment float4 stageMain(
    float4 pixelCoord [[position]],
    constant ArgBuffer1& argBuffer1 [[buffer(1)]])
{
    float4 pixelCoord0;
    pixelCoord0 = pixelCoord;
    Fragment_Shader main(argBuffer1.u_input);
    return main.main(pixelCoord0);
}
