
import { lerp, ditherImgData } from "./useful.js";



function ImageData_to_RGB565(img, { dither=true, transparentColor=[0, 0, 0] } = {}) {
    if(dither) ditherImgData(img, [32, 64, 32], false);

    const rgb565 = new Uint16Array(img.width * img.height);

    const imgLen = img.width * img.height;
    for(let i=0; i < imgLen; i++) {
        rgb565[i] = (
            ((lerp(transparentColor[2], img.data[i*4+2], img.data[i*4+3] / 255) & 0b11111000) << 8) |
            ((lerp(transparentColor[1], img.data[i*4+1], img.data[i*4+3] / 255) & 0b11111100) << 3) |
            ((lerp(transparentColor[0], img.data[i*4+0], img.data[i*4+3] / 255) & 0b11111000) >> 3)
        );
    }

    return new Uint8Array(rgb565.buffer);
}

function RGB565_to_ImageData(rgb565, width, height) {
    const img = new ImageData(width, height);

    rgb565 = new Uint16Array(rgb565.buffer);

    const imgLen = width * height;
    for(let i=0; i < imgLen; i++) {
        img.data[i*4+2] = ((rgb565[i] & 0b1111100000000000) >> 8) * 1.028226;
        img.data[i*4+1] = ((rgb565[i] & 0b0000011111100000) >> 3) * 1.011905;
        img.data[i*4+0] = ((rgb565[i] & 0b0000000000011111) << 3) * 1.028226;
        img.data[i*4+3] = 255;
    }

    return img;
}

function RGB565_size(width, height) {
    return width * height * 2;
}

export { ImageData_to_RGB565, RGB565_to_ImageData, RGB565_size };
