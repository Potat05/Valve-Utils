
/**
 * 
 * Struct library thingy:
 *     https://github.com/Potat05/Struct
 * 
 * (Everything is in big endianness)
 * 
 * by:
 *     https://github.com/Potat05
 * 
 */



const VALUE_ACCESS = ''; // Used to access member values inside Structs: structure.memberName
const MEMBER_ACCESS = '$'; // Used to access members inside Structs: structure.$memberName



class Uint8 {
    /**
     * Uint8
     * @param {string} name Name of member
     * @param {number} value Uint8 value
     */
    constructor(name='Uint8', value=0x00) {
        this.name = name;
        this.value = value;
    }
    get size() { return 1; }
    set bytes(bytes) {
        this.value = bytes[0];
    }
    get bytes() {
        return new Uint8Array([this.value & 0xFF]);
    }
}

class Uint16 {
    /**
     * Uint16
     * @param {string} name Name of member
     * @param {number} value Uint16 value
     */
    constructor(name='Uint16', value=0x0000) {
        this.name = name;
        this.value = value;
    }
    get size() { return 2; }
    set bytes(bytes) {
        this.value = (bytes[0] | bytes[1] << 8);
    }
    get bytes() {
        return new Uint8Array([this.value & 0xFF, (this.value >> 8) & 0xFF]);
    }
}

class Uint32 {
    /**
     * Uint32
     * @param {string} name Name of member
     * @param {number} value Uint32 value
     */
    constructor(name='Uint32', value=0x00000000) {
        this.name = name;
        this.value = value;
    }
    get size() { return 4; }
    set bytes(bytes) {
        this.value = (bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24);
    }
    get bytes() {
        return new Uint8Array([this.value & 0xFF, (this.value >> 8) & 0xFF, (this.value >> 16) & 0xFF, (this.value >> 24) & 0xFF]);
    }
}

class Uint64 {
    /**
     * Uint64
     * @param {string} name Name of member
     * @param {number} value Uint64 value
     */
    constructor(name='Uint64', value=0x0000000000000000n) {
        this.name = name;
        this.value = BigInt(value);
    }
    get size() { return 8; }
    set bytes(bytes) {
        this.value = (
            BigInt(bytes[0]) | BigInt(bytes[1]) << 8n | BigInt(bytes[2]) << 16n | BigInt(bytes[3]) << 24n |
            BigInt(bytes[4]) << 32n | BigInt(bytes[5]) << 40n | BigInt(bytes[6]) << 48n | BigInt(bytes[7]) << 56n
        );
    }
    get bytes() {
        return new Uint8Array([
            Number(this.value & 0xFFn), Number((this.value >> 8n) & 0xFFn), Number((this.value >> 16n) & 0xFFn), Number((this.value >> 24n) & 0xFFn),
            Number((this.value >> 32n) & 0xFFn), Number((this.value >> 40n) & 0xFFn), Number((this.value >> 48n) & 0xFFn), Number((this.value >> 56n) & 0xFFn
        )]);
    }
}

class Float32 {
    /**
     * Float32
     * @param {string} name Name of member
     * @param {number} value Float32 value
     */
    constructor(name='Float32', value=0.0) {
        this.name = name;
        this.value = value;
    }
    get size() { return 4; }
    set bytes(bytes) {
        this.value = new Float32Array(bytes.buffer)[0];
    }
    get bytes() {
        return new Uint8Array(new Float32Array([ this.value ]).buffer);
    }
}

class Float64 {
    /**
     * Float64
     * @param {string} name Name of member
     * @param {number} value Float64 value
     */
    constructor(name='Float64', value=0.0) {
        this.name = name;
        this.value = value;
    }
    get size() { return 8; }
    set bytes(bytes) {
        this.value = new Float64Array(bytes.buffer)[0];
    }
    get bytes() {
        return new Uint8Array(new Float64Array([ this.value ]).buffer);
    }
}

