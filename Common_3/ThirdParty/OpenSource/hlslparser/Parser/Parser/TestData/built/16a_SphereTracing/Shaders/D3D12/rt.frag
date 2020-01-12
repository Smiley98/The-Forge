cbuffer u_input : register(b0, space1)
{
    float4 resolution;
    float4x4 invView;
};

float sdPlane(float3 p)
{
    return p.y;
};

float sdSphere(float3 p, float s)
{
    return (length(p) - s);
};

float sdBox(float3 p, float3 b)
{
    float3 d = (abs(p) - b);
    return (min(max(d.x, max(d.y, d.z)), (const float )(0.0)) + length(max(d, (const float3 )(0.0))));
};

float sdEllipsoid(in float3 p, in float3 r)
{
    return ((length((p / r)) - (float )(1.0)) * min(min(r.x, r.y), r.z));
};

float udRoundBox(float3 p, float3 b, float r)
{
    return (length(max((abs(p) - b), (const float3 )(0.0))) - r);
};

float sdTorus(float3 p, float2 t)
{
    return (length(float2((length(p.xz) - t.x), p.y)) - t.y);
};

float sdHexPrism(float3 p, float2 h)
{
    float3 q = abs(p);
    float d1 = (q.z - h.y);
    float d2 = (max(((q.x * (float )(0.8660250)) + (q.y * (float )(0.5))), q.y) - h.x);
    return (length(max(float2(d1, d2), (const float2 )(0.0))) + min(max(d1, d2), (const float )(0.0)));
};

float sdCapsule(float3 p, float3 a, float3 b, float r)
{
    float3 pa = (p - a), ba = (b - a);
    float h = clamp((dot(pa, ba) / dot(ba, ba)), (const float )(0.0), (const float )(1.0));
    return (length((pa - (ba * (float3 )(h)))) - r);
};

float sdTriPrism(float3 p, float2 h)
{
    float3 q = abs(p);
    float d1 = (q.z - h.y);
    float d2 = (max(((q.x * (float )(0.8660250)) + (p.y * (float )(0.5))), -p.y) - (h.x * (float )(0.5)));
    return (length(max(float2(d1, d2), (const float2 )(0.0))) + min(max(d1, d2), (const float )(0.0)));
};

float sdCylinder(float3 p, float2 h)
{
    float2 d = (abs(float2(length(p.xz), p.y)) - h);
    return (min(max(d.x, d.y), (const float )(0.0)) + length(max(d, (const float2 )(0.0))));
};

float sdCone(in float3 p, in float3 c)
{
    float2 q = float2(length(p.xz), p.y);
    float d1 = (-q.y - c.z);
    float d2 = max(dot(q, c.xy), q.y);
    return (length(max(float2(d1, d2), (const float2 )(0.0))) + min(max(d1, d2), (const float )(0.0)));
};

float sdConeSection(in float3 p, in float h, in float r1, in float r2)
{
    float d1 = (-p.y - h);
    float q = (p.y - h);
    float si = (((float )(0.5) * (r1 - r2)) / h);
    float d2 = max(((sqrt((dot(p.xz, p.xz) * ((float )(1.0) - (si * si)))) + (q * si)) - r2), q);
    return (length(max(float2(d1, d2), (const float2 )(0.0))) + min(max(d1, d2), (const float )(0.0)));
};

float sdPryamid4(float3 p, float3 h)
{
    float box = sdBox((p - float3(0, ((float )(-2.0) * h.z), 0)), (float3 )((float )(2.0) * h.z));
    float d = (float )(0.0);
    (d = max(d, abs(dot(p, float3(-h.x, h.y, 0)))));
    (d = max(d, abs(dot(p, float3(h.x, h.y, 0)))));
    (d = max(d, abs(dot(p, float3(0, h.y, h.x)))));
    (d = max(d, abs(dot(p, float3(0, h.y, -h.x)))));
    float octa = (d - h.z);
    return max(-box, octa);
};

