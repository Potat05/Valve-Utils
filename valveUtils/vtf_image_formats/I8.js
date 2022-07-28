
import { lerp } from "./useful.js";

function ImageData_to_I8(img, { lumMuls=[0.2126, 0.7152, 0.0722], transparentLum=0 } = {}) {
    const i8 = new Uint8Array(img.width * img.height);

    const imgLen = img.width * img.height;
    for(let i=0; i < imgLen; i++) {
        i8[i] = lerp(
            transparentLum,
            (
                lumMuls[0] * img.data[i*4+0] +
                lumMuls[1] * img.data[i*4+1] + 
                lumMuls[2] * img.data[i*4+2]
            ),
            img.data[i*4+3] / 255
        )
    }

    return i8;
}

function I8_to_ImageData(i8, width, height) {
    const img = new ImageData(width, height);

    const imgLen = width * height;
    for(let i=0; i < imgLen; i++) {
        img.data[i*4+0] = img.data[i*4+1] = img.data[i*4+2] = i8[i];
        img.data[i*4+3] = 255;
    }

    return img;
}

function I8_size(width, height) {
    return width * height;
}

export { ImageData_to_I8, I8_to_ImageData, I8_size };
