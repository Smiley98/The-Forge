#version 450 core

layout(location = 0) out vec4 outColor;

#define MAX_PLANETS 20
layout (std140, UPDATE_FREQ_PER_FRAME, binding=0) uniform uniformBlock {
    mat4 inverseWorldMatrices[MAX_PLANETS];
    mat4 invView;
    vec4 resolution;
    float scalings[MAX_PLANETS];

    //mat4 invView;
    //
    ////Inverse transformation matrices.
    //mat4 invSun;
    //mat4 invMerc;
    //mat4 invVenus;
    //mat4 invEarth;
    //mat4 invMars;
    //mat4 invJup;
    //mat4 invSat;
    //mat4 invUr;
    //mat4 invNept;
    //mat4 invPlu;
    //mat4 invMoon;
    //
    ////Uniform scaling floats.
    //float sSun;
    //float sMerc;
    //float sVenus;
    //float sEarth;
    //float sMars;
    //float sJup;
    //float sSat;
    //float sUr;
    //float sNept;
    //float sPlu;
    //float sMoon;
    //
    ////Screen resolution.
    //vec2 resolution;
} u_input;

#define AA 1   // make this 1 is your machine is too slow

//------------------------------------------------------------------

float sdPlane( vec3 p )
{
	return p.y;
}

float sdSphere( vec3 p, float s )
{
    return length(p)-s;
}

float sdBox( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdEllipsoid( in vec3 p, in vec3 r )
{
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float udRoundBox( vec3 p, vec3 b, float r )
{
    return length(max(abs(p)-b,0.0))-r;
}

float sdTorus( vec3 p, vec2 t )
{
    return length( vec2(length(p.xz)-t.x,p.y) )-t.y;
}

float sdHexPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);
#if 0
    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
#else
    float d1 = q.z-h.y;
    float d2 = max((q.x*0.866025+q.y*0.5),q.y)-h.x;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
#endif
}

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
	vec3 pa = p-a, ba = b-a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return length( pa - ba*h ) - r;
}

float sdTriPrism( vec3 p, vec2 h )
{
    vec3 q = abs(p);
#if 0
    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
#else
    float d1 = q.z-h.y;
    float d2 = max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
#endif
}

float sdCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCone( in vec3 p, in vec3 c )
{
    vec2 q = vec2( length(p.xz), p.y );
    float d1 = -q.y-c.z;
    float d2 = max( dot(q,c.xy), q.y);
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

float sdConeSection( in vec3 p, in float h, in float r1, in float r2 )
{
    float d1 = -p.y - h;
    float q = p.y - h;
    float si = 0.5*(r1-r2)/h;
    float d2 = max( sqrt( dot(p.xz,p.xz)*(1.0-si*si)) + q*si - r2, q );
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

float sdPryamid4(vec3 p, vec3 h ) // h = { cos a, sin a, height }
{
    // Tetrahedron = Octahedron - Cube
    float box = sdBox( p - vec3(0,-2.0*h.z,0), vec3(2.0*h.z) );
 
    float d = 0.0;
    d = max( d, abs( dot(p, vec3( -h.x, h.y, 0 )) ));
    d = max( d, abs( dot(p, vec3(  h.x, h.y, 0 )) ));
    d = max( d, abs( dot(p, vec3(  0, h.y, h.x )) ));
    d = max( d, abs( dot(p, vec3(  0, h.y,-h.x )) ));
    float octa = d - h.z;
    return max(-box,octa); // Subtraction
 }

float length2( vec2 p )
{
	return sqrt( p.x*p.x + p.y*p.y );
}

float length6( vec2 p )
{
	p = p*p*p; p = p*p;
	return pow( p.x + p.y, 1.0/6.0 );
}

float length8( vec2 p )
{
	p = p*p; p = p*p; p = p*p;
	return pow( p.x + p.y, 1.0/8.0 );
}

float sdTorus82( vec3 p, vec2 t )
{
    vec2 q = vec2(length2(p.xz)-t.x,p.y);
    return length8(q)-t.y;
}

float sdTorus88( vec3 p, vec2 t )
{
    vec2 q = vec2(length8(p.xz)-t.x,p.y);
    return length8(q)-t.y;
}

float sdCylinder6( vec3 p, vec2 h )
{
    return max( length6(p.xz)-h.x, abs(p.y)-h.y );
}

//------------------------------------------------------------------

float opS( float d1, float d2 )
{
    return max(-d2,d1);
}

vec2 opU( vec2 d1, vec2 d2 )
{
	return (d1.x<d2.x) ? d1 : d2;
}

vec3 opRep( vec3 p, vec3 c )
{
    return mod(p,c)-0.5*c;
}

vec3 opTwist( vec3 p )
{
    float  c = cos(10.0*p.y+10.0);
    float  s = sin(10.0*p.y+10.0);
    mat2   m = mat2(c,-s,s,c);
    return vec3(m*p.xz,p.y);
}

//------------------------------------------------------------------

vec2 marchPlanet(vec4 pos, mat4 transform, float scale, float colour) {
    vec3 planet = vec4(transform * pos).xyz;
    float distPlanet = sdSphere(planet, scale);
    vec2 planetColoured = vec2(distPlanet, colour);
    return planetColoured;
}

vec2 map( in vec3 pos )
{
    //What this is essentially doing is using lequal as our depth function.
    //We find the geometry that intersects first with the ray, and keep storing the minimum till we've finished iterating.
    //vec2 res = opU( vec2( sdPlane(     pos), 1.0 ),
	//                vec2( sdSphere(    pos-vec3( 0.0,0.25, 0.0), 0.25 ), 46.9 ) );
    //res = opU( res, vec2( sdBox(       pos-vec3( 1.0,0.25, 0.0), vec3(0.25) ), 3.0 ) );
    //res = opU( res, vec2( udRoundBox(  pos-vec3( 1.0,0.25, 1.0), vec3(0.15), 0.1 ), 41.0 ) );
	//res = opU( res, vec2( sdTorus(     pos-vec3( 0.0,0.25, 1.0), vec2(0.20,0.05) ), 25.0 ) );
    //res = opU( res, vec2( sdCapsule(   pos,vec3(-1.3,0.10,-0.1), vec3(-0.8,0.50,0.2), 0.1  ), 31.9 ) );
	//res = opU( res, vec2( sdTriPrism(  pos-vec3(-1.0,0.25,-1.0), vec2(0.25,0.05) ),43.5 ) );
	//res = opU( res, vec2( sdCylinder(  pos-vec3( 1.0,0.30,-1.0), vec2(0.1,0.2) ), 8.0 ) );
	//res = opU( res, vec2( sdCone(      pos-vec3( 0.0,0.50,-1.0), vec3(0.8,0.6,0.3) ), 55.0 ) );
	//res = opU( res, vec2( sdTorus82(   pos-vec3( 0.0,0.25, 2.0), vec2(0.20,0.05) ),50.0 ) );
	//res = opU( res, vec2( sdTorus88(   pos-vec3(-1.0,0.25, 2.0), vec2(0.20,0.05) ),43.0 ) );
	//res = opU( res, vec2( sdCylinder6( pos-vec3( 1.0,0.30, 2.0), vec2(0.1,0.2) ), 12.0 ) );
	//res = opU( res, vec2( sdHexPrism(  pos-vec3(-1.0,0.20, 1.0), vec2(0.25,0.05) ),17.0 ) );
	//res = opU( res, vec2( sdPryamid4(  pos-vec3(-1.0,0.15,-2.0), vec3(0.8,0.6,0.25) ),37.0 ) );
    //res = opU( res, vec2( opS( udRoundBox(  pos-vec3(-2.0,0.2, 1.0), vec3(0.15),0.05),
	//                           sdSphere(    pos-vec3(-2.0,0.2, 1.0), 0.25)), 13.0 ) );
    //res = opU( res, vec2( opS( sdTorus82(  pos-vec3(-2.0,0.2, 0.0), vec2(0.20,0.1)),
	//                           sdCylinder(  opRep( vec3(atan(pos.x+2.0,pos.z)/6.2831, pos.y, 0.02+0.5*length(pos-vec3(-2.0,0.2, 0.0))), vec3(0.05,1.0,0.05)), vec2(0.02,0.6))), 51.0 ) );
	//res = opU( res, vec2( 0.5*sdSphere(    pos-vec3(-2.0,0.25,-1.0), 0.2 ) + 0.03*sin(50.0*pos.x)*sin(50.0*pos.y)*sin(50.0*pos.z), 65.0 ) );
	//res = opU( res, vec2( 0.5*sdTorus( opTwist(pos-vec3(-2.0,0.25, 2.0)),vec2(0.20,0.05)), 46.7 ) );
    //res = opU( res, vec2( sdConeSection( pos-vec3( 0.0,0.35,-2.0), 0.15, 0.2, 0.1 ), 13.67 ) );
    //res = opU( res, vec2( sdEllipsoid( pos-vec3( 1.0,0.35,-2.0), vec3(0.15, 0.2, 0.05) ), 43.17 ) );

    //vec2 sun = marchPlanet(pos4, u_input.invSun, u_input.sSun, 46.9);
    //res = opU(res, sun);
    
    //vec2 mercury = marchPlanet(pos4, u_input.invMerc, u_input.sMerc, 46.9);
    //res = opU(res, mercury);
    
    //vec2 venus = marchPlanet(pos4, u_input.invVenus, u_input.sVenus, 46.9);
    //res = opU(res, venus);
    
    //vec2 earth = marchPlanet(pos4, u_input.invEarth, u_input.sEarth, 46.9);
    //res = opU(res, earth);
    //
    //vec2 mars = marchPlanet(pos4, u_input.invMars, u_input.sMars, 46.9);
    //res = opU(res, mars);
    //
    //vec2 jupiter = marchPlanet(pos4, u_input.invJup, u_input.sJup, 46.9);
    //res = opU(res, jupiter);
    //
    //vec2 saturn = marchPlanet(pos4, u_input.invSat, u_input.sSat, 46.9);
    //res = opU(res, saturn);
    //
    //vec2 uranus = marchPlanet(pos4, u_input.invUr, sUr, 46.9);
    //res = opU(res, uranus);
    //
    //vec2 neptune = marchPlanet(pos4, u_input.invNept, u_input.sNept, 46.9);
    //res = opU(res, neptune);
    //
    //vec2 pluto = marchPlanet(pos4, u_input.invPlu, u_input.sPlu, 46.9);
    //res = opU(res, pluto);
    //
    //vec2 moon = marchPlanet(pos4, u_input.invMoon, u_input.sMoon, 46.9);
    //res = opU(res, moon);
   
    //Not sure why this isn't working.
    //for (int i = 0; i <  MAX_PLANETS; i++) {
    //    res = opU(res, marchPlanet(pos4, u_input.inverseWorldMatrices[i], u_input.scalings[i], 46.9));
    //}

    vec2 res;
    vec4 pos4 = vec4(pos, 1.0);

    float distPlane = sdPlane(pos);
    vec2 plane = vec2( distPlane, 1.0 );
    res = plane;

    vec2 sun = marchPlanet(pos4, u_input.inverseWorldMatrices[0], u_input.scalings[0], 46.9);
    res = opU(res, sun);
    
    vec2 mercury = marchPlanet(pos4, u_input.inverseWorldMatrices[1], u_input.scalings[1], 46.9);
    res = opU(res, mercury);
    
    vec2 venus = marchPlanet(pos4, u_input.inverseWorldMatrices[2], u_input.scalings[2], 46.9);
    res = opU(res, venus);
    
    vec2 earth = marchPlanet(pos4, u_input.inverseWorldMatrices[3], u_input.scalings[3], 46.9);
    res = opU(res, earth);

    vec2 mars = marchPlanet(pos4, u_input.inverseWorldMatrices[4], u_input.scalings[4], 46.9);
    res = opU(res, mars);

    vec2 jupiter = marchPlanet(pos4, u_input.inverseWorldMatrices[5], u_input.scalings[5], 46.9);
    res = opU(res, jupiter);

    vec2 saturn = marchPlanet(pos4, u_input.inverseWorldMatrices[6], u_input.scalings[6], 46.9);
    res = opU(res, saturn);

    vec2 uranus = marchPlanet(pos4, u_input.inverseWorldMatrices[7], u_input.scalings[7], 46.9);
    res = opU(res, uranus);

    vec2 neptune = marchPlanet(pos4, u_input.inverseWorldMatrices[8], u_input.scalings[8], 46.9);
    res = opU(res, neptune);

    vec2 pluto = marchPlanet(pos4, u_input.inverseWorldMatrices[9], u_input.scalings[9], 46.9);
    res = opU(res, pluto);

    vec2 moon = marchPlanet(pos4, u_input.inverseWorldMatrices[10], u_input.scalings[10], 46.9);
    res = opU(res, moon);

    return res;
}

//vec3 opTx( in vec3 p, in transform t, in sdf3d primitive ) { return primitive( invert(t)*p ); }
//float sdSphere( vec3 p, float s ) { return length(p)-s; }
//vec2 opU( vec2 d1, vec2 d2 ) { return (d1.x<d2.x) ? d1 : d2; }

// ro = ray origin, rd = ray direction
vec2 castRay( in vec3 ro, in vec3 rd )
{
    //t is the interpolation parameter like in a parametric equation (can exceed 1 lines are infinite [unless we bound them like below]).
    //ie origin of 5, direction of 0.75, t of 7 so result point = 5 + 0.75 * 7.
    float tmin = 1.0;
    float tmax = 20.0;
   
#if 1
    // bounding volume (view frustum). Too late for me to explore where 1.6 comes from, maybe a brutal approximation of 16:9?
    float tp1 = (0.0-ro.y)/rd.y;
    if( tp1>0.0 )
        tmax = min( tmax, tp1 );
    float tp2 = (1.6-ro.y)/rd.y;
    if( tp2>0.0 ) {
        if( ro.y>1.6 )
            tmin = max( tmin, tp2 );
        else
            tmax = min( tmax, tp2 );
    }
#endif
    
    float t = tmin;
    float m = -1.0;
    for( int i=0; i<64; i++ )
    {
	    float precis = 0.0005*t;
	    vec2 res = map( ro+rd*t );
        //If precis is epsilon. We want to break if we've travelled less than a really small number, or we've exceeded our draw distance
        if( res.x<precis || t>tmax ) break;
        //I don't understand why t is incremented by x only, and I don't know what m is...
        t += res.x;
	    m = res.y;
    }

    if( t>tmax ) m=-1.0;
    return vec2( t, m );
}


float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
	float res = 1.0;
    float t = mint;
    for( int i=0; i<16; i++ )
    {
		float h = map( ro + rd*t ).x;
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize( e.xyy*map( pos + e.xyy ).x + 
					  e.yyx*map( pos + e.yyx ).x + 
					  e.yxy*map( pos + e.yxy ).x + 
					  e.xxx*map( pos + e.xxx ).x );
    /*
	vec3 eps = vec3( 0.0005, 0.0, 0.0 );
	vec3 nor = vec3(
	    map(pos+eps.xyy).x - map(pos-eps.xyy).x,
	    map(pos+eps.yxy).x - map(pos-eps.yxy).x,
	    map(pos+eps.yyx).x - map(pos-eps.yyx).x );
	return normalize(nor);
	*/
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

// map() defines all the geometry
// castRay() returns an intersection between a ray and geometry
// once we have intersections, we can render fancy visuals from there with the AO, normal, and shadow functions in addition to phong
// (1. Define geometry. 2. Compute point of intersection. 3. Colour results).
vec3 render( in vec3 ro, in vec3 rd )
{ 
    vec3 col = vec3(0.7, 0.9, 1.0) +rd.y*0.8;
    vec2 res = castRay(ro,rd);
    float t = res.x;
	float m = res.y;
    //Idk how this y threshold affects the ceiling, but it sure does!
    if( m>-0.5 )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos );
        vec3 ref = reflect( rd, nor );
        
        // material        
		col = 0.45 + 0.35*sin( vec3(0.05,0.08,0.10)*(m-1.0) );
        //This renders the floor.
        if( m<1.5 )
        {
            
            float f = mod( floor(5.0*pos.z) + floor(5.0*pos.x), 2.0);
            col = 0.3 + 0.1*f*vec3(1.0);
        }

        // lighitng        
        float occ = calcAO( pos, nor );
		vec3  lig = normalize( vec3(-0.4, 0.7, -0.6) );
		float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
        float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
        float bac = clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
        float dom = smoothstep( -0.1, 0.1, ref.y );
        float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
		float spe = pow(clamp( dot( ref, lig ), 0.0, 1.0 ),16.0);
        
        dif *= softshadow( pos, lig, 0.02, 2.5 );
        dom *= softshadow( pos, ref, 0.02, 2.5 );

		vec3 lin = vec3(0.0);
        lin += 1.30*dif*vec3(1.00,0.80,0.55);
		lin += 2.00*spe*vec3(1.00,0.90,0.70)*dif;
        lin += 0.40*amb*vec3(0.40,0.60,1.00)*occ;
        lin += 0.50*dom*vec3(0.40,0.60,1.00)*occ;
        lin += 0.50*bac*vec3(0.25,0.25,0.25)*occ;
        lin += 0.25*fre*vec3(1.00,1.00,1.00)*occ;
		col = col*lin;

    	col = mix( col, vec3(0.8,0.9,1.0), 1.0-exp( -0.0002*t*t*t ) );
    }

	return vec3( clamp(col,0.0,1.0) );
}

void main( )
{
    vec3 tot = vec3(0.0);
    vec2 res = u_input.resolution.xy;
#if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        //vec2 p = (-u_input.resolution + 2.0*(gl_FragCoord.xy+o))/u_input.resolution.y;
        vec2 p = (-res + 2.0*(gl_FragCoord.xy+o))/res.y;
#else    
        //xMin = -1920 / 1080, xMax = 1920 / 1080
        //yMin = -1080 / 1080, yMax = 1080 / 1080
        //xMin = -1.7778, xMax = 1.7778, yMin = -1, yMax = 1
        //This makes sense because we'll want to evaluate 1.7778 horizontal pixels for each vertical pixel.
        //vec2 p = (-u_input.resolution + 2.0*gl_FragCoord.xy)/u_input.resolution.y;
        vec2 p = (-res + 2.0*gl_FragCoord.xy)/res.y;
#endif
        //gl_FragCoord assumes window origin at lower left. On windows the origin is the upper left, which is why we invert y.
        p.y = -p.y;

        // Send rays in the direction of the camera frustum.
        vec3 rd = (u_input.invView * normalize( vec4(p.xy, 2.0, 0.0) )).xyz;
        // Ray origin is the camera translation.
        vec3 ro = u_input.invView[3].xyz;

        // render
        vec3 col = render( ro, rd );

        // gamma
        col = pow( col, vec3(0.4545) );

        tot += col;
#if AA>1
    }
    tot /= float(AA*AA);
#endif
    
    outColor = vec4( tot, 1.0 );
}