float length2(float2 p)
{
    return sqrt(((p.x * p.x) + (p.y * p.y)));
};

float length6(float2 p)
{
    (p = ((p * p) * p));
    (p = (p * p));
    return pow((p.x + p.y), (const float )(1.0 / 6.0));
};

float length8(float2 p)
{
    (p = (p * p));
    (p = (p * p));
    (p = (p * p));
    return pow((p.x + p.y), (const float )(1.0 / 8.0));
};

float sdTorus82(float3 p, float2 t)
{
    float2 q = float2((length2(p.xz) - t.x), p.y);
    return (length8(q) - t.y);
};

float sdTorus88(float3 p, float2 t)
{
    float2 q = float2((length8(p.xz) - t.x), p.y);
    return (length8(q) - t.y);
};

float sdCylinder6(float3 p, float2 h)
{
    return max((length6(p.xz) - h.x), (abs(p.y) - h.y));
};

float opS(float d1, float d2)
{
    return max(-d2, d1);
};

float2 opU(float2 d1, float2 d2)
{
    return (((d1.x < d2.x))?(d1):(d2));
};

float3 opRep(float3 p, float3 c)
{
    return (abs(fmod(p, c)) - ((float3 )(0.5) * c));
};

float3 opTwist(float3 p)
{
    float c = cos((((float )(10.0) * p.y) + (float )(10.0)));
    float s = sin((((float )(10.0) * p.y) + (float )(10.0)));
    float2x2 m = float2x2(c, -s, s, c);
    return float3(mul(m, p.xz), p.y);
};

float2 map(in float3 pos)
{
    float2 res = opU(float2(sdPlane(pos), 1.0), float2(sdSphere((pos - float3(0.0, 0.25, 0.0)), (float )(0.25)), 46.9000015));
    (res = opU(res, float2(sdBox((pos - float3(1.0, 0.25, 0.0)), (float3 )(0.25)), 3.0)));
    (res = opU(res, float2(udRoundBox((pos - float3(1.0, 0.25, 1.0)), (float3 )(0.15), (float )(0.1)), 41.0)));
    (res = opU(res, float2(sdTorus((pos - float3(0.0, 0.25, 1.0)), float2(0.2, 0.05)), 25.0)));
    (res = opU(res, float2(sdCapsule(pos, float3(-1.29999996, 0.1, -0.1), float3(-0.8, 0.5, 0.2), (float )(0.1)), 31.8999996)));
    (res = opU(res, float2(sdTriPrism((pos - float3(-1.0, 0.25, -1.0)), float2(0.25, 0.05)), 43.5)));
    (res = opU(res, float2(sdCylinder((pos - float3(1.0, 0.3, -1.0)), float2(0.1, 0.2)), 8.0)));
    (res = opU(res, float2(sdCone((pos - float3(0.0, 0.5, -1.0)), float3(0.8, 0.6, 0.3)), 55.0)));
    (res = opU(res, float2(sdTorus82((pos - float3(0.0, 0.25, 2.0)), float2(0.2, 0.05)), 50.0)));
    (res = opU(res, float2(sdTorus88((pos - float3(-1.0, 0.25, 2.0)), float2(0.2, 0.05)), 43.0)));
    (res = opU(res, float2(sdCylinder6((pos - float3(1.0, 0.3, 2.0)), float2(0.1, 0.2)), 12.0)));
    (res = opU(res, float2(sdHexPrism((pos - float3(-1.0, 0.2, 1.0)), float2(0.25, 0.05)), 17.0)));
    (res = opU(res, float2(sdPryamid4((pos - float3(-1.0, 0.15, -2.0)), float3(0.8, 0.6, 0.25)), 37.0)));
    (res = opU(res, float2(opS(udRoundBox((pos - float3(-2.0, 0.2, 1.0)), (float3 )(0.15), (float )(0.05)), sdSphere((pos - float3(-2.0, 0.2, 1.0)), (float )(0.25))), 13.0)));
    (res = opU(res, float2(opS(sdTorus82((pos - float3(-2.0, 0.2, 0.0)), float2(0.2, 0.1)), sdCylinder(opRep(float3((atan2((pos.x + (float )(2.0)), pos.z) / (float )(6.28310012)), pos.y, ((float )(0.020000000) + ((float )(0.5) * length((pos - float3(-2.0, 0.2, 0.0)))))), float3(0.05, 1.0, 0.05)), float2(0.020000000, 0.6))), 51.0)));
    (res = opU(res, float2((((float )(0.5) * sdSphere((pos - float3(-2.0, 0.25, -1.0)), (float )(0.2))) + ((((float )(0.030000000) * sin(((float )(50.0) * pos.x))) * sin(((float )(50.0) * pos.y))) * sin(((float )(50.0) * pos.z)))), 65.0)));
    (res = opU(res, float2(((float )(0.5) * sdTorus(opTwist((pos - float3(-2.0, 0.25, 2.0))), float2(0.2, 0.05))), 46.7000007)));
    (res = opU(res, float2(sdConeSection((pos - float3(0.0, 0.35, -2.0)), (float )(0.15), (float )(0.2), (float )(0.1)), 13.67000008)));
    return res;
};

