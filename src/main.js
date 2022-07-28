
import { VTF } from "../valveUtils/vtf.js";
import { fileSize, getImage, hexToRgb, imageDataToImage, nodeStr, strFuncs } from "./useful.js";

const DEFAULT_IMAGE = './resource/colorchart.jpg';

const LINK = 'https://github.com/Potat05/Valve-Utils';
const VERSION = '1.0';
document.querySelector('#version').innerText = VERSION;

const download = document.querySelector('#download');

const kvdInput = document.querySelector('#resource-KVD');
const crcInput = document.querySelector('#resource-CRC');
const widthInput = document.querySelector('#imageWidth');
const heightInput = document.querySelector('#imageHeight');
const imageSmoothingInput = document.querySelector('#imageSmoothing');
const imageFitInput = document.querySelector('#imageFit');
const ditherInput = document.querySelector('#dither');
const formatInput = document.querySelector('#format');
const transparencyThresholdInput = document.querySelector('#transparencyThreshold');
const transparencyColorInput = document.querySelector('#transparencyColor');
const LuminanceMulRInput = document.querySelector('#lumMulR');
const LuminanceMulGInput = document.querySelector('#lumMulG');
const LuminanceMulBInput = document.querySelector('#lumMulB');
const transparencyLuminanceInput = document.querySelector('#transparencyLuminance');
const samplingMethodInput = document.querySelector('#sampleMethod');
const mipmapCountInput = document.querySelector('#mipmapCount');
const refineCountInput = document.querySelector('#refineCount');

/** @type {HTMLDivElement} */
const texturesHighRes = document.querySelector('#texturesHighRes');

const KVD_String_Functions = [
    function converter() {
        return LINK;
    },
    function version() {
        return VERSION;
    },
    function date(formatted=false) {
        if(formatted) return new Date().toString();
        return Date.now();
    },
    function dithered() {
        return ditherInput.checked && ([4, 19, 20, 21].includes(parseInt(formatInput.value)));
    }
];

function getTextureOptions() {
    return {
        dither: ditherInput.checked,
        transparentColor: hexToRgb(transparencyColorInput.value),
        lumMuls: [parseFloat(LuminanceMulRInput.value), parseFloat(LuminanceMulGInput.value), parseFloat(LuminanceMulBInput.value)],
        transparentLum: parseInt(transparencyLuminanceInput.value),
        alphaThreshold: parseInt(transparencyThresholdInput.value),
        refineCount: parseInt(refineCountInput.value)
    }
}
function getImageOptions() {
    return {
        smoothing: imageSmoothingInput.checked,
        fit: imageFitInput.value
    }
}





const vtf = new VTF();




let vtf_url;
function generateDownload() {
    // Remove previous download
    if(vtf_url) URL.revokeObjectURL(vtf_url);

    // Generate CRC
    if(crcInput.checked) vtf.resource_crc();
    else vtf.removeResource(VTF.RESOURCES_TYPES.CRC);
    
    // Generate KVD
    let KVD_object = null;
    try {
        const KVD_str = strFuncs(kvdInput.value, KVD_String_Functions);
        KVD_object = JSON.parse(`{${KVD_str}}`);
    } catch(err) {}
    vtf.resource_KeyValue(KVD_object);

    // Create download
    vtf_url = vtf.url;
    download.href = vtf_url;
    const size = vtf.size;
    download.innerText = `Download VTF - ${fileSize(size)}`;
    if(size <= 524288) download.style.color = 'green';
    else download.style.color = 'red';

    // Debug output
    // console.log(vtf);

    // Debug preview
    /** @type {HTMLCanvasElement} */
    const sprayPreview = document.querySelector('#sprayPreview');
    if(!sprayPreview) return;
    sprayPreview.width = 1024;
    sprayPreview.height = 1024;
    const sprayCtx = sprayPreview.getContext('2d');
    sprayCtx.clearRect(0, 0, sprayPreview.width, sprayPreview.height);
    imageDataToImage(vtf.getTexture(new VTF.Pos(0, 0)).from()).then(img => {
        sprayCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, sprayPreview.width, sprayPreview.height);
    });
}




function setHighRes() {
    vtf.resource_highResImageData(parseInt(formatInput.value), parseInt(widthInput.value), parseInt(heightInput.value), parseInt(mipmapCountInput.value), 1);
}

function getMipElem(mipmap) {
    return texturesHighRes.querySelector(`[mipmap="${mipmap}"]`);
}

