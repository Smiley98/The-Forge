#version 450 core

layout (UPDATE_FREQ_NONE, binding=1) uniform texture2D  RightText;
layout (UPDATE_FREQ_NONE, binding=2) uniform texture2D  LeftText;
layout (UPDATE_FREQ_NONE, binding=3) uniform texture2D  TopText;
layout (UPDATE_FREQ_NONE, binding=4) uniform texture2D  BotText;
layout (UPDATE_FREQ_NONE, binding=5) uniform texture2D  FrontText;
layout (UPDATE_FREQ_NONE, binding=6) uniform texture2D  BackText;
layout (UPDATE_FREQ_NONE, binding=7) uniform sampler   uSampler0;
layout(location = 0) in INVOCATION
{
  vec4 texcoord;
  int side;
} fs_in;

layout(location = 0) out vec4 fs_out_color;

void main(void)
{

  vec2 newtextcoord ;
  float side = round(fs_in.texcoord.w);
  if(side==1)
  {
  
      newtextcoord = (fs_in.texcoord.zy)/20+vec2(0.5);
      newtextcoord = vec2(1-newtextcoord.x,1-newtextcoord.y);
      fs_out_color  =  texture(sampler2D(RightText, uSampler0), newtextcoord);
  }
  else if(side==2)
  {
  
      vec2 newtextcoord = (fs_in.texcoord.zy)/20+vec2(0.5);
      newtextcoord = vec2(newtextcoord.x,1-newtextcoord.y);
      fs_out_color  =  texture(sampler2D(LeftText, uSampler0), newtextcoord);
  }
  else if(side==3)
  {
       fs_out_color  =  texture(sampler2D(TopText, uSampler0), (fs_in.texcoord.xz)/20+vec2(0.5));
  }
  else if(side == 4.0f)
  {
    
       newtextcoord = (fs_in.texcoord.xz)/20+vec2(0.5);
       newtextcoord = vec2(newtextcoord.x,1-newtextcoord.y);
       fs_out_color  =  texture(sampler2D(BotText, uSampler0), newtextcoord);
  }
  else if(side==5)
  {
     
       newtextcoord = (fs_in.texcoord.xy)/20+vec2(0.5);
       newtextcoord = vec2(newtextcoord.x,1-newtextcoord.y);
       fs_out_color = texture(sampler2D(FrontText, uSampler0), newtextcoord);
       
  }
  else if(side==6)
  {
      
       newtextcoord = (fs_in.texcoord.xy)/20+vec2(0.5);
       newtextcoord = vec2(1-newtextcoord.x,1-newtextcoord.y);
       fs_out_color = texture(sampler2D(BackText, uSampler0), newtextcoord);
  }
  
}
