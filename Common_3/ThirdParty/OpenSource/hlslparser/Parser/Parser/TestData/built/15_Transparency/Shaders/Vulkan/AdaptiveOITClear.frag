#version 450 core

precision highp float;
precision highp int; 
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

layout(location = 0) in vec4 fragInput_Texcoord0;

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
struct VSOutput
{
    vec4 Position;
    vec4 UV;
};
void HLSLmain(VSOutput input1)
{
    uvec2 pixelAddr = uvec2(((input1).Position).xy);
    uint data = 1u;
    imageStore(AOITClearMaskUAVpixelAddr), uvec4(data));
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.UV = fragInput_Texcoord0;
    HLSLmain(input1);
}
