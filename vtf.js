
/*

    https://developer.valvesoftware.com/wiki/Valve_Texture_Format
    https://developer.valvesoftware.com/wiki/Material

*/


import { Types } from "./struct.js";
import { getImageData, $keyvalues_to, $keyvalues_from, crc32 } from "./useful.js";
import { VTF_IMAGE_SPECIFICATIONS } from "./vtf_image_specifications.js";

const VTF_FLAGS_BIT = {
    POINTSAMPLE: 0x00000001,
    TRILINEAR: 0x00000002,
    CLAMPS: 0x00000004,
    CLAMPT: 0x00000008,
    ANISOTROPIC: 0x00000010,
    HINT_DXT5: 0x00000020,
    SRGB: 0x00000040,
    NORMAL: 0x00000080,
    NOMIP: 0x00000100,
    NOLOD: 0x00000200,
    ALL_MIPS: 0x00000400,
    PROCEDURAL: 0x00000800,
    ONEBITALPHA: 0x00001000,
    EIGHTBITALPHA: 0x00002000,
    ENVMAP: 0x00004000, // If this flag is set use 6 textures per side of cube for environment map
    RENDERTARGET: 0x00008000,
    DEPTHRENDERTARGET: 0x00010000,
    NODEBUGOVERRIDE: 0x00020000,
    SINGLECOPY: 0x00040000,
    PRE_SRGB: 0x00080000,
    UNUSED_00100000: 0x00100000,
    UNUSED_00200000: 0x00200000,
    UNUSED_00400000: 0x00400000,
    NODEPTHBUFFER: 0x00800000,
    UNUSED_01000000: 0x01000000,
    CLAMPU: 0x02000000,
    VERTEXTEXTURE: 0x04000000,
    SSBUMP: 0x08000000,
    UNUSED_10000000: 0x10000000,
    BORDER: 0x20000000,
    UNUSED_40000000: 0x40000000,
    UNUSED_80000000: 0x80000000,
}

/** @type {"POINTSAMPLE"|"TRILINEAR"|"CLAMPS"|"CLAMPT"|"ANISOTROPIC"|"HINT_DXT5"|"SRGB"|"NORMAL"|"NOMIP"|"NOLOD"|"ALL_MIPS"|"PROCEDURAL"|"ONEBITALPHA"|"EIGHTBITALPHA"|"ENVMAP"|"RENDERTARGET"|"DEPTHRENDERTARGET"|"NODEBUGOVERRIDE"|"SINGLECOPY"|"PRE_SRGB"|"NODEPTHBUFFER"|"CLAMPU"|"VERTEXTEXTURE"|"SSBUMP"|"BORDER"} */
const VTF_FLAGS = undefined;

const RESOURCE_TAGS = {
    LOWRES_IMAGEDATA: new Uint8Array([ 0x01, 0x00, 0x00 ]),
    HIGHRES_IMAGEDATA: new Uint8Array([ 0x30, 0x00, 0x00 ]),
    ANIMPARTICLESHEET: new Uint8Array([ 0x10, 0x00, 0x00 ]),
    CRC: new Uint8Array([ 0x43, 0x52, 0x43 ]),
    LODCONTROL: new Uint8Array([ 0x4C, 0x4F, 0x44 ]),
    GAMEFLAGS: new Uint8Array([ 0x54, 0x53, 0x4F ]),
    KEYVALUEDATA: new Uint8Array([ 0x4B, 0x56, 0x44 ])
}


// Custom type for Struct
class VTF_Texture {
    constructor(format, pos, width, height) {
        this.format = format;
        
        this.pos = pos;
        
        this.width = width;
        this.height = height;

        this.name = `texture_${pos.str}`;
    }

    get size() {
        return VTF_IMAGE_SPECIFICATIONS[this.format].size(this.width, this.height);
    }
    set bytes(bytes) {
        this.converted = bytes;
    }
    get bytes() {
        if(!this.converted) {
            this.converted = new Uint8Array(this.size);
        }
        return this.converted;
    }

    getImageData(img, imageOptions={}) {
        return getImageData(img, this.width, this.height, imageOptions);
    }
    
