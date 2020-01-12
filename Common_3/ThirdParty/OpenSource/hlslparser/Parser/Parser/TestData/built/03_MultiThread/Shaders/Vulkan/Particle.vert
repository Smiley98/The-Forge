#version 450 core

precision highp float;
precision highp int; 
vec4 MulMat(mat4 lhs, vec4 rhs)
{
    vec4 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1] + lhs[0][2]*rhs[2] + lhs[0][3]*rhs[3];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1] + lhs[1][2]*rhs[2] + lhs[1][3]*rhs[3];
	dst[2] = lhs[2][0]*rhs[0] + lhs[2][1]*rhs[1] + lhs[2][2]*rhs[2] + lhs[2][3]*rhs[3];
	dst[3] = lhs[3][0]*rhs[0] + lhs[3][1]*rhs[1] + lhs[3][2]*rhs[2] + lhs[3][3]*rhs[3];
    return dst;
}


layout(location = 0) in uint POSITION;
layout(location = 0) out float vertOutput_TEXCOORD;

layout(row_major, set = 1, binding = 0) uniform uniformBlock
{
    mat4 mvp;
};

layout(row_major, push_constant) uniform particleRootConstant_Block
{
    float paletteFactor;
    uint data;
    uint textureIndex;
}particleRootConstant;

struct VSOutput
{
    vec4 Position;
    float TexCoord;
};
VSOutput HLSLmain(uint seed)
{
    VSOutput result;
    uint rnd = seed;
    uint rnd_mat = particleRootConstant.data;
    float tt = particleRootConstant.paletteFactor;
    uint para2 = uint(907633515);
    uint para1 = uint(196314165);
    vec4 p;
    float c = 0.0;
    float test = float(rnd);
    (rnd = ((rnd * para1) + para2));
    ((p).x = (float(rnd) * 2.328306e-10));
    (rnd = ((rnd * para1) + para2));
    ((p).y = (test * 2.328306e-10));
    (rnd = ((rnd * para1) + para2));
    ((p).z = (float(rnd) * 2.328306e-10));
    ((p).w = 1.0);
    vec3 t0, s0, r0, t1, s1, r1;
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((t0).x = (float((-1.29999996)) + ((float(2.59999992) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((t0).y = (float((-1.29999996)) + ((float(2.59999992) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((t0).z = (float((-1.29999996)) + ((float(2.59999992) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((s0).x = (float(0.8) + ((float(0.2) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((s0).y = (float(0.8) + ((float(0.2) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((s0).z = (float(0.8) + ((float(0.2) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((r0).x = ((float(1.5707963) * float(rnd_mat)) * 2.328306e-10));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((r0).y = ((float(1.5707963) * float(rnd_mat)) * 2.328306e-10));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((r0).z = ((float(1.5707963) * float(rnd_mat)) * 2.328306e-10));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((t1).x = (float((-1.29999996)) + ((float(2.59999992) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((t1).y = (float((-1.29999996)) + ((float(2.59999992) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((t1).z = (float((-1.29999996)) + ((float(2.59999992) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((s1).x = (float(0.8) + ((float(0.2) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((s1).y = (float(0.8) + ((float(0.2) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((s1).z = (float(0.8) + ((float(0.2) * float(rnd_mat)) * 2.328306e-10)));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((r1).x = ((float(1.5707963) * float(rnd_mat)) * 2.328306e-10));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((r1).y = ((float(1.5707963) * float(rnd_mat)) * 2.328306e-10));
    (rnd_mat = ((rnd_mat * uint(196314165)) + uint(907633515)));
    ((r1).z = ((float(1.5707963) * float(rnd_mat)) * 2.328306e-10));
    float tmp0_ch = cos((r0).x);
    float tmp0_sh = sin((r0).x);
    float tmp0_cp = cos((r0).y);
    float tmp0_sp = sin((r0).y);
    float tmp0_cb = cos((r0).z);
    float tmp0_sb = sin((r0).z);
    float tmp1_ch = cos((r1).x);
    float tmp1_sh = sin((r1).x);
    float tmp1_cp = cos((r1).y);
    float tmp1_sp = sin((r1).y);
    float tmp1_cb = cos((r1).z);
    float tmp1_sb = sin((r1).z);
    float tt0 = (float(1.0) - tt);
    mat4 transform;
    (transform[0][0] = ((((tmp0_ch * tmp0_cb) + (((tmp0_sh * tmp0_sp) * tmp0_sb) * (s0).x)) * tt0) + (((tmp1_ch * tmp1_cb) + (((tmp1_sh * tmp1_sp) * tmp1_sb) * (s1).x)) * tt)));
    (transform[0][1] = (((tmp0_sb * tmp0_cp) * tt0) + ((tmp1_sb * tmp1_cp) * tt)));
    (transform[0][2] = (((((-tmp0_sh) * tmp0_cb) + ((tmp0_ch * tmp0_sp) * tmp0_sb)) * tt0) + ((((-tmp1_sh) * tmp1_cb) + ((tmp1_ch * tmp1_sp) * tmp1_sb)) * tt)));
    (transform[0][3] = float(0.0));
    (transform[1][0] = (((((-tmp0_ch) * tmp0_sb) + ((tmp0_sh * tmp0_sp) * tmp0_cb)) * tt0) + ((((-tmp1_ch) * tmp1_sb) + ((tmp1_sh * tmp1_sp) * tmp1_cb)) * tt)));
    (transform[1][1] = ((((tmp0_cb * tmp0_cp) * (s0).y) * tt0) + (((tmp1_cb * tmp1_cp) * (s1).y) * tt)));
    (transform[1][2] = ((((tmp0_sb * tmp0_sh) + ((tmp0_ch * tmp0_sp) * tmp0_cb)) * tt0) + (((tmp1_sb * tmp1_sh) + ((tmp1_ch * tmp1_sp) * tmp1_cb)) * tt)));
    (transform[1][3] = float(0.0));
    (transform[2][0] = (((tmp0_sh * tmp0_cp) * tt0) + ((tmp1_sh * tmp1_cp) * tt)));
    (transform[2][1] = (((-tmp0_sp) * tt0) + ((-tmp1_sp) * tt)));
    (transform[2][2] = ((((tmp0_ch * tmp0_cp) * (s0).z) * tt0) + (((tmp1_ch * tmp1_cp) * (s1).z) * tt)));
    (transform[2][3] = float(0.0));
    (transform[3][0] = (((t0).x * tt0) + ((t1).x * tt)));
    (transform[3][1] = (((t0).y * tt0) + ((t1).y * tt)));
    (transform[3][2] = (((t0).z * tt0) + ((t1).z * tt)));
    (transform[3][3] = float(1.0));
    (transform = transpose(transform));
    for (int i = 0; (i < 8); (++i))
    {
        (p = MulMat(transform,p));
        float radius = length(p);
        float theta = ((p).y * (float(1.0) / (p).x));
        (p = vec4((radius * cos((theta - radius))), (radius * sin((theta - radius))), (p).z, (p).w));
        (c += (float(0.1) * sin(theta)));
    }
    ((result).Position = MulMat(mvp,p));
    ((result).TexCoord = c);
    return result;
}
void main()
{
    uint seed;
    seed = POSITION;
    VSOutput result = HLSLmain(seed);
    gl_Position = result.Position;
    vertOutput_TEXCOORD = result.TexCoord;
}
