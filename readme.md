  
# [Valve Texture Utils](https://github.com/Potat05/Valve-Utils)  
  
Create & Modify VTF files  
  
Everything is inside valveUtils folder  
Everything else is just for testing  

# Projects  
  
[TF2 Spray Creator](https://potat05.github.io/Valve-Utils/)  
  
# Imports  

```JavaScript
import { VTF } from "../valveUtils/vtf.js";
```

# Usage  

Create a VTF
```JavaScript
const vtf = new VTF();

// Load a VTF file into the VTF object
vtf.load(dataArr);
```

Set textures of VTF
```JavaScript
// Initialize the textures
vtf.resource_highResImageData(VTF.IMAGE_FORMATS.DXT1, 512, 512, 1, 1);

// Set a texture
vtf.setTexture(new VTF.Pos(0, 0), image_mip0); // May lag ALOT on larger images (Especially with DXT formats)
await vtf.setTextureWithWorker(new VTF.Pos(1, 0), image_mip1) // Or use a worker, Yay no lag!
```

Embed JSON into VTF
```JavaScript
vtf.resource_KeyValue({
    file_info: {
        comment: "Hello there."
    }
});
```

CRC check
```JavaScript
vtf.resource_crc();
```

Remove a resource
```JavaScript
vtf.removeResource(VTF.RESOURCE_TYPES.CRC);
```

Get VTF file
```JavaScript
vtf.size; // Size of file
vtf.bytes; // Bytes of file
vtf.url; // For downloading
```

# TODO  

* Clean/refactor code  
* VMT Format 
* DXT1 Image Format (Make better) 
* DXT3 Image Format
* DXT5 Image Format

# Information  

[DXT Image Compression](https://github.com/nothings/stb/blob/master/stb_dxt.h)  
[BC Image Compression](https://github.com/microsoft/DirectXTex)