    // Convert to formatted texture
    to(img, textureOptions={}, imageOptions={}) {
        if(typeof img == ImageData) {
            if(img.width != this.width || img.height != this.height) return;
            this.bytes = VTF_IMAGE_SPECIFICATIONS[this.format].to(img, textureOptions);
        } else {
            this.bytes = VTF_IMAGE_SPECIFICATIONS[this.format].to(this.getImageData(img, imageOptions), textureOptions);
        }
    }
    // Converted back to imageData (For more accurate viewing)
    from() {
        return VTF_IMAGE_SPECIFICATIONS[this.format].from(this.bytes, this.width, this.height);
    }
}

class Pos {
    constructor(mipmap=0, frame=0, face=0, slice=0) {
        this.mipmap = mipmap;
        this.frame = frame;

        // TODO: Face and slice support
        this.face = face;
        this.slice = slice;
    }

    get str() {
        return `mi${this.mipmap}fr${this.frame}fa${this.face}sl${this.slice}`;
    }

    equals(pos) {
        return (this.mipmap == pos.mipmap &&
                this.frame == pos.frame &&
                this.face == pos.face &&
                this.slice == pos.slice);
    }
}



/** @type {Worker|null} */
let textureWorker = null;

let id = 0;

class VTF {
    id = id++;


    static IMAGE_FORMATS = {
        NONE: -1,
        RGBA8888: 0,
        ABGR8888: 1,
        RGB888: 2,
        BGR888: 3,
        RGB565: 4,
        I8: 5,
        IA88: 6,
        P8: 7,
        A8: 8,
        RGB888_BLUESCREEN: 9,
        BGR888_BLUESCREEN: 10,
        ARGB8888: 11,
        BGRA8888: 12,
        DXT1: 13,
        DXT3: 14,
        DXT5: 15,
        BGRX8888: 16,
        BGR565: 17,
        RGRX5551: 18,
        BGRA4444: 19,
        DXT1_ONEBITALPHA: 20,
        BGRA5551: 21,
        UV88: 22,
        UVWQ8888: 23,
        RGBA16161616F: 24,
        RGBA16161616: 25,
        UVLX8888: 26
    }

    static RESOURCES_TYPES = {
        LOWRES_IMAGEDATA: 'lowRes',
        HIGHRES_IMAGEDATA: 'highRes',
        ANIMPARTICLESHEET: 'animParticleSheet',
        CRC: 'CRC',
        LODCONTROL: 'LODControl',
        GAMEFLAGS: 'gameFlags',
        KEYVALUEDATA: 'keyValueData',
        0x010000: 'lowRes',
        0x300000: 'highRes',
        0x100000: 'animParticleSheet',
        0x435243: 'CRC',
        0x4C4F44: 'LODControl',
        0x54534F: 'gameFlags',
        0x4B5644: 'keyValueData'
    }
    




    file = new Types.Struct('file', [
        new Types.Struct('header', [
            new Types.ASCII('signature', 'VTF\0'),
            new Types.Uint32Array('version', [7, 4]),
            new Types.Uint32('headerSize', 0), // This gets set later
            new Types.Uint16('width'),
            new Types.Uint16('height'),
            new Types.Uint32('flags'),
            new Types.Uint16('frames'),
            new Types.Uint16('startFrame', 0),
            new Types.Uint8Array('padding0', 4),
            new Types.Float32Array('reflectivity', [ 1, 1, 1 ]), // Reflectivity of material (rgb) only used while generating light (VRAD) for a map
            new Types.Uint8Array('padding1', 4),
            new Types.Float32('bumpmapScale', 1), // Used if $bumpmap in vmf
            new Types.Uint32('highResImageFormat'),
            new Types.Uint8('mipmapCount'),
            new Types.Uint32('lowResImageFormat', VTF.IMAGE_FORMATS.DXT1), // Always DXT1
            new Types.Uint8('lowResImageWidth', 0),
            new Types.Uint8('lowResImageHeight', 0),
            new Types.Uint16('depth', 1), // Not meant for use
            new Types.Uint8Array('padding2', 3),
            new Types.Uint32('numResources'), // This gets set later
            new Types.Uint8Array('padding3', 8),
            new Types.Struct('resourceEntries', []), // Resources
            new Types.Uint8Array('paddingAlign', 0) // The final pad (Header size must be 16 byte aligned)
        ])
    ]);



