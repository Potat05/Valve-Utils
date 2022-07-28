
/*

    Here's an algorithm I made to compress to DXT1 format
    (It's super bad and broken.)

*/

import { lerp13rgb, RGBA8888_to_RGB565 } from "./useful.js";



function distance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2);
}

function distFromLine(px, py, pz, lx1, ly1, lz1, lx2, ly2, lz2) {
    const lineLen = distance(lx1, ly1, lz1, lx2, ly2, lz2);
    const t = ((px - lx1) * (lx2 - lx1) + (py - ly1) * (ly2 - ly1) + (pz - lz1) * (lz2 - lz1)) / lineLen;
    return distance(px, py, pz, lx1+t*(lx2-lx1), ly1+t*(ly2-ly1), lz1+t*(lz2-lz1));
}

/**
 * Find best line for colors
 * @param {Uint8Array} colors - RGBA data
 * @param {number} throwAwayDist - Distance from point to line to throw away and recalculate
 * @param {number} leastActive - Least amount active colors till it stops
 */
function findLineFromBlock(block, throwAwayDist=50, leastActive=8) {

    let active = new Array(16).fill(true);

    while(true) {

        // Get average
        let avg_x = 0; let avg_y = 0; let avg_z = 0;
        for(let i=0; i < 16; i++) {
            avg_x += block[i*4];
            avg_y += block[i*4+1];
            avg_z += block[i*4+2];
        }
        avg_x /= 16; avg_y /= 16; avg_z /= 16;

        // Get dir
        let dir_x = 0; let dir_y = 0; let dir_z = 0;
        for(let i=0; i < 16; i++) {
            const tx = block[i*4] - avg_x;
            dir_x += tx * tx;
            dir_y += tx * (block[i*4+1] - avg_y);
            dir_z += tx * (block[i*4+2] - avg_z);
        }
        const dir_len = Math.sqrt(dir_x**2 + dir_y**2 + dir_z**2);
        dir_x /= dir_len; dir_y /= dir_len; dir_z /= dir_len;

        let recalc = false;

        // Remove worst point thats outside distance
        let activeCount = 0;
        for(let i=0; i < 16; i++) {
            activeCount += active[i];
        }
        if(activeCount > leastActive) {
            for(let i=0; i < 16; i++) {
                if(!active[i]) continue;

                if(distFromLine(block[i*4], block[i*4+1], block[i*4+2], avg_x, avg_y, avg_z, dir_x, dir_y, dir_z) >= throwAwayDist) {
                    active[i] = false;
                    recalc = true;
                    break;
                }
            }
        }

        // Get colors used for line
        const colors = new Uint8Array(activeCount * 4);
        let j = 0;
        for(let i=0; i < 16; i++) {
            if(!active[i]) continue;

            colors[j*4] = block[i*4];
            colors[j*4+1] = block[i*4+1];
            colors[j*4+2] = block[i*4+2];
            j++;
        }

        return {
            pos: [avg_x, avg_y, avg_z],
            dir: [dir_x, dir_y, dir_z],
            colors: colors,
            actives: active,
            activeCount: activeCount
        }

    }

}


/**
 * Compress a RGBA8888 block to DXT1 block
 * @param {Uint8Array} block 
 */
function dxt1_compress_block(block) {

    const bestLine = findLineFromBlock(block);

    // Get colors
    let c1;
    for(let i=bestLine.activeCount-1; i >= 0; i--) {
        if(bestLine.actives[i]) {
            c1 = [
                bestLine.colors[i*4],
                bestLine.colors[i*4+1],
                bestLine.colors[i*4+2]
            ];
            break;
        }
    }
    let c2;
    for(let i=0; i < bestLine.activeCount; i++) {
        if(bestLine.actives[i]) {
            c2 = [
                bestLine.colors[i*4],
                bestLine.colors[i*4+1],
                bestLine.colors[i*4+2]
            ];
            break;
        }
    }
    const c3 = lerp13rgb(c1, c2);
    const c4 = lerp13rgb(c2, c1);
    const colors = [c1, c2, c3, c4];

    // Set each pixel to closest color
    let mask = 0x00000000;
    for(let i=0; i < 16; i++) {
        let closestInd = -1;
        let closestDist = Infinity;
        for(let j=1; j < 4; j++) {
            const dist = distance(block[i*4], block[i*4+1], block[i*4+2], colors[j][0], colors[j][1], colors[j][2]);
            if(dist < closestDist) {
                closestInd = j;
                closestDist = dist;
            }
        }

        // console.log(closestInd);

        mask |= (closestInd << (i*2));
    }

    const max = RGBA8888_to_RGB565(c1[0], c1[1], c1[2]);
    const min = RGBA8888_to_RGB565(c2[0], c2[1], c2[2]);

    return new Uint8Array([
        max, max >> 8,
        min, min >> 8,
        
        mask,
        mask >> 8,
        mask >> 16,
        mask >> 24
    ]);
    
}

function dxt1_compress_block_simple(block) {
    const col = RGBA8888_to_RGB565(block[0], block[1], block[2]);
    return new Uint8Array([
        col, col >> 8,
        0x00, 0x00,

        0x00,
        0x00,
        0x00,
        0x00
    ])
}

export { dxt1_compress_block, dxt1_compress_block_simple };
