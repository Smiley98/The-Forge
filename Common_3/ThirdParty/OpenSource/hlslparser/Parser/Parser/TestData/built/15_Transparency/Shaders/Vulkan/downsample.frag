#version 450 core

precision highp float;
precision highp int; 
#extension GL_EXT_samplerless_texture_functions : enable

void GetDimensions(texture1D texName, uint mipLevel, out int width, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture1D texName, out int width)
{
    width = int(textureSize(texName,0));
}

void GetDimensions(texture1D texName, uint mipLevel, out uint width, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture1D texName, out uint width)
{
    width = uint(textureSize(texName,0));
}

void GetDimensions(texture1D texName, uint mipLevel, out float width, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture1D texName, out float width)
{
    width = float(textureSize(texName,0));
}

void GetDimensions(texture1DArray texName, uint mipLevel, out int width, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    elements = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture1DArray texName, out int width, out int elements)
{
    width = int(textureSize(texName,0).x);
    elements = int(textureSize(texName,0).y);
}

void GetDimensions(texture1DArray texName, uint mipLevel, out uint width, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    elements = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture1DArray texName, out uint width, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    elements = uint(textureSize(texName,0).y);
}

void GetDimensions(texture1DArray texName, uint mipLevel, out float width, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    elements = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture1DArray texName, out float width, out float elements)
{
    width = float(textureSize(texName,0).x);
    elements = float(textureSize(texName,0).y);
}

