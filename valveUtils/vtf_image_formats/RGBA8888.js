
function ImageData_to_RGBA8888(img) {
    return img.data;
}

function RGBA8888_to_ImageData(rgba8888, width, height) {
    return new ImageData(rgba8888, width, height);
}

function RGBA8888_size(width, height) {
    return width * height * 4;
}

export { ImageData_to_RGBA8888, RGBA8888_to_ImageData, RGBA8888_size };
