
import { lerp12rgb, lerp13rgb, RGB565_to_RGBA8888 } from "./useful.js";
import { dxt1_compress_block } from "./dxt_block.js";

function ImageData_to_DXT1(img, { refineCount=0 } = {}) {
    if(img.width % 4 != 0 || img.height % 4 != 0) {
        console.error(`Cannot convert image to DXT1 format! Image with or height isn't a multiple of 4!`);
        return;
    }

    const dxt1 = new Uint8Array((img.width * img.height) / 2);

    const stride = img.width * 4;
    const block = new Uint8Array(64);
    let dxt1pos = 0;
    for(let y=0; y < img.height; y += 4) {
        for(let x=0; x < img.width; x += 4) {
            const pos = (x + y*img.width) * 4;

            block.set(img.data.slice(pos, pos+16), 0);
            block.set(img.data.slice(pos+stride, pos+stride+16), 16);
            block.set(img.data.slice(pos+stride*2, pos+stride*2+16), 32);
            block.set(img.data.slice(pos+stride*3, pos+stride*3+16), 48);
    
            dxt1.set(dxt1_compress_block(block, refineCount), dxt1pos);
            dxt1pos += 8;
        }
    }

    return dxt1;
}

function DXT1_to_ImageData(dxt1, width, height) {
    const img = new ImageData(width, height);

    for(let y=0; y < height; y += 4) {
        for(let x=0; x < width; x += 4) {

            const offset = (x + y*width/4) * 2;

            const col1_16 = (dxt1[offset+1] << 8) | dxt1[offset+0];
            const col2_16 = (dxt1[offset+3] << 8) | dxt1[offset+2];

            const col1 = RGB565_to_RGBA8888(col1_16);
            const col2 = RGB565_to_RGBA8888(col2_16);
            const colors = (col1_16 > col2_16 ? [
                col1,
                col2,
                lerp13rgb(col1, col2),
                lerp13rgb(col2, col1),
            ] : [
                col1,
                col2,
                lerp12rgb(col1, col2),
                [0, 0, 0, 255]
            ]);

            for(let dx=0; dx < 4; dx++) {
                for(let dy=0; dy < 4; dy++) {
                    const ind = (x+dx + (y+dy) * width) * 4;

                    const col = colors[((dxt1[offset + dy + 4]) >> dx*2) & 0b00000011];

                    img.data[ind] = col[0];
                    img.data[ind+1] = col[1];
                    img.data[ind+2] = col[2];
                    img.data[ind+3] = col[3];
                }
            }
        }
    }

    return img;
}

function DXT1_size(width, height) {
    if(width % 4 != 0 || height % 4 != 0) return null;
    return (width * height) / 2;
}

export { ImageData_to_DXT1, DXT1_to_ImageData, DXT1_size };