    /**
     * Sets/gets flag  
     * @param {VTF_FLAGS} flag  
     * @param {null|true|false} set null to just get  
     * @returns {boolean} If flag is set  
     */
    flag(flag, set=null) {
        if(set === true) {
            this.file.$header.$flags.value |= VTF_FLAGS_BIT[flag];
        } else if(set === false) {
            this.file.$header.$flags.value &= 0xFFFFFFFF ^ VTF_FLAGS_BIT[flag];
        }
        
        return (this.file.$header.flags & VTF_FLAGS_BIT[flag] != 0)
    }

    /**
     * Set sampling method
     * @param {"none"|"point"|"trilinear"|"anisotropic"} method
     */
    setSamplingMethod(method='none') {
        this.flag('POINTSAMPLE', method == 'point');
        this.flag('TRILINEAR', method == 'trilinear');
        this.flag('ANISOTROPIC', method == 'anisotropic');
    }

    updateHeader() {
        this.file.$header.numResources = this.file.$header.$resourceEntries.members.length;

        // Update the offset for each resource entry
        for(let resource of this.file.$header.$resourceEntries.members) {
            if(resource.$offsetTo) {
                resource.offset = this.file.getOffset(resource.offsetTo);
            }
        }

        // Set final padding (Header size must be 16 byte aligned)
        this.file.$header.paddingAlign = new Uint8Array(0);
        this.file.$header.paddingAlign = new Uint8Array(this.file.$header.size % 16);

        // Set header size
        this.file.$header.headerSize = this.file.$header.size;
    }



    /**
     * Removes resource
     * @param {string} resource 
     */
    removeResource(resource) {
        this.file.$header.$resourceEntries.removeMember(resource);
        this.file.removeMember(`resource_${resource}`);

        this.updateHeader();
    }



    /**
     * Add a CRC check to VTF file
     */
    resource_crc() {
        // If CRC resource entry doesn't already exist create it
        if(!this.file.$header.$resourceEntries.member(VTF.RESOURCES_TYPES.CRC)) {
            this.file.$header.$resourceEntries.addMember(new Types.Struct(VTF.RESOURCES_TYPES.CRC, [
                new Types.Uint8Array('tag', RESOURCE_TAGS.CRC),
                new Types.Uint8('flags', 0x02),
                new Types.Uint32('crcValue')
            ]));

            this.updateHeader();
        }
    }



    /**
     * Embed meta info inside of VTF file
     * @param {object} object
     */
    resource_KeyValue(object) {

        // If no object is given, remove KVD resource
        if(!object || Object.keys(object).length == 0) {
            this.removeResource(VTF.RESOURCES_TYPES.KEYVALUEDATA);
            return;
        }

        // Only 1 KVD resource can be in the file
        // Otherwise it only displays the first one for each

        // If KVD resource entry doesn't already exist create it
        if(!this.file.$header.$resourceEntries.member(VTF.RESOURCES_TYPES.KEYVALUEDATA)) {
            this.file.$header.$resourceEntries.addMember(new Types.Struct(VTF.RESOURCES_TYPES.KEYVALUEDATA, [
                new Types.Uint8Array('tag', RESOURCE_TAGS.KEYVALUEDATA),
                new Types.Uint8('flags', 0x00),
                new Types.Uint32('offset', 0),
                new Types.Identifier('offsetTo', `resource_${VTF.RESOURCES_TYPES.KEYVALUEDATA}`)
            ]));
        }

        // Set KVD resource
        this.file.removeMember(`resource_${VTF.RESOURCES_TYPES.KEYVALUEDATA}`);
        const str = $keyvalues_to(object);
        this.file.addMember(new Types.Struct(`resource_${VTF.RESOURCES_TYPES.KEYVALUEDATA}`, [
            new Types.Uint32('length', str.length),
            new Types.ASCII('string', str)
        ]));

        this.updateHeader();
    }


    get highResImageFormat() {
        return this.file.$header.highResImageFormat;
    }

    get mipmapCount() {
        return this.file.$header.mipmapCount;
    }

