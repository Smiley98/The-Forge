#version 450 core

precision highp float;
precision highp int; 
void clip1(float x) { if (x < 0.0) discard;  }
void clip1(vec2  x) { if (any(lessThan(x, vec2(0.0, 0.0)))) discard;  }
void clip1(vec3  x) { if (any(lessThan(x, vec3(0.0, 0.0, 0.0)))) discard;  }
void clip1(vec4  x) { if (any(lessThan(x, vec4(0.0, 0.0, 0.0, 0.0)))) discard;  }
#extension GL_EXT_samplerless_texture_functions : enable

void GetDimensions1(texture1D texName, uint mipLevel, out int width, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture1D texName, out int width)
{
    width = int(textureSize(texName,0));
}

void GetDimensions1(texture1D texName, uint mipLevel, out uint width, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture1D texName, out uint width)
{
    width = uint(textureSize(texName,0));
}

void GetDimensions1(texture1D texName, uint mipLevel, out float width, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture1D texName, out float width)
{
    width = float(textureSize(texName,0));
}

void GetDimensions1(texture1DArray texName, uint mipLevel, out int width, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    elements = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture1DArray texName, out int width, out int elements)
{
    width = int(textureSize(texName,0).x);
    elements = int(textureSize(texName,0).y);
}

void GetDimensions1(texture1DArray texName, uint mipLevel, out uint width, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    elements = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture1DArray texName, out uint width, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    elements = uint(textureSize(texName,0).y);
}

void GetDimensions1(texture1DArray texName, uint mipLevel, out float width, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    elements = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture1DArray texName, out float width, out float elements)
{
    width = float(textureSize(texName,0).x);
    elements = float(textureSize(texName,0).y);
}

