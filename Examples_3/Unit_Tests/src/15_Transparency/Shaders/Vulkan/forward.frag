/*
* Copyright (c) 2018-2019 Confetti Interactive Inc.
*
* This file is part of The-Forge
* (see https://github.com/ConfettiFX/The-Forge).
*layout(UPDATE_FREQ_NONE, binding = 12)
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

#version 450 core
#extension GL_GOOGLE_include_directive : require

#include "shading.h"

//#define DRAW_FRUSTUMS true
//#if DRAW_FRUSTUMS
uint GRID_SIZE = 32;
const float screenWidth =  1920.0;
const float screenHeight = 1080.0;
highp uint numColumns = uint(screenWidth / float(GRID_SIZE) + 0.5);	//60
highp uint numRows = uint(screenHeight / float(GRID_SIZE) + 0.5);		//34

uint getFrustumIndex()
{
    uint col = uint(gl_FragCoord.x / GRID_SIZE);
    uint row = uint(gl_FragCoord.y / GRID_SIZE);
    return (row * numColumns) + col;
}
//#else
//#endif

layout(location = 0) in vec4 WorldPosition;
layout(location = 1) in vec4 NormalOut;
layout(location = 2) in vec4 UV;
layout(location = 3) flat in uint MatID;

layout(location = 0) out vec4 FinalColor;

vec3 PointLight(uint lightIndex, vec3 worldPos, vec3 normal, vec3 toViewer)
{
	vec3 lightPosition = lightPositions[lightIndex].xyz;
	vec3 lightColor = lightColors[lightIndex].xyz;
	float lightSize = lightSizes[lightIndex];

	vec3 toLight = normalize(lightPosition - worldPos);
	float diffuseStrength = max(dot(normal, toLight), 0.05);
	//0.05 is the "ambient" term.
	
	vec3 reflected = reflect(-toLight, normal);
	float specularStrength = pow(max(dot(toViewer, reflected), 0.0), 32);
	
	float magnitude = length(lightPosition - worldPos);
	float attenuation = lightSize / (magnitude * magnitude);
	
	diffuseStrength *= attenuation;
	specularStrength *= attenuation;

	return (diffuseStrength + specularStrength) * lightColor;
}

void main()
{
	vec3 pointContribution = vec3(0.0, 0.0, 0.0);
	vec3 normal = normalize(NormalOut.xyz);
	vec3 view = normalize(camPosition.xyz - WorldPosition.xyz);

	for (uint i = 0; i < MAX_NUM_LIGHTS; i++) {
		pointContribution += PointLight(i, WorldPosition.xyz, normal, view);
	}

	vec4 directionContribution = Shade(MatID, UV.xy, WorldPosition.xyz, normal);
	vec4 forwardColor = vec4(vec3(pointContribution + directionContribution.xyz), directionContribution.w);
	
	//#if DRAW_FRUSTUMS
	
	
		uint frustumID = getFrustumIndex();
	

		if(frustumID == 1979 || frustumID == 256 || frustumID == 496) 
		{	
					FinalColor = vec4(0, 0, 1, 1);
		} else
		{
	//				vec4 lightCountColor = mix(vec4(0, 1, 0, 1), vec4(1, 0, 0, 1), float(lightCounts[frustumID]) / float(MAX_LIGHTS_PER_FRUSTUM));
	//				FinalColor = mix(forwardColor, lightCountColor, 0.8);
					//FinalColor = vec4(lightCounts[frustumID], lightCounts[frustumID], lightCounts[frustumID], 1);
					
					uint lightCount = 0;
					for(uint i = 0; i < MAX_LIGHTS_PER_FRUSTUM; i++)
					{
						if(lightIndices[(frustumID * 64) + i] > -1)
						{
							lightCount++;
						} else
						{
							break;
						}
					}
					
					FinalColor = vec4(float(lightCount)/64.0, 0, 0, 1);
		}

		
		//Sure enough, the window origin is top left.
		//FinalColor = vec4(gl_FragCoord.x / screenWidth, gl_FragCoord.y / screenHeight, 0.0, 1.0);

		//float idNormalized = float(frustumID)/(numColumns * numRows);
		//vec4 frustumIndexColor = vec4(idNormalized, 1 - idNormalized, idNormalized, 1.0);
	//#else
	//    FinalColor = vec4(vec3(pointContribution + directionContribution.xyz), directionContribution.w);
	//#endif
}