    get frameCount() {
        return this.file.$header.frames;
    }

    static Pos = Pos;

    /**
     * High res image data.
     * @param {number} format
     * @param {number} width
     * @param {number} height
     * @param {number} mipmaps
     * @param {number} frames
     * @returns {number} New number of mipmaps
     */
    resource_highResImageData(format=VTF_IMAGE_FORMATS.DXT1, width=512, height=512, mipmaps=1, frames=1) {
        // If highres image data resource entry doesn't already exist create it
        if(!this.file.$header.$resourceEntries.member(VTF.RESOURCES_TYPES.HIGHRES_IMAGEDATA)) {
            this.file.$header.$resourceEntries.addMember(new Types.Struct(VTF.RESOURCES_TYPES.HIGHRES_IMAGEDATA, [
                new Types.Uint8Array('tag', RESOURCE_TAGS.HIGHRES_IMAGEDATA),
                new Types.Uint8('flags', 0x00),
                new Types.Uint32('offset', 0),
                new Types.Identifier('offsetTo', `resource_${VTF.RESOURCES_TYPES.HIGHRES_IMAGEDATA}`)
            ]));
        }

        // Get highest compatable mipmap size
        for(let mip=0; mip < mipmaps; mip++) {
            const w = width / (2**mip);
            const h = height / (2**mip);
            if(w%1 != 0 || h%1 != 0 || w%4 != 0 || h%4 != 0) {
                mipmaps = mip;
                break;
            }
        }

        // Set header image data
        this.file.$header.width = width;
        this.file.$header.height = height;
        this.file.$header.frames = frames;
        this.file.$header.mipmapCount = mipmaps;
        this.file.$header.highResImageFormat = format;
        
        // Resource
        this.file.removeMember(`resource_${VTF.RESOURCES_TYPES.HIGHRES_IMAGEDATA}`);
        // Fill with empty textures
        const textures = new Array(mipmaps).fill(null).map((_0, mip) => {
            return new Array(frames).fill(null).map((_1, frame) => {
                const w = this.file.$header.width / (2**mip);
                const h = this.file.$header.height / (2**mip);
                return new VTF_Texture(format, new VTF.Pos(mip, frame), w, h);
            });
        }).reverse().flat();
        this.file.addMember(new Types.Struct(`resource_${VTF.RESOURCES_TYPES.HIGHRES_IMAGEDATA}`, textures));

        // Set flags
        this.flag('NOMIP', (this.mipmapCount == 1));
        this.flag('HINT_DXT5', (this.highResImageFormat == VTF.IMAGE_FORMATS.DXT5));
        this.flag('EIGHTBITALPHA', [
            VTF.IMAGE_FORMATS.A8,
            VTF.IMAGE_FORMATS.ABGR8888,
            VTF.IMAGE_FORMATS.ARGB8888,
            VTF.IMAGE_FORMATS.BGRA8888,
            VTF.IMAGE_FORMATS.IA88,
            VTF.IMAGE_FORMATS.RGBA8888
        ].includes(this.highResImageFormat));
        this.flag('ONEBITALPHA', [
            VTF.IMAGE_FORMATS.BGRA5551,
            VTF.IMAGE_FORMATS.DXT1,
            VTF.IMAGE_FORMATS.DXT1_ONEBITALPHA
        ].includes(this.highResImageFormat));

        this.updateHeader();

        if(textureWorker) {
            textureWorker.postMessage({
                type: 'clear'
            });
        }

        return mipmaps;
    }

    
    /**
     * Gets a texture
     * @param {Pos} pos
     * @return {VTF_Texture|null}
     */
    getTexture(pos=new Pos()) {
        return this.file[`$resource_${VTF.RESOURCES_TYPES.HIGHRES_IMAGEDATA}`][`$texture_${pos.str}`] || null;
    }

    /**
     * Sets a texture
     * @param {Pos} pos 
     * @param {Image} img 
     * @param {{lumMuls:number[], transparentLum:number, transparentColor:number[], dither:boolean, ditherAlpha:boolean, alphaThreshold:number, refineCount:number}} converterOptions 
     * @param {{smoothing: boolean, fit: "none"|"contain"|"cover"|"strech"}} imageOptions
     * @returns {VTF_Texture|null} 
     */
    setTexture(pos, img, textureOptions={}, imageOptions={}) {
        const texture = this.getTexture(pos);
        if(!texture) return null;
        texture.to(img, textureOptions, imageOptions);
        return texture;
    }