void GetDimensions1(texture2D texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture2D texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions1(texture2D texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture2D texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions1(texture2D texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture2D texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions1(texture2DArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture2DArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions1(texture2DArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture2DArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions1(texture2DArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture2DArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions1(utexture1D texName, uint mipLevel, out int width, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture1D texName, out int width)
{
    width = int(textureSize(texName,0));
}

void GetDimensions1(utexture1D texName, uint mipLevel, out uint width, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture1D texName, out uint width)
{
    width = uint(textureSize(texName,0));
}

void GetDimensions1(utexture1D texName, uint mipLevel, out float width, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture1D texName, out float width)
{
    width = float(textureSize(texName,0));
}

void GetDimensions1(utexture1DArray texName, uint mipLevel, out int width, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    elements = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture1DArray texName, out int width, out int elements)
{
    width = int(textureSize(texName,0).x);
    elements = int(textureSize(texName,0).y);
}

void GetDimensions1(utexture1DArray texName, uint mipLevel, out uint width, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    elements = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture1DArray texName, out uint width, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    elements = uint(textureSize(texName,0).y);
}

void GetDimensions1(utexture1DArray texName, uint mipLevel, out float width, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    elements = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture1DArray texName, out float width, out float elements)
{
    width = float(textureSize(texName,0).x);
    elements = float(textureSize(texName,0).y);
}

void GetDimensions1(utexture2D texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture2D texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions1(utexture2D texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture2D texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions1(utexture2D texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture2D texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions1(utexture2DArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture2DArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions1(utexture2DArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture2DArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions1(utexture2DArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture2DArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions1(itexture1D texName, uint mipLevel, out int width, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture1D texName, out int width)
{
    width = int(textureSize(texName,0));
}

void GetDimensions1(itexture1D texName, uint mipLevel, out uint width, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture1D texName, out uint width)
{
    width = uint(textureSize(texName,0));
}

void GetDimensions1(itexture1D texName, uint mipLevel, out float width, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture1D texName, out float width)
{
    width = float(textureSize(texName,0));
}

void GetDimensions1(itexture1DArray texName, uint mipLevel, out int width, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    elements = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture1DArray texName, out int width, out int elements)
{
    width = int(textureSize(texName,0).x);
    elements = int(textureSize(texName,0).y);
}

void GetDimensions1(itexture1DArray texName, uint mipLevel, out uint width, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    elements = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture1DArray texName, out uint width, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    elements = uint(textureSize(texName,0).y);
}

void GetDimensions1(itexture1DArray texName, uint mipLevel, out float width, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    elements = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture1DArray texName, out float width, out float elements)
{
    width = float(textureSize(texName,0).x);
    elements = float(textureSize(texName,0).y);
}

void GetDimensions1(itexture2D texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture2D texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions1(itexture2D texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture2D texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions1(itexture2D texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture2D texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions1(itexture2DArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture2DArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions1(itexture2DArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture2DArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions1(itexture2DArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture2DArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions1(texture3D texName, uint mipLevel, out int width, out int height, out int depth, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    depth = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture3D texName, out int width, out int height, out int depth)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    depth = int(textureSize(texName,0).z);
}

void GetDimensions1(texture3D texName, uint mipLevel, out uint width, out uint height, out uint depth, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    depth = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture3D texName, out uint width, out uint height, out uint depth)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    depth = uint(textureSize(texName,0).z);
}

void GetDimensions1(texture3D texName, uint mipLevel, out float width, out float height, out float depth, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    depth = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(texture3D texName, out float width, out float height, out float depth)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    depth = float(textureSize(texName,0).z);
}

void GetDimensions1(utexture3D texName, uint mipLevel, out int width, out int height, out int depth, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    depth = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture3D texName, out int width, out int height, out int depth)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    depth = int(textureSize(texName,0).z);
}

void GetDimensions1(utexture3D texName, uint mipLevel, out uint width, out uint height, out uint depth, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    depth = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture3D texName, out uint width, out uint height, out uint depth)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    depth = uint(textureSize(texName,0).z);
}

void GetDimensions1(utexture3D texName, uint mipLevel, out float width, out float height, out float depth, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    depth = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utexture3D texName, out float width, out float height, out float depth)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    depth = float(textureSize(texName,0).z);
}

void GetDimensions1(itexture3D texName, uint mipLevel, out int width, out int height, out int depth, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    depth = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture3D texName, out int width, out int height, out int depth)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    depth = int(textureSize(texName,0).z);
}

void GetDimensions1(itexture3D texName, uint mipLevel, out uint width, out uint height, out uint depth, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    depth = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture3D texName, out uint width, out uint height, out uint depth)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    depth = uint(textureSize(texName,0).z);
}

void GetDimensions1(itexture3D texName, uint mipLevel, out float width, out float height, out float depth, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    depth = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itexture3D texName, out float width, out float height, out float depth)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    depth = float(textureSize(texName,0).z);
}

void GetDimensions1(textureCube texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(textureCube texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions1(textureCube texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(textureCube texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions1(textureCube texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(textureCube texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions1(textureCubeArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(textureCubeArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions1(textureCubeArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(textureCubeArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions1(textureCubeArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(textureCubeArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions1(utextureCube texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utextureCube texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions1(utextureCube texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utextureCube texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions1(utextureCube texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utextureCube texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions1(utextureCubeArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utextureCubeArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions1(utextureCubeArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utextureCubeArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions1(utextureCubeArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(utextureCubeArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions1(itextureCube texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itextureCube texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions1(itextureCube texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itextureCube texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions1(itextureCube texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itextureCube texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions1(itextureCubeArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itextureCubeArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions1(itextureCubeArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itextureCubeArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions1(itextureCubeArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions1(itextureCubeArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions1(texture2DMS texName, out int width, out int height)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
}

void GetDimensions1(texture2DMS texName, out uint width, out uint height)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
}

void GetDimensions1(texture2DMS texName, out float width, out float height)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
}

void GetDimensions1(texture2DMSArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
    elements = int(textureSize(texName).z);
}

void GetDimensions1(texture2DMSArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
    elements = uint(textureSize(texName).z);
}

void GetDimensions1(texture2DMSArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
    elements = float(textureSize(texName).z);
}

void GetDimensions1(utexture2DMS texName, out int width, out int height)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
}

void GetDimensions1(utexture2DMS texName, out uint width, out uint height)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
}

void GetDimensions1(utexture2DMS texName, out float width, out float height)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
}

void GetDimensions1(utexture2DMSArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
    elements = int(textureSize(texName).z);
}

void GetDimensions1(utexture2DMSArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
    elements = uint(textureSize(texName).z);
}

void GetDimensions1(utexture2DMSArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
    elements = float(textureSize(texName).z);
}

void GetDimensions1(itexture2DMS texName, out int width, out int height)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
}

void GetDimensions1(itexture2DMS texName, out uint width, out uint height)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
}

void GetDimensions1(itexture2DMS texName, out float width, out float height)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
}

void GetDimensions1(itexture2DMSArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
    elements = int(textureSize(texName).z);
}

void GetDimensions1(itexture2DMSArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
    elements = uint(textureSize(texName).z);
}

void GetDimensions1(itexture2DMSArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
    elements = float(textureSize(texName).z);
}

#extension GL_EXT_control_flow_attributes : require
float asfloat(uint x) { return uintBitsToFloat(x); }
float asfloat(int x) { return intBitsToFloat(x); }
uint asuint(float x) { return floatBitsToUint(x); }
uint asuint(int x) { return (x); }
uint asuint(uint x) { return (x); }
vec4 MulMat(mat4 lhs, vec4 rhs)
{
    vec4 dst;
	dst[0] = lhs[0][0]*rhs[0] + lhs[0][1]*rhs[1] + lhs[0][2]*rhs[2] + lhs[0][3]*rhs[3];
	dst[1] = lhs[1][0]*rhs[0] + lhs[1][1]*rhs[1] + lhs[1][2]*rhs[2] + lhs[1][3]*rhs[3];
	dst[2] = lhs[2][0]*rhs[0] + lhs[2][1]*rhs[1] + lhs[2][2]*rhs[2] + lhs[2][3]*rhs[3];
	dst[3] = lhs[3][0]*rhs[0] + lhs[3][1]*rhs[1] + lhs[3][2]*rhs[2] + lhs[3][3]*rhs[3];
    return dst;
}


layout(location = 0) in vec4 fragInput_POSITION;
layout(location = 1) in vec4 fragInput_NORMAL;
layout(location = 2) in vec4 fragInput_TEXCOORD0;
layout(location = 3) in flat uint fragInput_MAT_ID;

struct AOITNode
{
    float depth;
    float trans;
    uint color;
};
struct AOITControlSurface
{
    bool clear;
    bool opaque;
    float depth;
};
struct AOITData
{
    vec4 depth[1];
    uvec4 color[1];
};
struct AOITDepthData
{
    vec4 depth[1];
};
struct AOITColorData
{
    uvec4 color[1];
};
layout(set = 0, binding = 0, r32ui) uniform u? AOITClearMaskUAV;
layout(row_major, set=0, binding=1) buffer AOITDepthDataUAV
{
    AOITDepthData AOITDepthDataUAV_Data[];
};

layout(row_major, set=0, binding=2) buffer AOITColorDataUAV
{
    AOITColorData AOITColorDataUAV_Data[];
};

uint PackRGB(vec3 color)
{
    uvec3 u = uvec3(((clamp(color, 0.0, 1.0) * vec3(255)) + vec3(0.5)));
    uint packedOutput = ((((u).z << uint(16)) | ((u).y << uint(8))) | (u).x);
    return packedOutput;
}
vec3 UnpackRGB(uint packedInput)
{
    vec3 unpackedOutput;
    uvec3 p = uvec3((packedInput & 255u), ((packedInput >> uint(8)) & 255u), ((packedInput >> uint(16)) & 255u));
    (unpackedOutput = (vec3(p) / vec3(255)));
    return unpackedOutput;
}
uint PackRGBA(vec4 color)
{
    uvec4 u = uvec4(((clamp(color, 0.0, 1.0) * vec4(255)) + vec4(0.5)));
    uint packedOutput = (((((u).w << uint(24)) | ((u).z << uint(16))) | ((u).y << uint(8))) | (u).x);
    return packedOutput;
}
vec4 UnpackRGBA(uint packedInput)
{
    vec4 unpackedOutput;
    uvec4 p = uvec4((packedInput & 255u), ((packedInput >> uint(8)) & 255u), ((packedInput >> uint(16)) & 255u), (packedInput >> uint(24)));
    (unpackedOutput = (vec4(p) / vec4(255)));
    return unpackedOutput;
}
float UnpackUnnormAlpha(uint packedInput)
{
    return float((packedInput >> uint(24)));
}
uint AOITAddrGen(uvec2 addr2D, uint width)
{
    (width = (width >> uint(1)));
    uvec2 tileAddr2D = (addr2D >> uvec2(1));
    uint tileAddr1D = ((tileAddr2D[0] + (width * tileAddr2D[1])) << uint(2));
    uvec2 pixelAddr2D = (addr2D & uvec2(1u));
    uint pixelAddr1D = ((pixelAddr2D[1] << uint(1)) + pixelAddr2D[0]);
    return (tileAddr1D | pixelAddr1D);
}
uint AOITAddrGenUAV(uvec2 addr2D)
{
    uvec2 dim;
    GetDimensions1(AOITClearMaskUAV,dim[0],dim[1]);
    return AOITAddrGen(addr2D, dim[0]);
}
void AOITLoadControlSurface(in uint data, inout AOITControlSurface surface)
{
    ((surface).clear = ((bool((data & 1u)))?(true):(false)));
    ((surface).opaque = ((bool((data & 2u)))?(true):(false)));
    ((surface).depth = asfloat(((data & 4294967292u) | 3u)));
}
void AOITLoadControlSurfaceUAV(in uvec2 pixelAddr, inout AOITControlSurface surface)
{
    uint data = texelFetch(AOITClearMaskUAV, );
    AOITLoadControlSurface(data, surface);
}
void AOITStoreControlSurfaceUAV(uvec2 pixelAddr, in AOITControlSurface surface)
{
    uint data;
    (data = (asuint((surface).depth) & 4294967292u));
    (data |= (((surface).opaque)?(2u):(0u)));
    (data |= (((surface).clear)?(1u):(0u)));
    imageStore(AOITClearMaskUAVpixelAddr), uvec4(data));
}
void AOITLoadDataUAV(in uvec2 pixelAddr, out AOITNode nodeArray[4])
{
    AOITData data;
    uint addr = AOITAddrGenUAV(pixelAddr);
    ((data).color = uvec4(AOITColorDataUAV_Data[addr]));
    ((data).depth = vec4(AOITDepthDataUAV_Data[addr]));
    [[unroll]] 
    for (uint i = uint(0); (i < uint((4 / 4))); (++i))
    {
        [[unroll]] 
        for (uint j = uint(0); (j < uint(4)); (++j))
        {
            AOITNode node = {(data).depth[i][j], UnpackUnnormAlpha((data).color[i][j]), ((data).color[i][j] & 16777215u)};
            (nodeArray[((4 * int(i)) + int(j))] = node);
        }
    }
}
void AOITStoreDataUAV(in uvec2 pixelAddr, AOITNode nodeArray[4])
{
    AOITData data;
    uint addr = AOITAddrGenUAV(pixelAddr);
    [[unroll]] 
    for (uint i = uint(0); (i < uint((4 / 4))); (++i))
    {
        [[unroll]] 
        for (uint j = uint(0); (j < uint(4)); (++j))
        {
            ((data).depth[i][j] = (nodeArray[((4 * int(i)) + int(j))]).depth);
            ((data).color[i][j] = (((nodeArray[((4 * int(i)) + int(j))]).color & 16777215u) | (uint((nodeArray[((4 * int(i)) + int(j))]).trans) << uint(24))));
        }
    }
    (AOITDepthDataUAV_Data[addr] = <user defined>((data).depth));
    (AOITColorDataUAV_Data[addr] = <user defined>((data).color));
}
void AOITClearData(inout AOITData data, float depth, vec4 color)
{
    uint packedColor = PackRGBA(vec4(0, 0, 0, (1.0 - (color).w)));
    [[unroll]] 
    for (uint i = uint(0); (i < uint((4 / 4))); (++i))
    {
        ((data).depth[i] = vec4(3.402820e+38));
        ((data).color[i] = uvec4(packedColor));
    }
    ((data).depth[0][0] = depth);
    ((data).color[0][0] = PackRGBA(vec4(((color).www * (color).xyz), (1.0 - (color).w))));
}
void AOITInsertFragment(in float fragmentDepth, in float fragmentTrans, in vec3 fragmentColor, inout AOITNode nodeArray[4])
{
    int i;
    float depth[5];
    float trans[5];
    uint color[5];
    [[unroll]] 
    for ((i = 0); (i < 4); (++i))
    {
        (depth[i] = (nodeArray[i]).depth);
        (trans[i] = (nodeArray[i]).trans);
        (color[i] = (nodeArray[i]).color);
    }
    int index = 0;
    float prevTrans = float(255);
    [[unroll]] 
    for ((i = 0); (i < 4); (++i))
    {
        if((fragmentDepth > depth[i]))
        {
            (++index);
            (prevTrans = trans[i]);
        }
    }
    [[unroll]] 
    for ((i = (4 - 1)); (i >= 0); (--i))
    {
        if((index <= i))
        {
            (depth[(i + 1)] = depth[i]);
            (trans[(i + 1)] = (trans[i] * fragmentTrans));
            (color[(i + 1)] = color[i]);
        }
    }
    const float newFragTrans = (fragmentTrans * prevTrans);
    const uint newFragColor = PackRGB((fragmentColor * vec3((1.0 - fragmentTrans))));
    (depth[index] = fragmentDepth);
    (trans[index] = newFragTrans);
    (color[index] = newFragColor);
    float EMPTY_NODE = asfloat((asuint(float(3.402820e+38)) & uint((4294967295u - uint(((1 << 8) - 1))))));
    if((asfloat((asuint(float(depth[4])) & uint((4294967295u - uint(((1 << 8) - 1)))))) != EMPTY_NODE))
    {
        vec3 toBeRemovedColor = UnpackRGB(color[4]);
        vec3 toBeAccumulatedColor = UnpackRGB(color[(4 - 1)]);
        (color[(4 - 1)] = PackRGB((toBeAccumulatedColor + ((toBeRemovedColor * vec3(trans[(4 - 1)])) * vec3(1 / trans[(4 - 2)])))));
        (trans[(4 - 1)] = trans[4]);
    }
    [[unroll]] 
    for ((i = 0); (i < 4); (++i))
    {
        ((nodeArray[i]).depth = depth[i]);
        ((nodeArray[i]).trans = trans[i]);
        ((nodeArray[i]).color = color[i]);
    }
}
void WriteNewPixelToAOIT(vec2 position, float depth, vec4 color)
{
    AOITNode nodeArray[4];
    uvec2 pixelAddr = uvec2(position);
    AOITControlSurface ctrlSurface = <user defined>(0);
    AOITLoadControlSurfaceUAV(pixelAddr, ctrlSurface);
    if((ctrlSurface).clear)
    {
        AOITData data;
        AOITClearData(data, depth, color);
        uint addr = AOITAddrGenUAV(pixelAddr);
        (AOITDepthDataUAV_Data[addr] = <user defined>((data).depth));
        (AOITColorDataUAV_Data[addr] = <user defined>((data).color));
        imageStore(AOITClearMaskUAVpixelAddr), uvec4(uint(0)));
    }
    else
    {
        AOITLoadDataUAV(pixelAddr, nodeArray);
        AOITInsertFragment(depth, (1.0 - (color).w), (color).xyz, nodeArray);
        AOITStoreDataUAV(pixelAddr, nodeArray);
    }
}
struct Material
{
    vec4 Color;
    vec4 Transmission;
    float RefractionRatio;
    float Collimation;
    vec2 Padding;
    uint TextureFlags;
    uint AlbedoTexID;
    uint MetallicTexID;
    uint RoughnessTexID;
    uint EmissiveTexID;
    uvec3 Padding2;
};
struct ObjectInfo
{
    mat4 toWorld;
    mat4 normalMat;
    uint matID;
};
layout(row_major, push_constant) uniform DrawInfoRootConstant_Block
{
    uint baseInstance;
}DrawInfoRootConstant;

layout(row_major, set = 1, binding = 0) uniform ObjectUniformBlock
{
    ObjectInfo objectInfo[128];
};

layout(row_major, set = 1, binding = 3) uniform LightUniformBlock
{
    mat4 lightViewProj;
    vec4 lightDirection;
    vec4 lightColor;
};

layout(row_major, set = 1, binding = 1) uniform CameraUniform
{
    mat4 camViewProj;
    mat4 camViewMat;
    vec4 camClipInfo;
    vec4 camPosition;
};

layout(row_major, set = 1, binding = 2) uniform MaterialUniform
{
    Material Materials[128];
};

layout(set = 0, binding = 100) uniform texture2D MaterialTextures[8];
layout(set = 0, binding = 0) uniform sampler LinearSampler;
layout(set = 0, binding = 1) uniform texture2D VSM;
layout(set = 0, binding = 2) uniform sampler VSMSampler;
vec2 ComputeMoments(float depth)
{
    vec2 moments;
    ((moments).x = depth);
    vec2 pd = vec2(dFdx(depth), dFdy(depth));
    ((moments).y = ((depth * depth) + (0.25 * dot(pd, pd))));
    return moments;
}
float ChebyshevUpperBound(vec2 moments, float t)
{
    float p = float((t <= (moments).x));
    float variance = ((moments).y - ((moments).x * (moments).x));
    (variance = max(variance, 0.0010000000));
    float d = (t - (moments).x);
    float pMax = (variance / (variance + (d * d)));
    return max(p, pMax);
}
vec3 ShadowContribution(vec2 shadowMapPos, float distanceToLight)
{
    vec2 moments = (texture(sampler2D(VSM, VSMSampler), shadowMapPos)).xy;
    vec3 shadow = vec3(ChebyshevUpperBound(moments, distanceToLight));
    return shadow;
}
vec4 Shade(uint matID, vec2 uv, vec3 worldPos, vec3 normal)
{
    float nDotl = dot(normal, (-(lightDirection).xyz));
    Material mat = Materials[matID];
    vec4 matColor = ((bool(((mat).TextureFlags & uint(1))))?(texture(sampler2D(MaterialTextures[(mat).AlbedoTexID], LinearSampler), uv)):((mat).Color));
    vec3 viewVec = normalize((worldPos - (camPosition).xyz));
    if((nDotl < 0.05))
    {
        (nDotl = 0.05);
    }
    vec3 diffuse = (((lightColor).xyz * (matColor).xyz) * vec3(nDotl));
    vec3 specular = ((lightColor).xyz * vec3(pow(clamp(dot(reflect((-(lightDirection).xyz), normal), viewVec), 0.0, 1.0),float(10.0))));
    vec3 finalColor = clamp((diffuse + (specular * vec3(0.5))), 0.0, 1.0);
    vec4 shadowMapPos = MulMat(lightViewProj,vec4(worldPos, 1.0));
    ((shadowMapPos).y = (-(shadowMapPos).y));
    ((shadowMapPos).xy = (((shadowMapPos).xy + vec2(1.0)) * vec2(0.5)));
    if((((clamp((shadowMapPos).x, 0.010000000, 0.99) == (shadowMapPos).x) && (clamp((shadowMapPos).y, 0.010000000, 0.99) == (shadowMapPos).y)) && ((shadowMapPos).z > 0.0)))
    {
        vec3 lighting = ShadowContribution((shadowMapPos).xy, (shadowMapPos).z);
        (finalColor *= lighting);
    }
    return vec4(finalColor, (matColor).a);
}
struct VSOutput
{
    vec4 Position;
    vec4 WorldPosition;
    vec4 Normal;
    vec4 UV;
    uint MatID;
};
void HLSLmain(VSOutput input1)
{
    vec4 finalColor = Shade((input1).MatID, ((input1).UV).xy, ((input1).WorldPosition).xyz, normalize(((input1).Normal).xyz));
    if(((finalColor).a > 0.010000000))
    {
        WriteNewPixelToAOIT(((input1).Position).xy, ((input1).Position).z, finalColor);
        return;
    }
    clip1((-1.0));
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.WorldPosition = fragInput_POSITION;
    input1.Normal = fragInput_NORMAL;
    input1.UV = fragInput_TEXCOORD0;
    input1.MatID = fragInput_MAT_ID;
    HLSLmain(input1);
}
