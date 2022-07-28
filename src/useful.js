
/**
 * Awaits an image loading  
 * @param {string|File} src 
 */
function getImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = (src instanceof File ? URL.createObjectURL(src) : src);
        img.onload = () => {
            img.onload = null;
            img.onerror = null;
            resolve(img);
        }
        img.onerror = ev => {
            img.onload = null;
            img.onerror = null;
            reject(ev);
        }
    });
}

async function imageDataToImage(imgData) {
    const canvas = document.createElement('canvas');
    canvas.width = imgData.width;
    canvas.height = imgData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imgData, 0, 0);

    return await getImage(canvas.toDataURL('image/png'));
}

function fileSize(size=0) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb#answer-5624139
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

/**
 * 
 * @param {string} str 
 * @returns {HTMLElement}
 */
function nodeStr(str) {
    return new DOMParser().parseFromString(str, 'text/html').body.firstChild;
}

/**
 * 
 * @param {string} str 
 * @param {function[]} funcs 
 */
function strFuncs(str, funcs=[]) {
    for(let func of funcs) {
        const regex = new RegExp(`(?<!\\\\)%${func.name}.*%`, 'g');

        let searchStart;
        do {
            searchStart = str.search(regex);
            if(searchStart == -1) break;

            const searchEnd = str.slice(searchStart+1).search('%') + searchStart+1;
            const funcStr = str.slice(searchStart+1, searchEnd);

            let args = [];

            if(funcStr.includes('(')) {
                const argsStr = funcStr.slice(funcStr.indexOf('(')+1, funcStr.lastIndexOf(')'));

                // TODO: Make this not bad (This breaks arrays and other shit.)
                args = argsStr.split(/, */);

                // Parse args
                for(let i in args) {
                    // String parse
                    if(args[i].startsWith('"') && args[i].endsWith('"')) {
                        args[i] = args[i].slice(1, -1);
                        continue;
                    }
                    // Boolean parse
                    if(['false', 'true'].includes(args[i])) {
                        args[i] = (args[i] == 'true');
                        continue;
                    }
                    // Number parse
                    if(args[i] == Number(args[i])) {
                        args[i] = Number(args[i]);
                        continue;
                    }
                    // Object parse
                    if(args[i].startsWith('{') && args[i].endsWith('}')) {
                        args[i] = JSON.parse(args[i].replace(/(\w+:)|(\w+ :)/g, s => `"${s.substring(0, s.length-1)}":`));
                        continue;
                    }
                    // Unknown
                    args[i] == undefined;
                }
            }

            const funcVal = func(...args);

            // Parse replace value (TODO: Object parse)
            let replaceValue;
            switch(typeof funcVal) {
                case 'string': replaceValue = `"${funcVal}"`; break;
                case 'number': replaceValue = funcVal.toString(); break;
                case 'undefined': replaceValue = 'null'; break;
                default: replaceValue = funcVal; break;
            }
            
            // Replace %% to value
            str = str.slice(0, searchStart) + replaceValue + str.slice(searchEnd+1);
        } while(searchStart != -1);
    }

    return str;
}

export { getImage, imageDataToImage, fileSize, hexToRgb, nodeStr, strFuncs };
