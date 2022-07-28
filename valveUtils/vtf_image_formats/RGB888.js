
import { lerp } from "./useful.js";

function ImageData_to_RGB888(img, { transparentColor=[0, 0, 0] } = {}) {
    const rgb888 = new Uint8Array(img.width * img.height * 3);

    const imgLen = img.width * img.height;
    for(let i=0; i < imgLen; i++) {
        rgb888[i*3+0] = lerp(transparentColor[0], img.data[i*4+0], img.data[i*4+3] / 255);
        rgb888[i*3+1] = lerp(transparentColor[1], img.data[i*4+1], img.data[i*4+3] / 255);
        rgb888[i*3+2] = lerp(transparentColor[2], img.data[i*4+2], img.data[i*4+3] / 255);
    }

    return rgb888;
}

function RGB888_to_ImageData(rgb8888, width, height) {
    const img = new ImageData(width, height);

    const imgLen = img.width * img.height;
    for(let i=0; i < imgLen; i++) {
        img.data[i*4+0] = rgb8888[i*3+0];
        img.data[i*4+1] = rgb8888[i*3+1];
        img.data[i*4+2] = rgb8888[i*3+2];
        img.data[i*4+3] = 255;
    }

    return img;
}

function RGB888_size(width, height) {
    return width * height * 3;
}

export { ImageData_to_RGB888, RGB888_to_ImageData, RGB888_size };
