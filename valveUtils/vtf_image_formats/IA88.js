
function ImageData_to_IA88(img, { lumMuls=[0.2126, 0.7152, 0.0722] } = {}) {
    const ia88 = new Uint8Array(img.width * img.height * 2);

    const imgLen = img.width * img.height;
    for(let i=0; i < imgLen; i++) {
        ia88[i*2+0] = (lumMuls[0] * img.data[i*4+0] +
                       lumMuls[1] * img.data[i*4+1] + 
                       lumMuls[2] * img.data[i*4+2]);
        ia88[i*2+1] = img.data[i*4+3];
    }

    return ia88;
}

function IA88_to_ImageData(ia88, width, height) {
    const img = new ImageData(width, height);

    const imgLen = width * height;
    for(let i=0; i < imgLen; i++) {
        img.data[i*4+0] = img.data[i*4+1] = img.data[i*4+2] = ia88[i*2+0];
        img.data[i*4+3] = ia88[i*2+1];
    }

    return img;
}

function IA88_size(width, height) {
    return width * height * 2;
}

export { ImageData_to_IA88, IA88_to_ImageData, IA88_size };
