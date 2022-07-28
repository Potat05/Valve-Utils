
import { ditherImgData } from "./useful.js";



function ImageData_to_BGRA5551(img, { dither=true, ditherAlpha=true, alphaThreshold=127 } = {}) {
    const bgra5551 = new Uint16Array(img.width * img.height);
    const imgLen = img.width * img.height;

    if(dither) {
        ditherImgData(img, [32, 32, 32, 1], ditherAlpha);
        alphaThreshold = 255;
    }

    for(let i=0; i < imgLen; i++) {
        bgra5551[i] = (
            ((img.data[i*4+0] & 0b11111000) << 7) |
            ((img.data[i*4+1] & 0b11111000) << 2) |
            ((img.data[i*4+2] & 0b11111000) >> 3) |
            (img.data[i*4+3] >= alphaThreshold ? 0b1000000000000000 : 0)
        );
    }

    return new Uint8Array(bgra5551.buffer);
}

function BGRA5551_to_ImageData(bgra5551, width, height) {
    const img = new ImageData(width, height);

    bgra5551 = new Uint16Array(bgra5551.buffer);

    const imgLen = width * height;
    for(let i=0; i < imgLen; i++) {
        img.data[i*4+0] = ((bgra5551[i] & 0b0111110000000000) >> 7) * 1.028226;
        img.data[i*4+1] = ((bgra5551[i] & 0b0000001111100000) >> 2) * 1.028226;
        img.data[i*4+2] = ((bgra5551[i] & 0b0000000000011111) << 3) * 1.028226;
        img.data[i*4+3] = (bgra5551[i] & 0b1000000000000000 ? 255 : 0);
    }

    return img;
}

function BGRA5551_size(width, height) {
    return width * height * 2;
}

export { ImageData_to_BGRA5551, BGRA5551_to_ImageData, BGRA5551_size };