class _Uint8Array {
    /**
     * Uint8Array
     * @param {string} name Name of member
     * @param {number|ArrayLike} value Length or Array
     */
    constructor(name='Uint8Array', value=[]) {
        this.name = name;
        this.value = new Uint8Array(value);
    }
    get size() { return this.value.byteLength }
    set bytes(bytes) {
        this.value = bytes;
    }
    get bytes() {
        return this.value;
    }
}

class _Uint16Array {
    /**
     * Uint16Array
     * @param {string} name Name of member
     * @param {number|ArrayLike} value Length or Array
     */
    constructor(name='Uint16Array', value=[]) {
        this.name = name;
        this.value = new Uint16Array(value);
    }
    get size() { return this.value.byteLength }
    set bytes(bytes) {
        this.value = new Uint16Array(bytes.buffer);
    }
    get bytes() {
        return new Uint8Array(this.value.buffer);
    }
}

class _Uint32Array {
    /**
     * Uint32Array
     * @param {string} name Name of member
     * @param {number|ArrayLike} value Length or Array
     */
    constructor(name='Uint32Array', value=[]) {
        this.name = name;
        this.value = new Uint32Array(value);
    }
    get size() { return this.value.byteLength }
    set bytes(bytes) {
        this.value = new Uint32Array(bytes.buffer);
    }
    get bytes() {
        return new Uint8Array(this.value.buffer);
    }
}

class _Uint64Array {
    /**
     * Uint64Array
     * @param {string} name Name of member
     * @param {number|ArrayLike} value Length or Array
     */
    constructor(name='Uint64Array', value=[]) {
        this.name = name;
        if(typeof value == 'number') {
            this.value = new BigUint64Array(value);
        } else if(Array.isArray(value)) {
            this.value = new BigUint64Array(value.map(n => BigInt(n)));
        } else {
            this.value = new BigUint64Array();
        }
    }
    get size() { return this.value.byteLength }
    set bytes(bytes) {
        this.value = new BigUint64Array(bytes.buffer);
    }
    get bytes() {
        return new Uint8Array(this.value.buffer);
    }
}

class _Float32Array {
    /**
     * Float32Array
     * @param {string} name Name of member
     * @param {number|ArrayLike} value Length or Array
     */
    constructor(name='Float32Array', value=[]) {
        this.name = name;
        this.value = new Float32Array(value); 
    }
    get size() { return this.value.byteLength }
    set bytes(bytes) {
        this.value = new Float32Array(bytes.buffer);
    }
    get bytes() {
        return new Uint8Array(this.value.buffer);
    }
}

class _Float64Array {
    /**
     * Float64Array
     * @param {string} name Name of member
     * @param {number|ArrayLike} value Length or Array
     */
    constructor(name='Float64Array', value=[]) {
        this.name = name;
        this.value = new Float64Array(value); 
    }
    get size() { return this.value.byteLength }
    set bytes(bytes) {
        this.value = new Float64Array(bytes.buffer);
    }
    get bytes() {
        return new Uint8Array(this.value.buffer);
    }
}

class ASCII {
    /**
     * ASCII (Each character is 1 byte)  
     * @param {string} name Name of member
     * @param {string} value ASCII string
     * @param {number} maxLength Max length of string
     */
    constructor(name='ASCII', value='', maxLength=Infinity) {
        this.name = name;
        this.value = value;
        this.maxLength = maxLength;
    }
    get size() { return Math.min(this.value.length, this.maxLength); }
    set bytes(bytes) {
        this.value = bytes.reduce((str, byte) => str + String.fromCharCode(byte), '');
    }
    get bytes() {
        return new Uint8Array(this.size).map((v, i) => this.value.charCodeAt(i));
    }
}

class UTF8 {
    /**
     * UTF8 (Each character is 1-6 bytes)  
     * If there's a character that wont fit it will be removed when getting bytes.  
     * @param {string} name Name of member
     * @param {string} value UTF-8 string
     * @param {number} maxLength Max length of string
     */
    constructor(name='UTF8', value='', maxLength=Infinity) {
        this.name = name;
        this.value = value;
        this.maxLength = maxLength;
    }
    get safeByteLength() {
        // UTF8 has max of 6 bytes per character.
        return Math.min(this.value.length * 6, this.maxLength);
    }
    get size() {
        return new TextEncoder().encodeInto(this.value, new Uint8Array(this.safeByteLength)).written;
    }
    set bytes(bytes) {
        this.value = new TextDecoder().decode(bytes)
    }
    get bytes() {
        const bytes = new Uint8Array(this.safeByteLength);
        const results = new TextEncoder().encodeInto(this.value, bytes);
        return bytes.slice(0, results.written);
    }
}