float2 castRay(in float3 ro, in float3 rd)
{
    float tmin = (float )(1.0);
    float tmax = (float )(20.0);
    float tp1 = (((float )(0.0) - ro.y) / rd.y);
    if (tp1 > (float )(0.0))
    {
        (tmax = min(tmax, tp1));
    }
    float tp2 = (((float )(1.6) - ro.y) / rd.y);
    if (tp2 > (float )(0.0))
    {
        if (ro.y > (float )(1.6))
        {
            (tmin = max(tmin, tp2));
        }
        else
        {
            (tmax = min(tmax, tp2));
        }
    }
    float t = tmin;
    float m = (float )(-1.0);
    for (int i = 0; (i < 64); i++)
    {
        float precis = ((float )(0.00050000000) * t);
        float2 res = map((ro + (rd * (float3 )(t))));
        if (res.x < precis || (t > tmax))
        {
            break;
        }
        (t += res.x);
        (m = res.y);
    }
    if (t > tmax)
    {
        (m = (float )(-1.0));
    }
    return float2(t, m);
};

float softshadow(in float3 ro, in float3 rd, in float mint, in float tmax)
{
    float res = (float )(1.0);
    float t = mint;
    for (int i = 0; (i < 16); i++)
    {
        float h = map((ro + (rd * (float3 )(t)))).x;
        (res = min(res, (((float )(8.0) * h) / t)));
        (t += clamp(h, (const float )(0.020000000), (const float )(0.1)));
        if (h < (float )(0.0010000000) || (t > tmax))
        {
            break;
        }
    }
    return saturate(res);
};

float3 calcNormal(in float3 pos)
{
    float2 e = ((float2(1.0, -1.0) * (float2 )(0.57730000)) * (float2 )(0.00050000000));
    return normalize(((((e.xyy * (float3 )(map((pos + e.xyy)).x)) + (e.yyx * (float3 )(map((pos + e.yyx)).x))) + (e.yxy * (float3 )(map((pos + e.yxy)).x))) + (e.xxx * (float3 )(map((pos + e.xxx)).x))));
};

float calcAO(in float3 pos, in float3 nor)
{
    float occ = (float )(0.0);
    float sca = (float )(1.0);
    for (int i = 0; (i < 5); i++)
    {
        float hr = ((float )(0.010000000) + (((float )(0.12000000) * float(i)) / (float )(4.0)));
        float3 aopos = ((nor * (float3 )(hr)) + pos);
        float dd = map(aopos).x;
        (occ += (-(dd - hr) * sca));
        (sca *= (float )(0.95));
    }
    return clamp(((float )(1.0) - ((float )(3.0) * occ)), (const float )(0.0), (const float )(1.0));
};

