
import { ImageData_to_RGBA8888, RGBA8888_to_ImageData, RGBA8888_size } from "./vtf_image_formats/RGBA8888.js";
import { ImageData_to_RGB888, RGB888_to_ImageData, RGB888_size } from "./vtf_image_formats/RGB888.js";
import { I8_to_ImageData, ImageData_to_I8, I8_size } from "./vtf_image_formats/I8.js";
import { IA88_to_ImageData, ImageData_to_IA88, IA88_size } from "./vtf_image_formats/IA88.js";
import { RGB565_to_ImageData, ImageData_to_RGB565, RGB565_size } from "./vtf_image_formats/RGB565.js";
import { DXT1_size, DXT1_to_ImageData, ImageData_to_DXT1 } from "./vtf_image_formats/DXT1.js";
import { BGRA4444_to_ImageData, ImageData_to_BGRA4444, BGRA4444_size } from "./vtf_image_formats/BGRA4444.js";
import { BGRA5551_to_ImageData, ImageData_to_BGRA5551, BGRA5551_size } from "./vtf_image_formats/BGRA5551.js";
import { DXT1_ONEBITALPHA_size, DXT1_ONEBITALPHA_to_ImageData, ImageData_to_DXT1_ONEBITALPHA } from "./vtf_image_formats/DXT1_ONEBITALPHA.js";

const VTF_IMAGE_SPECIFICATIONS = {
    0: { to: ImageData_to_RGBA8888, from: RGBA8888_to_ImageData, size: RGBA8888_size },
    2: { to: ImageData_to_RGB888, from: RGB888_to_ImageData, size: RGB888_size },
    4: { to: ImageData_to_RGB565, from: RGB565_to_ImageData, size: RGB565_size },
    5: { to: ImageData_to_I8, from: I8_to_ImageData, size: I8_size },
    6: { to: ImageData_to_IA88, from: IA88_to_ImageData, size: IA88_size },
    13: { to: ImageData_to_DXT1, from: DXT1_to_ImageData, size: DXT1_size },
    19: { to: ImageData_to_BGRA4444, from: BGRA4444_to_ImageData, size: BGRA4444_size },
    20: { to: ImageData_to_DXT1_ONEBITALPHA, from: DXT1_ONEBITALPHA_to_ImageData, size: DXT1_ONEBITALPHA_size },
    21: { to: ImageData_to_BGRA5551, from: BGRA5551_to_ImageData, size: BGRA5551_size }
}

export { VTF_IMAGE_SPECIFICATIONS };
