

/**
 * Load ImageData from Image
 * @param {Image} file
 * @param {number} width Width of output imageData
 * @param {number} height Height of output imageData
 * @param {{smoothing: boolean, fit: "none"|"contain"|"cover"|"strech"}}
 */
function getImageData(img, width, height, { smoothing=true, fit="contain" } = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(width) ?? img.width;
    canvas.height = Math.floor(height) ?? img.height;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = smoothing;


    switch(fit) {
        case 'none': {
            ctx.drawImage(img, 0, 0, img.width, img.height, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2, img.width, img.height);  
            break; }
        case 'contain': {
            const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
            ctx.drawImage(img, 0, 0, img.width, img.height, (canvas.width - img.width*ratio) / 2, (canvas.height - img.height*ratio) / 2, img.width*ratio, img.height*ratio);  
            break; }
        case 'cover': {
            const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
            ctx.drawImage(img, 0, 0, img.width, img.height, (canvas.width - img.width*ratio) / 2, (canvas.height - img.height*ratio) / 2, img.width*ratio, img.height*ratio);  
            break; }
        case 'strech': {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            break; }
    }

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}



/**
 * Converts an object to $keyvalues
 * https://developer.valvesoftware.com/wiki/$keyvalues
 * @param {object} object 
 * @returns {string}
 */
function $keyvalues_to(object) {
    let str = '';
    for(let i in object) {
        if(typeof object[i] == 'object') {
            str += `${i}\n{\n${$keyvalues_to(object[i])}}\n`;
        } else {
            str += `"${i}" "${object[i]}"\n`;
        }
    }
    return str;
}

/**
 * Converts $keyvalues to an object
 * TODO
 * @param {string} string 
 * @returns {object}
 */
function $keyvalues_from(string) {
    return {}
}


// Generate the crc table used for crc32()
const CRC_TABLE = new Uint32Array(256).map((v, i) => {
    for(let j=0; j < 8; j++) {
        i = ((i&1) ? (0xEDB88320 ^ (i >>> 1)) : (i >>> 1));
    }
    return i;
});

/**
 * Gets CRC value from data
 * @param {Uint8Array} arr 
 * @returns {number}
 */
function crc32(arr) {
    let crc = 0xFFFFFFFF;
    for(let i=0; i < arr.length; i++) {
        crc = (crc >> 8) ^ CRC_TABLE[(crc ^ arr[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}



export { getImageData, $keyvalues_to, $keyvalues_from, crc32 };