float3 render(in float3 ro, in float3 rd)
{
    float3 col = (float3(0.7, 0.9, 1.0) + (float3 )(rd.y * (float )(0.8)));
    float2 res = castRay(ro, rd);
    float t = res.x;
    float m = res.y;
    if (m > (float )(-0.5))
    {
        float3 pos = (ro + ((float3 )(t) * rd));
        float3 nor = calcNormal(pos);
        float3 ref = reflect(rd, nor);
        (col = ((float3 )(0.45) + ((float3 )(0.35) * sin((float3(0.05, 0.080000000, 0.1) * (float3 )(m - (float )(1.0)))))));
        if (m < (float )(1.5))
        {
            float f = fmod(abs((floor(((float )(5.0) * pos.z)) + floor(((float )(5.0) * pos.x)))), (const float )(2.0));
            (col = (float3 )((float )(0.3) + ((float )(0.1) * f)));
        }
        float occ = calcAO(pos, nor);
        float3 lig = normalize(float3(-0.4, 0.7, -0.6));
        float amb = clamp(((float )(0.5) + ((float )(0.5) * nor.y)), (const float )(0.0), (const float )(1.0));
        float dif = clamp(dot(nor, lig), (const float )(0.0), (const float )(1.0));
        float bac = (clamp(dot(nor, normalize(float3(-lig.x, 0.0, -lig.z))), (const float )(0.0), (const float )(1.0)) * clamp(((float )(1.0) - pos.y), (const float )(0.0), (const float )(1.0)));
        float dom = smoothstep((const float )(-0.1), (const float )(0.1), ref.y);
        float fre = pow(clamp(((float )(1.0) + dot(nor, rd)), (const float )(0.0), (const float )(1.0)), (const float )(2.0));
        float spe = pow(clamp(dot(ref, lig), (const float )(0.0), (const float )(1.0)), (const float )(16.0));
        (dif *= softshadow(pos, lig, (float )(0.020000000), (float )(2.5)));
        (dom *= softshadow(pos, ref, (float )(0.020000000), (float )(2.5)));
        float3 lin = (float3 )(0.0);
        (lin += ((float3 )((float )(1.29999996) * dif) * float3(1.0, 0.8, 0.55)));
        (lin += (((float3 )((float )(2.0) * spe) * float3(1.0, 0.9, 0.7)) * (float3 )(dif)));
        (lin += (((float3 )((float )(0.4) * amb) * float3(0.4, 0.6, 1.0)) * (float3 )(occ)));
        (lin += (((float3 )((float )(0.5) * dom) * float3(0.4, 0.6, 1.0)) * (float3 )(occ)));
        (lin += (((float3 )((float )(0.5) * bac) * float3(0.25, 0.25, 0.25)) * (float3 )(occ)));
        (lin += (((float3 )((float )(0.25) * fre) * float3(1.0, 1.0, 1.0)) * (float3 )(occ)));
        (col = (col * lin));
        (col = lerp(col, float3(0.8, 0.9, 1.0), (const float3 )((float )(1.0) - exp(((((float )(-0.00020000000) * t) * t) * t)))));
    }
    return saturate(col);
};

float4 main(float4 pixelCoord : SV_POSITION) : SV_TARGET
{
    float3 tot = (float3 )(0.0);
    float2 p = ((-resolution.xy + ((float2 )(2.0) * pixelCoord.xy)) / (float2 )(resolution.y));
    (p.y = -p.y);
    float3 rd = mul(invView, normalize(float4(p.xy, 2.0, 0.0))).xyz;
    float3 ro = float3(invView[0].w, invView[1].w, invView[2].w);
    float3 col = render(ro, rd);
    (col = pow(col, (const float3 )(0.4545)));
    (tot += col);
    return float4(tot, 1.0);
};

