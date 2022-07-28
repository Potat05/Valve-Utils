
import { mul8bit, ditherImgData } from "./useful.js";



function ImageData_to_BGRA4444(img, { dither=true, ditherAlpha=true } = {}) {
    if(dither) ditherImgData(img, [16, 16, 16, 16], ditherAlpha);

    const bgra4444 = new Uint8Array(img.width * img.height * 2);

    const imgLen = img.width * img.height;
    for(let i=0; i < imgLen; i++) {
        bgra4444[i*2+0] = (mul8bit(img.data[i*4+1], 15) << 4) + mul8bit(img.data[i*4+2], 15);
        bgra4444[i*2+1] = (mul8bit(img.data[i*4+3], 15) << 4) + mul8bit(img.data[i*4+0], 15);
    }

    return bgra4444;
}

function BGRA4444_to_ImageData(bgra4444, width, height) {
    const img = new ImageData(width, height);

    const imgLen = width * height;
    for(let i=0; i < imgLen; i++) {
        img.data[i*4+0] = ((bgra4444[i*2+1] << 4) & 0xF0) * 1.0625;
        img.data[i*4+1] = (bgra4444[i*2+0] & 0xF0) * 1.0625;
        img.data[i*4+2] = ((bgra4444[i*2+0] << 4) & 0xF0) * 1.0625;
        img.data[i*4+3] = (bgra4444[i*2+1] & 0xF0) * 1.0625;
    }

    return img;
}

function BGRA4444_size(width, height) {
    return width * height * 2;
}

export { ImageData_to_BGRA4444, BGRA4444_to_ImageData, BGRA4444_size };
