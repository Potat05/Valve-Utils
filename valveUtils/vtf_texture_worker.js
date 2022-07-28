
/*
    For VTF.setTextureWithWorker()
*/

console.log('VTF Texture Worker Loaded!');


import { VTF_IMAGE_SPECIFICATIONS } from "./vtf_image_specifications.js";


class QueueItem {
    constructor(id, pos, format, textureOptions, imgData) {
        this.id = id;
        this.pos = pos;
        this.format = format;
        this.textureOptions = textureOptions;
        this.imgData = imgData;
    }
}

class Queue {
    /** @type {QueueItem[]} */
    items = [];

    has(id, pos) {
        return this.items.some(item => item.id == id && item.pos == pos);
    }

    remove(id, pos) {
        this.items = this.items.filter(item => {
            return !(
                item.id == id &&
                item.pos.mipmap == pos.mipmap &&
                item.pos.frame == pos.frame &&
                item.pos.face == pos.face &&
                item.pos.slice == pos.slice
            );
        });
    }
    
    push(id, pos, format, textureOptions, imgData) {
        this.remove(id, pos);
        this.items.push(new QueueItem(id, pos, format, textureOptions, imgData));
        if(!processing) {
            processNext();
        }
    }

    shift() {
        this.items.shift();
    }

    first() {
        return this.items[0];
    }

    clear() {
        this.items = [];
    }

    get length() {
        return this.items.length;
    }
}

let queue = new Queue();


let processing = false;
async function processNext() {
    const item = queue.first();

    processing = !!item;
    if(!processing) return;


    const converted = VTF_IMAGE_SPECIFICATIONS[item.format].to(item.imgData, item.textureOptions);


    postMessage({
        type: 'done',
        id: item.id,
        pos: item.pos,
        format: item.format,
        converted: converted
    });

    queue.shift();

    setTimeout(processNext, 100);
};


addEventListener('message', ev => {
    const data = ev.data;

    switch(data.type) {
        case 'add': {
            queue.push(data.id, data.pos, data.format, data.textureOptions, data.imgData);
            break; }
        case 'clear': {
            queue.clear();
            break; }
    }
});

