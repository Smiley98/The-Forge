#version 450 core

precision highp float;
precision highp int; 
vec2 MulMat(mat2 lhs, vec2 rhs)
{
    vec2 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1];
    return dst;
}

vec4 MulMat(mat4 lhs, vec4 rhs)
{
    vec4 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1] + lhs[0][2]*rhs[2] + lhs[0][3]*rhs[3];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1] + lhs[1][2]*rhs[2] + lhs[1][3]*rhs[3];
	dst[2] = lhs[2][0]*rhs[0] + lhs[2][1]*rhs[1] + lhs[2][2]*rhs[2] + lhs[2][3]*rhs[3];
	dst[3] = lhs[3][0]*rhs[0] + lhs[3][1]*rhs[1] + lhs[3][2]*rhs[2] + lhs[3][3]*rhs[3];
    return dst;
}


layout(location = 0) out vec4 rast_FragData0; 

layout(row_major, set = 1, binding = 0) uniform u_input
{
    vec4 resolution;
    mat4 invView;
};

float sdPlane(vec3 p)
{
    return (p).y;
}
float sdSphere(vec3 p, float s)
{
    return (length(p) - s);
}
float sdBox(vec3 p, vec3 b)
{
    vec3 d = (abs(p) - b);
    return (min(max((d).x, max((d).y, (d).z)), float(0.0)) + length(max(d, vec3(0.0))));
}
float sdEllipsoid(in vec3 p, in vec3 r)
{
    return ((length((p / r)) - float(1.0)) * min(min((r).x, (r).y), (r).z));
}
float udRoundBox(vec3 p, vec3 b, float r)
{
    return (length(max((abs(p) - b), vec3(0.0))) - r);
}
float sdTorus(vec3 p, vec2 t)
{
    return (length(vec2((length((p).xz) - (t).x), (p).y)) - (t).y);
}
float sdHexPrism(vec3 p, vec2 h)
{
    vec3 q = abs(p);
    float d1 = ((q).z - (h).y);
    float d2 = (max((((q).x * float(0.8660250)) + ((q).y * float(0.5))), (q).y) - (h).x);
    return (length(max(vec2(d1, d2), vec2(0.0))) + min(max(d1, d2), float(0.0)));
}
float sdCapsule(vec3 p, vec3 a, vec3 b, float r)
{
    vec3 pa = (p - a), ba = (b - a);
    float h = clamp((dot(pa, ba) / dot(ba, ba)), float(0.0), float(1.0));
    return (length((pa - (ba * vec3(h)))) - r);
}
float sdTriPrism(vec3 p, vec2 h)
{
    vec3 q = abs(p);
    float d1 = ((q).z - (h).y);
    float d2 = (max((((q).x * float(0.8660250)) + ((p).y * float(0.5))), (-(p).y)) - ((h).x * float(0.5)));
    return (length(max(vec2(d1, d2), vec2(0.0))) + min(max(d1, d2), float(0.0)));
}
float sdCylinder(vec3 p, vec2 h)
{
    vec2 d = (abs(vec2(length((p).xz), (p).y)) - h);
    return (min(max((d).x, (d).y), float(0.0)) + length(max(d, vec2(0.0))));
}
float sdCone(in vec3 p, in vec3 c)
{
    vec2 q = vec2(length((p).xz), (p).y);
    float d1 = ((-(q).y) - (c).z);
    float d2 = max(dot(q, (c).xy), (q).y);
    return (length(max(vec2(d1, d2), vec2(0.0))) + min(max(d1, d2), float(0.0)));
}
float sdConeSection(in vec3 p, in float h, in float r1, in float r2)
{
    float d1 = ((-(p).y) - h);
    float q = ((p).y - h);
    float si = ((float(0.5) * (r1 - r2)) / h);
    float d2 = max(((sqrt((dot((p).xz, (p).xz) * (float(1.0) - (si * si)))) + (q * si)) - r2), q);
    return (length(max(vec2(d1, d2), vec2(0.0))) + min(max(d1, d2), float(0.0)));
}
float sdPryamid4(vec3 p, vec3 h)
{
    float box = sdBox((p - vec3(0, (float((-2.0)) * (h).z), 0)), vec3((float(2.0) * (h).z)));
    float d = float(0.0);
    (d = max(d, abs(dot(p, vec3((-(h).x), (h).y, 0)))));
    (d = max(d, abs(dot(p, vec3((h).x, (h).y, 0)))));
    (d = max(d, abs(dot(p, vec3(0, (h).y, (h).x)))));
    (d = max(d, abs(dot(p, vec3(0, (h).y, (-(h).x))))));
    float octa = (d - (h).z);
    return max((-box), octa);
}
float length2(vec2 p)
{
    return sqrt((((p).x * (p).x) + ((p).y * (p).y)));
}
float length6(vec2 p)
{
    (p = ((p * p) * p));
    (p = (p * p));
    return pow(((p).x + (p).y),float(float((1.0 / 6.0))));
}
float length8(vec2 p)
{
    (p = (p * p));
    (p = (p * p));
    (p = (p * p));
    return pow(((p).x + (p).y),float(float((1.0 / 8.0))));
}
float sdTorus82(vec3 p, vec2 t)
{
    vec2 q = vec2((length2((p).xz) - (t).x), (p).y);
    return (length8(q) - (t).y);
}
float sdTorus88(vec3 p, vec2 t)
{
    vec2 q = vec2((length8((p).xz) - (t).x), (p).y);
    return (length8(q) - (t).y);
}
float sdCylinder6(vec3 p, vec2 h)
{
    return max((length6((p).xz) - (h).x), (abs((p).y) - (h).y));
}
float opS(float d1, float d2)
{
    return max((-d2), d1);
}
vec2 opU(vec2 d1, vec2 d2)
{
    return ((((d1).x < (d2).x))?(d1):(d2));
}
vec3 opRep(vec3 p, vec3 c)
{
    return (abs(mod(p, c)) - (vec3(0.5) * c));
}
vec3 opTwist(vec3 p)
{
    float c = cos(((float(10.0) * (p).y) + float(10.0)));
    float s = sin(((float(10.0) * (p).y) + float(10.0)));
    mat2 m = mat2(c, (-s), s, c);
    return vec3(MulMat(m,(p).xz), (p).y);
}
vec2 map(in vec3 pos)
{
    vec2 res = opU(vec2(sdPlane(pos), 1.0), vec2(sdSphere((pos - vec3(0.0, 0.25, 0.0)), float(0.25)), 46.9000015));
    (res = opU(res, vec2(sdBox((pos - vec3(1.0, 0.25, 0.0)), vec3(0.25)), 3.0)));
    (res = opU(res, vec2(udRoundBox((pos - vec3(1.0, 0.25, 1.0)), vec3(0.15), float(0.1)), 41.0)));
    (res = opU(res, vec2(sdTorus((pos - vec3(0.0, 0.25, 1.0)), vec2(0.2, 0.05)), 25.0)));
    (res = opU(res, vec2(sdCapsule(pos, vec3((-1.29999996), 0.1, (-0.1)), vec3((-0.8), 0.5, 0.2), float(0.1)), 31.8999996)));
    (res = opU(res, vec2(sdTriPrism((pos - vec3((-1.0), 0.25, (-1.0))), vec2(0.25, 0.05)), 43.5)));
    (res = opU(res, vec2(sdCylinder((pos - vec3(1.0, 0.3, (-1.0))), vec2(0.1, 0.2)), 8.0)));
    (res = opU(res, vec2(sdCone((pos - vec3(0.0, 0.5, (-1.0))), vec3(0.8, 0.6, 0.3)), 55.0)));
    (res = opU(res, vec2(sdTorus82((pos - vec3(0.0, 0.25, 2.0)), vec2(0.2, 0.05)), 50.0)));
    (res = opU(res, vec2(sdTorus88((pos - vec3((-1.0), 0.25, 2.0)), vec2(0.2, 0.05)), 43.0)));
    (res = opU(res, vec2(sdCylinder6((pos - vec3(1.0, 0.3, 2.0)), vec2(0.1, 0.2)), 12.0)));
    (res = opU(res, vec2(sdHexPrism((pos - vec3((-1.0), 0.2, 1.0)), vec2(0.25, 0.05)), 17.0)));
    (res = opU(res, vec2(sdPryamid4((pos - vec3((-1.0), 0.15, (-2.0))), vec3(0.8, 0.6, 0.25)), 37.0)));
    (res = opU(res, vec2(opS(udRoundBox((pos - vec3((-2.0), 0.2, 1.0)), vec3(0.15), float(0.05)), sdSphere((pos - vec3((-2.0), 0.2, 1.0)), float(0.25))), 13.0)));
    (res = opU(res, vec2(opS(sdTorus82((pos - vec3((-2.0), 0.2, 0.0)), vec2(0.2, 0.1)), sdCylinder(opRep(vec3((atan(((pos).x + float(2.0)), (pos).z) / float(6.28310012)), (pos).y, (float(0.020000000) + (float(0.5) * length((pos - vec3((-2.0), 0.2, 0.0)))))), vec3(0.05, 1.0, 0.05)), vec2(0.020000000, 0.6))), 51.0)));
    (res = opU(res, vec2(((float(0.5) * sdSphere((pos - vec3((-2.0), 0.25, (-1.0))), float(0.2))) + (((float(0.030000000) * sin((float(50.0) * (pos).x))) * sin((float(50.0) * (pos).y))) * sin((float(50.0) * (pos).z)))), 65.0)));
    (res = opU(res, vec2((float(0.5) * sdTorus(opTwist((pos - vec3((-2.0), 0.25, 2.0))), vec2(0.2, 0.05))), 46.7000007)));
    (res = opU(res, vec2(sdConeSection((pos - vec3(0.0, 0.35, (-2.0))), float(0.15), float(0.2), float(0.1)), 13.67000008)));
    return res;
}
vec2 castRay(in vec3 ro, in vec3 rd)
{
    float tmin = float(1.0);
    float tmax = float(20.0);
    float tp1 = ((float(0.0) - (ro).y) / (rd).y);
    if((tp1 > float(0.0)))
    {
        (tmax = min(tmax, tp1));
    }
    float tp2 = ((float(1.6) - (ro).y) / (rd).y);
    if((tp2 > float(0.0)))
    {
        if(((ro).y > float(1.6)))
        {
            (tmin = max(tmin, tp2));
        }
        else
        {
            (tmax = min(tmax, tp2));
        }
    }
    float t = tmin;
    float m = float((-1.0));
    for (int i = 0; (i < 64); (i++))
    {
        float precis = (float(0.00050000000) * t);
        vec2 res = map((ro + (rd * vec3(t))));
        if((((res).x < precis) || (t > tmax)))
        {
            break;
        }
        (t += (res).x);
        (m = (res).y);
    }
    if((t > tmax))
    {
        (m = float((-1.0)));
    }
    return vec2(t, m);
}
float softshadow(in vec3 ro, in vec3 rd, in float mint, in float tmax)
{
    float res = float(1.0);
    float t = mint;
    for (int i = 0; (i < 16); (i++))
    {
        float h = (map((ro + (rd * vec3(t))))).x;
        (res = min(res, ((float(8.0) * h) / t)));
        (t += clamp(h, float(0.020000000), float(0.1)));
        if(((h < float(0.0010000000)) || (t > tmax)))
        {
            break;
        }
    }
    return clamp(res, 0.0, 1.0);
}
vec3 calcNormal(in vec3 pos)
{
    vec2 e = ((vec2(1.0, (-1.0)) * vec2(0.57730000)) * vec2(0.00050000000));
    return normalize((((((e).xyy * vec3((map((pos + (e).xyy))).x)) + ((e).yyx * vec3((map((pos + (e).yyx))).x))) + ((e).yxy * vec3((map((pos + (e).yxy))).x))) + ((e).xxx * vec3((map((pos + (e).xxx))).x))));
}
float calcAO(in vec3 pos, in vec3 nor)
{
    float occ = float(0.0);
    float sca = float(1.0);
    for (int i = 0; (i < 5); (i++))
    {
        float hr = (float(0.010000000) + ((float(0.12000000) * float(i)) / float(4.0)));
        vec3 aopos = ((nor * vec3(hr)) + pos);
        float dd = (map(aopos)).x;
        (occ += ((-(dd - hr)) * sca));
        (sca *= float(0.95));
    }
    return clamp((float(1.0) - (float(3.0) * occ)), float(0.0), float(1.0));
}
vec3 render(in vec3 ro, in vec3 rd)
{
    vec3 col = (vec3(0.7, 0.9, 1.0) + vec3(((rd).y * float(0.8))));
    vec2 res = castRay(ro, rd);
    float t = (res).x;
    float m = (res).y;
    if((m > float((-0.5))))
    {
        vec3 pos = (ro + (vec3(t) * rd));
        vec3 nor = calcNormal(pos);
        vec3 ref = reflect(rd, nor);
        (col = (vec3(0.45) + (vec3(0.35) * sin((vec3(0.05, 0.080000000, 0.1) * vec3((m - float(1.0))))))));
        if((m < float(1.5)))
        {
            float f = mod(abs((floor((float(5.0) * (pos).z)) + floor((float(5.0) * (pos).x)))), float(2.0));
            (col = vec3((float(0.3) + (float(0.1) * f))));
        }
        float occ = calcAO(pos, nor);
        vec3 lig = normalize(vec3((-0.4), 0.7, (-0.6)));
        float amb = clamp((float(0.5) + (float(0.5) * (nor).y)), float(0.0), float(1.0));
        float dif = clamp(dot(nor, lig), float(0.0), float(1.0));
        float bac = (clamp(dot(nor, normalize(vec3((-(lig).x), 0.0, (-(lig).z)))), float(0.0), float(1.0)) * clamp((float(1.0) - (pos).y), float(0.0), float(1.0)));
        float dom = smoothstep(float((-0.1)), float(0.1), (ref).y);
        float fre = pow(clamp((float(1.0) + dot(nor, rd)), float(0.0), float(1.0)),float(float(2.0)));
        float spe = pow(clamp(dot(ref, lig), float(0.0), float(1.0)),float(float(16.0)));
        (dif *= softshadow(pos, lig, float(0.020000000), float(2.5)));
        (dom *= softshadow(pos, ref, float(0.020000000), float(2.5)));
        vec3 lin = vec3(0.0);
        (lin += (vec3((float(1.29999996) * dif)) * vec3(1.0, 0.8, 0.55)));
        (lin += ((vec3((float(2.0) * spe)) * vec3(1.0, 0.9, 0.7)) * vec3(dif)));
        (lin += ((vec3((float(0.4) * amb)) * vec3(0.4, 0.6, 1.0)) * vec3(occ)));
        (lin += ((vec3((float(0.5) * dom)) * vec3(0.4, 0.6, 1.0)) * vec3(occ)));
        (lin += ((vec3((float(0.5) * bac)) * vec3(0.25, 0.25, 0.25)) * vec3(occ)));
        (lin += ((vec3((float(0.25) * fre)) * vec3(1.0, 1.0, 1.0)) * vec3(occ)));
        (col = (col * lin));
        (col = mix(col, vec3(0.8, 0.9, 1.0), vec3((float(1.0) - exp((((float((-0.00020000000)) * t) * t) * t))))));
    }
    return clamp(col, 0.0, 1.0);
}
vec4 HLSLmain(vec4 pixelCoord)
{
    vec3 tot = vec3(0.0);
    vec2 p = (((-(resolution).xy) + (vec2(2.0) * (pixelCoord).xy)) / vec2((resolution).y));
    ((p).y = (-(p).y));
    vec3 rd = (MulMat(invView,normalize(vec4((p).xy, 2.0, 0.0)))).xyz;
    vec3 ro = vec3((invView[0]).w, (invView[1]).w, (invView[2]).w);
    vec3 col = render(ro, rd);
    (col = pow(col,vec3(vec3(0.4545))));
    (tot += col);
    return vec4(tot, 1.0);
}
void main()
{
    vec4 pixelCoord;
    pixelCoord = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    vec4 result = HLSLmain(pixelCoord);
    rast_FragData0 = result;
}