function generateImage(mipmap=0) {
    const mipElem = getMipElem(mipmap);
    if(!mipElem) return;

    // Load the image
    let imgsrc = mipElem.querySelector('input[type="file"]').files[0];
    // Load previous mipmap if invalid image.
    if(!imgsrc) {
        for(let i=mipmap-1; i >= 0 && !imgsrc; i--) {
            imgsrc = getMipElem(i).querySelector('input[type="file"]').files[0];
        }
    }
    if(!imgsrc) imgsrc = DEFAULT_IMAGE;

    getImage(imgsrc).then(async img => {
        // Set texture at mip
        // const texture = vtf.setTexture(new VTF.Pos(mipmap), img, getTextureOptions(), getImageOptions());
        const texture = await vtf.setTextureWithWorker(new VTF.Pos(mipmap), img, getTextureOptions(), getImageOptions());
        // View image
        const canvas = texturesHighRes.querySelector(`[mipmap="${texture.pos.mipmap}"] canvas`);
        const ctx = canvas.getContext('2d');
        canvas.width = texture.width;
        canvas.height = texture.height;
        ctx.putImageData(texture.from(), 0, 0);
    
        if(texture.width >= 256 && texture.height >= 256) {
            canvas.classList.add('canvasSmoothing');
        } else {
            canvas.classList.remove('canvasSmoothing');
        }

        generateDownload();
    });

}

function getMaxMips() {
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
    
    for(let i=0; i < 16; i++) {
        const w = width / (2**i);
        const h = height / (2**i);
        if(w % 1 != 0 || h % 1 != 0 || w % 4 != 0 || h % 4 != 0 || w < 4 || h < 4) {
            return i;
        }
    }
    return 1;
}

function setTextureDivs() {
    setHighRes();

    const mipmaps = Math.min(parseInt(mipmapCountInput.value), getMaxMips());
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);

    // Delete extra mipmaps
    texturesHighRes.querySelectorAll('[mipmap]').forEach(elem => {
        const mip = parseInt(elem.getAttribute('mipmap'));

        if(mip >= mipmaps) {
            elem.remove();
            return;
        }

        const w = width / (2**mip);
        const h = height / (2**mip);

        elem.querySelector('legend').innerText = `Mip ${parseInt(elem.getAttribute('mipmap'))+1} - ${w}x${h}`;
    });

    // Create extra mipmaps
    for(let i=0; i < mipmaps; i++) {
        const w = width / (2**i);
        const h = height / (2**i);
        if(texturesHighRes.querySelector(`[mipmap="${i}"]`) == null) {
            const elem = nodeStr(/*html*/`
                <fieldset class="texture" mipmap="${i}">
                    <legend>Mip ${i+1} - ${w}x${h}</legend>
                    <input type="file" accept="image/*">
                    <canvas></canvas>
                </fieldset>
            `);
            /** @type {HTMLInputElement} */
            const fileInput = elem.querySelector('input[type="file"]');
            fileInput.addEventListener('change', () => {
                setTextureDivs();
                generateDownload();
            });
            texturesHighRes.appendChild(elem);
        }
    }

    for(let i=0; i < parseInt(mipmapCountInput.value); i++) {
        generateImage(i);
    }
}





function setFormatInputs() {
    for(let i=0; i < formatInput.length; i++) {
        if(formatInput[i].value == formatInput.value) {
            formatInput.title = formatInput[i].title;
        }
    }

    document.querySelectorAll('[formats]').forEach(elem => {
        const formats = elem.getAttribute('formats').split(' ').map(v => parseInt(v));
        if(formats.includes(parseInt(formatInput.value))) {
            elem.classList.remove('hidden');
        } else {
            elem.classList.add('hidden');
        }
    });
}

setFormatInputs();

formatInput.addEventListener('change', () => {
    setFormatInputs();

    setHighRes();
    for(let i=0; i < parseInt(mipmapCountInput.value); i++) {
        generateImage(i);
    }
    generateDownload();
});

samplingMethodInput.addEventListener('change', () => {
    vtf.setSamplingMethod(samplingMethodInput.value);
    generateDownload();
});

function setMipmapMax() {
    const max = getMaxMips();
    mipmapCountInput.max = max;
    mipmapCountInput.value = Math.min(Math.max(parseInt(mipmapCountInput.value), 1), max);
}

mipmapCountInput.addEventListener('change', () => {
    setMipmapMax();
    
    setTextureDivs();
    generateDownload();
});

[widthInput, heightInput].forEach(elem => {
    elem.addEventListener('change', () => {
        widthInput.value = Math.min(Math.max(parseInt(widthInput.value) - parseInt(widthInput.value) % 4, 4), parseInt(widthInput.max));
        heightInput.value = Math.min(Math.max(parseInt(heightInput.value) - parseInt(heightInput.value) % 4, 4), parseInt(widthInput.max));
        
        setMipmapMax();

        setHighRes();
        setTextureDivs();
        generateDownload();
    });
});

[imageSmoothingInput, imageFitInput, ditherInput, transparencyThresholdInput, transparencyColorInput, LuminanceMulRInput, LuminanceMulGInput, LuminanceMulBInput, transparencyLuminanceInput, refineCountInput].forEach(elem => {
    elem.addEventListener('change', () => {
        for(let i=0; i < parseInt(mipmapCountInput.value); i++) {
            generateImage(i);
        }
        generateDownload();
    });
});

[kvdInput, crcInput].forEach(elem => {
    elem.addEventListener('change', () => {
        generateDownload();
    });
});



// Init
(function() {
    setMipmapMax();
    vtf.setSamplingMethod(samplingMethodInput.value);
    setTextureDivs();
    generateDownload();
}());
