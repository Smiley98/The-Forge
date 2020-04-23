/*
* Copyright (c) 2018-2019 Confetti Interactive Inc.
*
* This file is part of The-Forge
* (see https://github.com/ConfettiFX/The-Forge).
*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

#define SPECULAR_EXP 10.0f

#include "shaderDefs.h"

#if USE_SHADOWS != 0
#include "varianceShadowMapping.h"
#endif

vec4 Shade(uint matID, vec2 uv, vec3 worldPos, vec3 normal)
{
	mat4 theProjection = sunViewProj;		//lightViewProj;
	vec3 theDirection = sunDirection.xyz;	//lightDirection.xyz;
	vec3 theColor = sunColor.xyz;			//lightColor.xyz;

	//Minimum ambience of 0.05.
	float nDotl = dot(normal, -theDirection);
	if (nDotl < 0.05f)
		nDotl = 0.05f;

	Material mat = Materials[matID];
	vec4 matColor = (mat.TextureFlags & 1) > 0 ? texture(sampler2D(MaterialTextures[mat.AlbedoTexID], LinearSampler), uv) : mat.Color;

	vec3 viewVec = normalize(worldPos - camPosition.xyz);
	vec3 diffuse = theColor * matColor.xyz * nDotl;
	vec3 specular = theColor * pow(clamp(dot(reflect(-theDirection, normal), viewVec), 0.0f, 1.0f), SPECULAR_EXP);
	//vec3 ambient = vec3(0.1, 0.1, 0.1);
	vec3 finalColor = clamp(diffuse + specular, 0.0f, 1.0f);

#if USE_SHADOWS != 0
	vec4 shadowMapPos = theProjection * vec4(worldPos, 1.0f);
	shadowMapPos.y = -shadowMapPos.y;
	shadowMapPos.xy = (shadowMapPos.xy + 1.0f) * 0.5f;
	if (clamp(shadowMapPos.x, 0.01f, 0.99f) == shadowMapPos.x &&
		clamp(shadowMapPos.y, 0.01f, 0.99f) == shadowMapPos.y &&
		shadowMapPos.z > 0.0f)
	{
		vec3 lighting = ShadowContribution(shadowMapPos.xy, shadowMapPos.z);
#if USE_LIGHT_INDICES != 0
		//lighting += vec3(1.0);//Visuals look muddy when shadows aren't black (just gonna have to have a dark, high-contrast scene).
#endif
		finalColor *= lighting;
	}
#endif

	return vec4(finalColor, matColor.a);
}