void GetDimensions(texture2D texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture2D texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions(texture2D texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture2D texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions(texture2D texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture2D texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions(texture2DArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture2DArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions(texture2DArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture2DArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions(texture2DArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture2DArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions(utexture1D texName, uint mipLevel, out int width, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture1D texName, out int width)
{
    width = int(textureSize(texName,0));
}

void GetDimensions(utexture1D texName, uint mipLevel, out uint width, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture1D texName, out uint width)
{
    width = uint(textureSize(texName,0));
}

void GetDimensions(utexture1D texName, uint mipLevel, out float width, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture1D texName, out float width)
{
    width = float(textureSize(texName,0));
}

void GetDimensions(utexture1DArray texName, uint mipLevel, out int width, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    elements = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture1DArray texName, out int width, out int elements)
{
    width = int(textureSize(texName,0).x);
    elements = int(textureSize(texName,0).y);
}

void GetDimensions(utexture1DArray texName, uint mipLevel, out uint width, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    elements = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture1DArray texName, out uint width, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    elements = uint(textureSize(texName,0).y);
}

void GetDimensions(utexture1DArray texName, uint mipLevel, out float width, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    elements = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture1DArray texName, out float width, out float elements)
{
    width = float(textureSize(texName,0).x);
    elements = float(textureSize(texName,0).y);
}

void GetDimensions(utexture2D texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture2D texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions(utexture2D texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture2D texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions(utexture2D texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture2D texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions(utexture2DArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture2DArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions(utexture2DArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture2DArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions(utexture2DArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture2DArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions(itexture1D texName, uint mipLevel, out int width, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture1D texName, out int width)
{
    width = int(textureSize(texName,0));
}

void GetDimensions(itexture1D texName, uint mipLevel, out uint width, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture1D texName, out uint width)
{
    width = uint(textureSize(texName,0));
}

void GetDimensions(itexture1D texName, uint mipLevel, out float width, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)));
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture1D texName, out float width)
{
    width = float(textureSize(texName,0));
}

void GetDimensions(itexture1DArray texName, uint mipLevel, out int width, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    elements = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture1DArray texName, out int width, out int elements)
{
    width = int(textureSize(texName,0).x);
    elements = int(textureSize(texName,0).y);
}

void GetDimensions(itexture1DArray texName, uint mipLevel, out uint width, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    elements = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture1DArray texName, out uint width, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    elements = uint(textureSize(texName,0).y);
}

void GetDimensions(itexture1DArray texName, uint mipLevel, out float width, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    elements = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture1DArray texName, out float width, out float elements)
{
    width = float(textureSize(texName,0).x);
    elements = float(textureSize(texName,0).y);
}

void GetDimensions(itexture2D texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture2D texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions(itexture2D texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture2D texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions(itexture2D texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture2D texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions(itexture2DArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture2DArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions(itexture2DArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture2DArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions(itexture2DArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture2DArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions(texture3D texName, uint mipLevel, out int width, out int height, out int depth, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    depth = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture3D texName, out int width, out int height, out int depth)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    depth = int(textureSize(texName,0).z);
}

void GetDimensions(texture3D texName, uint mipLevel, out uint width, out uint height, out uint depth, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    depth = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture3D texName, out uint width, out uint height, out uint depth)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    depth = uint(textureSize(texName,0).z);
}

void GetDimensions(texture3D texName, uint mipLevel, out float width, out float height, out float depth, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    depth = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(texture3D texName, out float width, out float height, out float depth)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    depth = float(textureSize(texName,0).z);
}

void GetDimensions(utexture3D texName, uint mipLevel, out int width, out int height, out int depth, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    depth = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture3D texName, out int width, out int height, out int depth)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    depth = int(textureSize(texName,0).z);
}

void GetDimensions(utexture3D texName, uint mipLevel, out uint width, out uint height, out uint depth, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    depth = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture3D texName, out uint width, out uint height, out uint depth)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    depth = uint(textureSize(texName,0).z);
}

void GetDimensions(utexture3D texName, uint mipLevel, out float width, out float height, out float depth, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    depth = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utexture3D texName, out float width, out float height, out float depth)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    depth = float(textureSize(texName,0).z);
}

void GetDimensions(itexture3D texName, uint mipLevel, out int width, out int height, out int depth, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    depth = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture3D texName, out int width, out int height, out int depth)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    depth = int(textureSize(texName,0).z);
}

void GetDimensions(itexture3D texName, uint mipLevel, out uint width, out uint height, out uint depth, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    depth = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture3D texName, out uint width, out uint height, out uint depth)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    depth = uint(textureSize(texName,0).z);
}

void GetDimensions(itexture3D texName, uint mipLevel, out float width, out float height, out float depth, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    depth = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itexture3D texName, out float width, out float height, out float depth)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    depth = float(textureSize(texName,0).z);
}

void GetDimensions(textureCube texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(textureCube texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions(textureCube texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(textureCube texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions(textureCube texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(textureCube texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions(textureCubeArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(textureCubeArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions(textureCubeArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(textureCubeArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions(textureCubeArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(textureCubeArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions(utextureCube texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utextureCube texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions(utextureCube texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utextureCube texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions(utextureCube texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utextureCube texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions(utextureCubeArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utextureCubeArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions(utextureCubeArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utextureCubeArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions(utextureCubeArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(utextureCubeArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions(itextureCube texName, uint mipLevel, out int width, out int height, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itextureCube texName, out int width, out int height)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
}

void GetDimensions(itextureCube texName, uint mipLevel, out uint width, out uint height, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itextureCube texName, out uint width, out uint height)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
}

void GetDimensions(itextureCube texName, uint mipLevel, out float width, out float height, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itextureCube texName, out float width, out float height)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
}

void GetDimensions(itextureCubeArray texName, uint mipLevel, out int width, out int height, out int elements, out uint numberOfLevels)
{
    width = int(textureSize(texName,int(mipLevel)).x);
    height = int(textureSize(texName,int(mipLevel)).y);
    elements = int(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itextureCubeArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName,0).x);
    height = int(textureSize(texName,0).y);
    elements = int(textureSize(texName,0).z);
}

void GetDimensions(itextureCubeArray texName, uint mipLevel, out uint width, out uint height, out uint elements, out uint numberOfLevels)
{
    width = uint(textureSize(texName,int(mipLevel)).x);
    height = uint(textureSize(texName,int(mipLevel)).y);
    elements = uint(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itextureCubeArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName,0).x);
    height = uint(textureSize(texName,0).y);
    elements = uint(textureSize(texName,0).z);
}

void GetDimensions(itextureCubeArray texName, uint mipLevel, out float width, out float height, out float elements, out uint numberOfLevels)
{
    width = float(textureSize(texName,int(mipLevel)).x);
    height = float(textureSize(texName,int(mipLevel)).y);
    elements = float(textureSize(texName,int(mipLevel)).z);
    numberOfLevels = uint(textureQueryLevels(texName));
}

void GetDimensions(itextureCubeArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName,0).x);
    height = float(textureSize(texName,0).y);
    elements = float(textureSize(texName,0).z);
}

void GetDimensions(texture2DMS texName, out int width, out int height)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
}

void GetDimensions(texture2DMS texName, out uint width, out uint height)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
}

void GetDimensions(texture2DMS texName, out float width, out float height)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
}

void GetDimensions(texture2DMSArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
    elements = int(textureSize(texName).z);
}

void GetDimensions(texture2DMSArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
    elements = uint(textureSize(texName).z);
}

void GetDimensions(texture2DMSArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
    elements = float(textureSize(texName).z);
}

void GetDimensions(utexture2DMS texName, out int width, out int height)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
}

void GetDimensions(utexture2DMS texName, out uint width, out uint height)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
}

void GetDimensions(utexture2DMS texName, out float width, out float height)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
}

void GetDimensions(utexture2DMSArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
    elements = int(textureSize(texName).z);
}

void GetDimensions(utexture2DMSArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
    elements = uint(textureSize(texName).z);
}

void GetDimensions(utexture2DMSArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
    elements = float(textureSize(texName).z);
}

void GetDimensions(itexture2DMS texName, out int width, out int height)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
}

void GetDimensions(itexture2DMS texName, out uint width, out uint height)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
}

void GetDimensions(itexture2DMS texName, out float width, out float height)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
}

void GetDimensions(itexture2DMSArray texName, out int width, out int height, out int elements)
{
    width = int(textureSize(texName).x);
    height = int(textureSize(texName).y);
    elements = int(textureSize(texName).z);
}

void GetDimensions(itexture2DMSArray texName, out uint width, out uint height, out uint elements)
{
    width = uint(textureSize(texName).x);
    height = uint(textureSize(texName).y);
    elements = uint(textureSize(texName).z);
}

void GetDimensions(itexture2DMSArray texName, out float width, out float height, out float elements)
{
    width = float(textureSize(texName).x);
    height = float(textureSize(texName).y);
    elements = float(textureSize(texName).z);
}

#extension GL_EXT_control_flow_attributes : require

layout(location = 0) in vec4 fragInput_TEXCOORD0;
layout(location = 0) out vec4 rast_FragData0; 

struct VSOutput
{
    vec4 Position;
    vec4 UV;
};
layout(set = 0, binding = 0) uniform texture2D Source;
layout(set = 0, binding = 0) uniform sampler PointSampler;
vec4 HLSLmain(VSOutput input1)
{
    vec4 total = vec4(0.0);
    [[unroll]] 
    for (int x = 0; (x < 4); (++x))
    {
        [[unroll]] 
        for (int y = 0; (y < 4); (++y))
        {
            (total += vec4(texelFetch(Source, ivec2(ivec3(uvec3(((((input1).Position).xy * vec2(4)) + vec2(uvec2(x, y))), 0))).xy, (ivec3(uvec3(((((input1).Position).xy * vec2(4)) + vec2(uvec2(x, y))), 0))).z)));
        }
    }
    return (total / vec4(16.0));
}
void main()
{
    VSOutput input1;
    input1.Position = vec4(gl_FragCoord.xyz, 1.0 / gl_FragCoord.w);
    input1.UV = fragInput_TEXCOORD0;
    vec4 result = HLSLmain(input1);
    rast_FragData0 = result;
}