    /**
     * Sets a texture with a webworker
     * @param {Pos} pos 
     * @param {Image} image 
     * @param {{lumMuls:number[], transparentLum:number, transparentColor:number[], dither:boolean, ditherAlpha:boolean, alphaThreshold:number, refineCount:number}} converterOptions 
     * @param {{smoothing: boolean, fit: "none"|"contain"|"cover"|"strech"}} imageOptions
     * @returns {Promise<VTF_Texture|null>} 
     */
    setTextureWithWorker(pos, img, textureOptions={}, imageOptions={}) {
        // Load the webworker if not loaded already
        if(textureWorker == null) {
            textureWorker = new Worker('valveUtils/vtf_texture_worker.js', { type: 'module' });
        }

        return new Promise((resolve, reject) => {
            // Add a new texture to the queue
            const texture = this.getTexture(pos);
            if(!texture) resolve(null);

            textureWorker.postMessage({
                type: 'add',
                id: this.id,
                pos: pos,
                format: texture.format,
                textureOptions: textureOptions,
                imgData: texture.getImageData(img, imageOptions)
            });

            const recieveMessage = (ev) => {
                if(ev.data.type != 'done') return;
                if(ev.data.id != this.id) return;
                if(!pos.equals(ev.data.pos)) return;
                const texture = this.getTexture(pos);
                if(!texture) return;
                if(texture.format != ev.data.format) return;
                texture.converted = ev.data.converted;
                textureWorker.removeEventListener('message', recieveMessage);
                resolve(texture);
            }

            textureWorker.addEventListener('message', recieveMessage);
        });
    }

    /**
     * Low res image data.
     * 
     * @param {ImageData} img
     * @param {{lumMuls:number[], transparentLum:number, transparentColor:number[], dither:boolean, ditherAlpha:boolean, alphaThreshold:number, refineCount:number}} converterOptions 
     * @param {{smoothing: boolean, fit: "none"|"contain"|"cover"|"strech"}} imageOptions
     * @returns {Uint8Array} texture data
     */
    resource_lowResImageData(img, converterOptions={}, imageOptions={}) {
        // If lowres image data resource entry doesn't already exist create it
        if(!this.file.$header.$resourceEntries.member(VTF.RESOURCES_TYPES.LOWRES_IMAGEDATA)) {
            this.file.$header.$resourceEntries.addMember(new Types.Struct(VTF.RESOURCES_TYPES.LOWRES_IMAGEDATA, [
                new Types.Uint8Array('tag', RESOURCE_TAGS.LOWRES_IMAGEDATA),
                new Types.Uint8('flags', 0x00),
                new Types.Uint32('offset', 0),
                new Types.Identifier('offsetTo', `resource_${VTF.RESOURCES_TYPES.LOWRES_IMAGEDATA}`)
            ]));
        }

        // Set header image data
        this.file.$header.lowResImageWidth = 16;
        this.file.$header.lowResImageHeight = 16;
        this.file.$header.lowResImageFormat = VTF.IMAGE_FORMATS.DXT1;

        // Texture
        const texture = new VTF_Texture(VTF.IMAGE_FORMATS.DXT1, new Pos(), 16, 16);
        texture.to(img, converterOptions, imageOptions);
        const data = texture.bytes;

        // Resource
        this.file.removeMember(`resource_${VTF.RESOURCES_TYPES.LOWRES_IMAGEDATA}`);
        this.file.addMember(new Types.Uint8Array(`resource_${VTF.RESOURCES_TYPES.LOWRES_IMAGEDATA}`, data));
        
        this.updateHeader();

        return data;
    }
    




    get size() { return this.file.size; }
    final() {
        this.updateHeader();

        // Calculate the CRC
        if(this.file.$header.$resourceEntries[`$${VTF.RESOURCES_TYPES.CRC}`]) {
            const crcValue = crc32(this.file.bytes.slice(this.file.$header.size));
            this.file.$header.$resourceEntries[`$${VTF.RESOURCES_TYPES.CRC}`].crcValue = crcValue;
        }
    }
    get bytes() {
        this.final();
        return this.file.bytes;
    }
    get url() {
        this.final();
        return this.file.url;
    }



