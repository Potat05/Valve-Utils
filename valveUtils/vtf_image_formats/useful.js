
/*

    Random stuff for ImageData to VTF Images

    RGB565 converters are used for
        ImageData to RGB565
        ImageData to DXT1
        ImageData to DXT3
        ImageData to DXT5

*/

function lerp(a, b, t) {
    return a + t * (b - a);
    // return (1 - t) * a + t * b;
}

function mul8bit(a, b) {
    const t = a*b + 128;
    return t + (t >> 8) >> 8;
}

function RGBA8888_to_RGB565(r, g, b) {
    return (
        (mul8bit(r, 31) << 11) +
        (mul8bit(g, 63) << 5) +
        mul8bit(b, 31)
    );
}

function RGB565_to_RGBA8888(v) {
    return new Uint8Array([
        (((v & 0xF800) >> 11) * 33) >> 2,
        (((v & 0x07E0) >> 5) * 65) >> 4,
        (((v & 0x001F) >> 0) * 33) >> 2,
        255
    ]);
}

function lerp13(p1, p2) {
    return (2*p1 + p2) / 3;
}

function lerp13rgb(p1, p2) {
    return new Uint8Array([
        (2*p1[0] + p2[0]) / 3,
        (2*p1[1] + p2[1]) / 3,
        (2*p1[2] + p2[2]) / 3,
        255
    ]);
}

function lerp12rgb(p1, p2) {
    return new Uint8Array([
        (2*p1[0] + p2[0]) / 2,
        (2*p1[1] + p2[1]) / 2,
        (2*p1[2] + p2[2]) / 2,
        255
    ]);
}

/**
 * An implementation of Floyd-Steinberg dithering
 * https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
 */
 function ditherImgData(img, palette=[32, 64, 32, 255], alpha=true) {
    const w = img.width;
    const h = img.height;
    const cc = (alpha ? 4 : 3);
    for(let y=0; y < h; y++) {
        for(let x=0; x < w; x++) {
            for(let c=0; c < cc; c++) {
                const ind = (x + y*w) * 4 + c;
                const oldPixel = img.data[ind];
                const newPixel = Math.round(oldPixel / 255 * palette[c]) / palette[c] * 255; // Palette based on color
                img.data[ind] = newPixel;
                const quantError = oldPixel - newPixel;

                if(x-1 > 0) img.data[((x+1) + y*w)*4 + c] += quantError * 7 / 16;
                if(y+1 >= h) continue;
                if(x-1 > 0) img.data[((x-1) + (y+1)*w)*4 + c] += quantError * 3 / 16;
                img.data[(x + (y+1)*w)*4 + c] += quantError * 5 / 16;
                if(x+1 < w) img.data[((x+1) + (y+1)*w)*4 + c] += quantError * 1 / 16;
            }
        }
    }
}

export { lerp, mul8bit, RGBA8888_to_RGB565, RGB565_to_RGBA8888, lerp13, lerp13rgb, lerp12rgb, ditherImgData };