class Identifier {
    /**
     * WILL NOT be added to final byte array
     * @param {string} name 
     * @param {any} value 
     */
    constructor(name='Identifier', value) {
        this.name = name;
        this.value = value;
    }
    get size() { return 0; }
    set bytes(bytes) {}
    get bytes() { return new Uint8Array(0); }
}



class Struct {
    /** @type {Member[]} */
    members = [];

    /**
     * Gets member
     * @param {string} name 
     * @param {boolean} recursive Search for members inside of members.
     * @returns {Member|undefined}
     */
    member(name, recursive=false) {
        if(!recursive) {
            return this.members.find(member => member.name == name);
        }

        for(let member of this.members) {
            if(member.name == name) return member;
            if(member instanceof Struct) {
                const m = member.member(name, true);
                if(m != undefined) return m;
            }
        }
    }

    /**
     * If Member name is valid. (Can be added to struct)
     * @param {string} name 
     * @returns {number} why
     */
    isValidMemberName(name) {
        if(this.members.some(m => {
            return (
                `${VALUE_ACCESS}${m.name}` == `${VALUE_ACCESS}${name}` ||
                `${VALUE_ACCESS}${m.name}` == `${MEMBER_ACCESS}${name}` ||
                `${MEMBER_ACCESS}${m.name}` == `${VALUE_ACCESS}${name}`
            );
        })) {
            return -1;
        }

        if(['members', 'member', 'addMember', 'removeMember', 'insertMember', 'getOffset', 'size', 'setBytes', 'bytes', 'value', 'url'].includes(name)) {
            return -2;
        }

        return 1;
    }

    /**
     * Add a member to the end of the struct
     * @param {Member} member 
     * @param {boolean} front If to add to start of Struct instead of the end
     */
    addMember(member, front=false) {
        const isValid = this.isValidMemberName(member.name);
        if(isValid == -1) {
            console.error(new Error(`Cannot append member to Struct! Struct already has a member named ${member.name}!`, this, member));
            return;
        }
        if(isValid == -2) {
            console.error(new Error(`Cannot append member to Struct! Cannot use name of ${member.name}`));
            return;
        }

        if(front) {
            this.members.unshift(member);
        } else {
            this.members.push(member);
        }

        Object.defineProperty(this, `${VALUE_ACCESS}${member.name}`, {
            configurable: true,
            get: () => member.value,
            set: (value) => member.value = value
        });

        Object.defineProperty(this, `${MEMBER_ACCESS}${member.name}`, {
            configurable: true,
            get: () => member
        });
    }

    /**
     * Removes a member from name
     * @param {string} name 
     * @returns {Member} removed member
     */
    removeMember(name) {
        const member = this[`${MEMBER_ACCESS}${name}`];

        this.members = this.members.filter(member => member.name != name);

        delete this[`${VALUE_ACCESS}${name}`];
        delete this[`${MEMBER_ACCESS}${name}`];

        return member;
    }

    /**
     * Insert a member into the struct
     * @param {string|Member} member Member to move or insert
     * @param {string} insert Member to insert before or after
     * @param {boolean} after If to insert after instead of before
     * @returns {number} Index of member (-1 If can't insert)
     */
    insertMember(member, insert, after=false) {
        if(typeof member == 'string') {
            member = this[`${MEMBER_ACCESS}${member}`];
        } else {
            const isValid = this.isValidMemberName(member.name);
            if(isValid == -1) {
                console.error(new Error(`Cannot insert member to Struct! Struct already has a member named ${member.name}!`, this, member));
                return -1;
            }
            if(isValid == -2) {
                console.error(new Error(`Cannot insert member to Struct! Cannot use name of ${member.name}`));
                return -1;
            }
        }
        if(!member) return -1;

        // Find member index to remove
        const memberIndex = this.members.findIndex(m => m.name == member.name);

        // Find member to insert to
        let insertIndex = this.members.findIndex(m => m.name == insert);
        if(insertIndex == -1) return -1;
        
        if(after) insertIndex++;

        if(memberIndex != -1) this.members.splice(memberIndex, 1);
        this.members.splice(insertIndex, 0, member);

        return insertIndex;
    }

