#version 450 core

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


layout(location = 0) in vec4 Color;

layout(location = 0) out vec4 outColor;

//layout (UPDATE_FREQ_NONE, binding=6) uniform texture2D  BackText;
//layout (UPDATE_FREQ_NONE, binding=7) uniform sampler uSampler0;
//layout (UPDATE_FREQ_NONE, binding=8) uniform texture2D TestText;

void main ()
{
	//outColor  =  texture(sampler2D(TestText, uSampler0), gl_FragCoord.xy);
	//outColor  =  texture(sampler2D(BackText, uSampler0), gl_FragCoord.xy);
	outColor = Color;
}