    /**
     * Load VTF from data
     * @param {ArrayLike} data 
     */
    load(data) {
        if(data.buffer) data = new Uint8Array(data.buffer);
        else data = new Uint8Array(data);
        
        const interpret_file = (struct, bytes, offset, member, prevMember) => {
            if(member.name == 'header') {
                member.setBytes(bytes, interpret_header, false);
            }

            // TODO: Pad resources (If each resource doesn't take up all the space, pad so it doesn't all break.)
            if(member.name.startsWith('resource')) {
                const resource_name = /resource_(.+)/.exec(member.name)[1];

                switch(resource_name) {
                    case RESOURCES.HIGHRES_IMAGEDATA: {
                        const frames = struct.$header.frames;
                        const mipmaps = struct.$header.mipmapCount;
                        for(let mip=0; mip < mipmaps; mip++) {
                            for(let frame=0; frame < frames; frame++) {
                                const texture = new VTF_Texture(
                                    struct.$header.highResImageFormat,
                                    mip, frame,
                                    struct.$header.width / (2**mip),
                                    struct.$header.height / (2**mip)
                                );
                                texture.converted = bytes.slice(offset, offset+texture.size);
                                offset += texture.size;
                                member.addMember(texture);
                            }
                        }
                        return member.size; }
                    case RESOURCES.KEYVALUEDATA:
                        member.addMember(new Types.Uint32('length'));
                        member.$length.bytes = bytes.slice(offset, offset+4);
                        member.addMember(new Types.ASCII('string'));
                        member.$string.bytes = bytes.slice(offset+4, offset+4+member.length);
                        return member.length+4;
                }
                
            }

            return -1;
        }

        const interpret_header = (struct, bytes, offset, member, prevMember) => {
            // Version has already been set to 7.4 so use previous member that has been set to check.
            if(prevMember?.name == 'version') {
                if(prevMember.value[0] != 7 || prevMember.value[1] != 4) {
                    console.warn(`WARNING: Loaded VTF version isn't supported, May parse incorrectly! expected: 7.4 got: ${prevMember.value[0]}.${prevMember.value[1]}`)
                }
            }

            if(member.name == 'resourceEntries') {
                const numResources = struct.numResources;
                for(let i=0; i < numResources; i++) {

                    const tagBytes = bytes.slice(offset+i*8, offset+i*8+3);
                    const tag = RESOURCES[(tagBytes[0] << 16) | (tagBytes[1] << 8) | tagBytes[2]];

                    const flags = bytes[offset+i*8+3];

                    const value = new Types.Uint32((tag != RESOURCES.CRC ? 'offset' : 'crcValue'));
                    value.bytes = bytes.slice(offset+i*8+4, offset+i*8+8);

                    const resource = new Types.Struct(tag, [
                        new Types.Uint8Array('tag', tagBytes),
                        new Types.Uint8('flags', flags),
                        value
                    ]);

                    member.addMember(resource);

                    if(flags & 0x02) continue;

                    this.file.addMember(new Types.Struct(`resource_${tag}`, []));
                }
                return 8 * numResources;
            }

            if(member.name == 'paddingAlign') {
                member.value = new Uint8Array(struct.headerSize - struct.size);
                return member.size;
            }
        
            return -1;
        }

        this.file.setBytes(data, interpret_file, false);


        
        // Check if CRC value is correct
        const resource_crc = this.file.$header.$resourceEntries[`$${RESOURCES.CRC}`];
        if(resource_crc) {
            const crcValue = crc32(this.file.bytes.slice(this.file.$header.size));
            if(resource_crc.crcValue != crcValue) {
                console.warn(`WARNING: Loaded VTF file doesn't have correct CRC! expected: 0x${crcValue.toString(16).padEnd(8, '0').toUpperCase()} got: 0x${resource_crc.crcValue.toString(16).padEnd(8, '0').toUpperCase()}`)
            }
        }

    }
}


export { VTF };