    /**
     * Gets offset of member
     * @param {string} name 
     */
    getOffset(name) {
        let offset = 0;
        for(let i in this.members) {
            if(this.members[i].name != name) {
                offset += this.members[i].size;
            } else {
                return offset;
            }
        }
        return -1;
    }


    /**
     * Size of struct
     * @type {number}
     */
    get size() {
        return this.members.reduce((size, member) => size + member.size, 0);
    }


    /**
     * Set bytes in struct
     * @param {Uint8Array} bytes 
     * @param {Function(struct: Struct, bytes: Uint8Array, offset: number, member: Member, prevMember: Member)} customInterpreter If returns -1 it will not interpret
     * @param {boolean} interpreterToChildStructs
     * @returns {boolean} If set all of struct
     */
    setBytes(bytes, customInterpreter=(struct, bytes, offset, member, prevMember) => -1, interpreterToChildStructs=false) {

        let offset = 0;
        for(let i=0; i < this.members.length; i++) {
            const member = this.members[i];

            // Custom interpreter
            const cLen = customInterpreter(this, bytes, offset, member, (i == 0 ? null : this.members[i-1]));
            if(cLen != -1) {
                offset += cLen;
                continue;
            }

            if(interpreterToChildStructs && member instanceof Struct) {
                member.setBytes(bytes.slice(offset, offset+member.size), customInterpreter, true);
            } else {
                member.bytes = bytes.slice(offset, offset+member.size);
            }
            offset += member.size;
        }
        return (offset == this.size);
    }

    set bytes(bytes) {
        this.setBytes(bytes);
    }

    /**
     * Bytes of struct
     * @type {Uint8Array}
     */
    get bytes() {
        const arr = new Uint8Array(this.size);

        let ind = 0;
        for(let i in this.members) {
            arr.set(this.members[i].bytes, ind);
            ind += this.members[i].size;
        }

        return arr;
    }



    set value(v) {
        console.error(new Error(`Cannot set value of struct! (Maybe use ${MEMBER_ACCESS}struct for member access?)`));
    }

    /** @type {Uint8Array} */
    get value() {
        return this.bytes;
    }


    /** @type {string} */
    get url() {
        const blob = new Blob([this.bytes], {
            type: 'application/octet-stream'
        });
    
        return URL.createObjectURL(blob);
    }



    /**
     * Create a Struct
     * @param {string} name
     * @param {Member[]} members
     */
    constructor(name='Struct', members=[]) {
        this.name = name;
        for(let i in members) {
            this.addMember(members[i]);
        }
    }
}


/**
 * Types that can be used in Structs
 */
class Types {
    static Uint8 = Uint8;
    static Uint16 = Uint16;
    static Uint32 = Uint32;
    static Uint64 = Uint64;
    static Float32 = Float32;
    static Float64 = Float64;
    static Uint8Array = _Uint8Array;
    static Uint16Array = _Uint16Array;
    static Uint32Array = _Uint32Array;
    static Uint64Array = _Uint64Array;
    static Float32Array = _Float32Array;
    static Float64Array = _Float64Array;
    static ASCII = ASCII;
    static UTF8 = UTF8;
    static Struct = Struct;
    static Identifier = Identifier;
}



/** @type {Uint8|Uint16|Uint32|Uint64|Float32|Float64|ASCII|UTF8|_Uint8Array|_Uint16Array|_Uint32Array|_Uint64Array|_Float32Array|_Float64Array|Struct|Identifier} */
const Member = undefined;
// ^^^ For IntelliSense (I don't know any better way to do this.)



export { Types }
