
/*

    Converted
        https://github.com/nothings/stb/blob/master/stb_dxt.h
    to JavaScript

    (Removed constant color checks)



    (I think the refining process may be wrong it seems to lower the overall quality of the image.)

*/

const stb__OMatch5 = [
    [  0,  0 ], [  0,  0 ], [  0,  1 ], [  0,  1 ], [  1,  0 ], [  1,  0 ], [  1,  0 ], [  1,  1 ],
    [  1,  1 ], [  1,  1 ], [  1,  2 ], [  0,  4 ], [  2,  1 ], [  2,  1 ], [  2,  1 ], [  2,  2 ],
    [  2,  2 ], [  2,  2 ], [  2,  3 ], [  1,  5 ], [  3,  2 ], [  3,  2 ], [  4,  0 ], [  3,  3 ],
    [  3,  3 ], [  3,  3 ], [  3,  4 ], [  3,  4 ], [  3,  4 ], [  3,  5 ], [  4,  3 ], [  4,  3 ],
    [  5,  2 ], [  4,  4 ], [  4,  4 ], [  4,  5 ], [  4,  5 ], [  5,  4 ], [  5,  4 ], [  5,  4 ],
    [  6,  3 ], [  5,  5 ], [  5,  5 ], [  5,  6 ], [  4,  8 ], [  6,  5 ], [  6,  5 ], [  6,  5 ],
    [  6,  6 ], [  6,  6 ], [  6,  6 ], [  6,  7 ], [  5,  9 ], [  7,  6 ], [  7,  6 ], [  8,  4 ],
    [  7,  7 ], [  7,  7 ], [  7,  7 ], [  7,  8 ], [  7,  8 ], [  7,  8 ], [  7,  9 ], [  8,  7 ],
    [  8,  7 ], [  9,  6 ], [  8,  8 ], [  8,  8 ], [  8,  9 ], [  8,  9 ], [  9,  8 ], [  9,  8 ],
    [  9,  8 ], [ 10,  7 ], [  9,  9 ], [  9,  9 ], [  9, 10 ], [  8, 12 ], [ 10,  9 ], [ 10,  9 ],
    [ 10,  9 ], [ 10, 10 ], [ 10, 10 ], [ 10, 10 ], [ 10, 11 ], [  9, 13 ], [ 11, 10 ], [ 11, 10 ],
    [ 12,  8 ], [ 11, 11 ], [ 11, 11 ], [ 11, 11 ], [ 11, 12 ], [ 11, 12 ], [ 11, 12 ], [ 11, 13 ],
    [ 12, 11 ], [ 12, 11 ], [ 13, 10 ], [ 12, 12 ], [ 12, 12 ], [ 12, 13 ], [ 12, 13 ], [ 13, 12 ],
    [ 13, 12 ], [ 13, 12 ], [ 14, 11 ], [ 13, 13 ], [ 13, 13 ], [ 13, 14 ], [ 12, 16 ], [ 14, 13 ],
    [ 14, 13 ], [ 14, 13 ], [ 14, 14 ], [ 14, 14 ], [ 14, 14 ], [ 14, 15 ], [ 13, 17 ], [ 15, 14 ],
    [ 15, 14 ], [ 16, 12 ], [ 15, 15 ], [ 15, 15 ], [ 15, 15 ], [ 15, 16 ], [ 15, 16 ], [ 15, 16 ],
    [ 15, 17 ], [ 16, 15 ], [ 16, 15 ], [ 17, 14 ], [ 16, 16 ], [ 16, 16 ], [ 16, 17 ], [ 16, 17 ],
    [ 17, 16 ], [ 17, 16 ], [ 17, 16 ], [ 18, 15 ], [ 17, 17 ], [ 17, 17 ], [ 17, 18 ], [ 16, 20 ],
    [ 18, 17 ], [ 18, 17 ], [ 18, 17 ], [ 18, 18 ], [ 18, 18 ], [ 18, 18 ], [ 18, 19 ], [ 17, 21 ],
    [ 19, 18 ], [ 19, 18 ], [ 20, 16 ], [ 19, 19 ], [ 19, 19 ], [ 19, 19 ], [ 19, 20 ], [ 19, 20 ],
    [ 19, 20 ], [ 19, 21 ], [ 20, 19 ], [ 20, 19 ], [ 21, 18 ], [ 20, 20 ], [ 20, 20 ], [ 20, 21 ],
    [ 20, 21 ], [ 21, 20 ], [ 21, 20 ], [ 21, 20 ], [ 22, 19 ], [ 21, 21 ], [ 21, 21 ], [ 21, 22 ],
    [ 20, 24 ], [ 22, 21 ], [ 22, 21 ], [ 22, 21 ], [ 22, 22 ], [ 22, 22 ], [ 22, 22 ], [ 22, 23 ],
    [ 21, 25 ], [ 23, 22 ], [ 23, 22 ], [ 24, 20 ], [ 23, 23 ], [ 23, 23 ], [ 23, 23 ], [ 23, 24 ],
    [ 23, 24 ], [ 23, 24 ], [ 23, 25 ], [ 24, 23 ], [ 24, 23 ], [ 25, 22 ], [ 24, 24 ], [ 24, 24 ],
    [ 24, 25 ], [ 24, 25 ], [ 25, 24 ], [ 25, 24 ], [ 25, 24 ], [ 26, 23 ], [ 25, 25 ], [ 25, 25 ],
    [ 25, 26 ], [ 24, 28 ], [ 26, 25 ], [ 26, 25 ], [ 26, 25 ], [ 26, 26 ], [ 26, 26 ], [ 26, 26 ],
    [ 26, 27 ], [ 25, 29 ], [ 27, 26 ], [ 27, 26 ], [ 28, 24 ], [ 27, 27 ], [ 27, 27 ], [ 27, 27 ],
    [ 27, 28 ], [ 27, 28 ], [ 27, 28 ], [ 27, 29 ], [ 28, 27 ], [ 28, 27 ], [ 29, 26 ], [ 28, 28 ],
    [ 28, 28 ], [ 28, 29 ], [ 28, 29 ], [ 29, 28 ], [ 29, 28 ], [ 29, 28 ], [ 30, 27 ], [ 29, 29 ],
    [ 29, 29 ], [ 29, 30 ], [ 29, 30 ], [ 30, 29 ], [ 30, 29 ], [ 30, 29 ], [ 30, 30 ], [ 30, 30 ],
    [ 30, 30 ], [ 30, 31 ], [ 30, 31 ], [ 31, 30 ], [ 31, 30 ], [ 31, 30 ], [ 31, 31 ], [ 31, 31 ]
];
const stb__OMatch6 = [
    [  0,  0 ], [  0,  1 ], [  1,  0 ], [  1,  1 ], [  1,  1 ], [  1,  2 ], [  2,  1 ], [  2,  2 ],
    [  2,  2 ], [  2,  3 ], [  3,  2 ], [  3,  3 ], [  3,  3 ], [  3,  4 ], [  4,  3 ], [  4,  4 ],
    [  4,  4 ], [  4,  5 ], [  5,  4 ], [  5,  5 ], [  5,  5 ], [  5,  6 ], [  6,  5 ], [  6,  6 ],
    [  6,  6 ], [  6,  7 ], [  7,  6 ], [  7,  7 ], [  7,  7 ], [  7,  8 ], [  8,  7 ], [  8,  8 ],
    [  8,  8 ], [  8,  9 ], [  9,  8 ], [  9,  9 ], [  9,  9 ], [  9, 10 ], [ 10,  9 ], [ 10, 10 ],
    [ 10, 10 ], [ 10, 11 ], [ 11, 10 ], [  8, 16 ], [ 11, 11 ], [ 11, 12 ], [ 12, 11 ], [  9, 17 ],
    [ 12, 12 ], [ 12, 13 ], [ 13, 12 ], [ 11, 16 ], [ 13, 13 ], [ 13, 14 ], [ 14, 13 ], [ 12, 17 ],
    [ 14, 14 ], [ 14, 15 ], [ 15, 14 ], [ 14, 16 ], [ 15, 15 ], [ 15, 16 ], [ 16, 14 ], [ 16, 15 ],
    [ 17, 14 ], [ 16, 16 ], [ 16, 17 ], [ 17, 16 ], [ 18, 15 ], [ 17, 17 ], [ 17, 18 ], [ 18, 17 ],
    [ 20, 14 ], [ 18, 18 ], [ 18, 19 ], [ 19, 18 ], [ 21, 15 ], [ 19, 19 ], [ 19, 20 ], [ 20, 19 ],
    [ 20, 20 ], [ 20, 20 ], [ 20, 21 ], [ 21, 20 ], [ 21, 21 ], [ 21, 21 ], [ 21, 22 ], [ 22, 21 ],
    [ 22, 22 ], [ 22, 22 ], [ 22, 23 ], [ 23, 22 ], [ 23, 23 ], [ 23, 23 ], [ 23, 24 ], [ 24, 23 ],
    [ 24, 24 ], [ 24, 24 ], [ 24, 25 ], [ 25, 24 ], [ 25, 25 ], [ 25, 25 ], [ 25, 26 ], [ 26, 25 ],
    [ 26, 26 ], [ 26, 26 ], [ 26, 27 ], [ 27, 26 ], [ 24, 32 ], [ 27, 27 ], [ 27, 28 ], [ 28, 27 ],
    [ 25, 33 ], [ 28, 28 ], [ 28, 29 ], [ 29, 28 ], [ 27, 32 ], [ 29, 29 ], [ 29, 30 ], [ 30, 29 ],
    [ 28, 33 ], [ 30, 30 ], [ 30, 31 ], [ 31, 30 ], [ 30, 32 ], [ 31, 31 ], [ 31, 32 ], [ 32, 30 ],
    [ 32, 31 ], [ 33, 30 ], [ 32, 32 ], [ 32, 33 ], [ 33, 32 ], [ 34, 31 ], [ 33, 33 ], [ 33, 34 ],
    [ 34, 33 ], [ 36, 30 ], [ 34, 34 ], [ 34, 35 ], [ 35, 34 ], [ 37, 31 ], [ 35, 35 ], [ 35, 36 ],
    [ 36, 35 ], [ 36, 36 ], [ 36, 36 ], [ 36, 37 ], [ 37, 36 ], [ 37, 37 ], [ 37, 37 ], [ 37, 38 ],
    [ 38, 37 ], [ 38, 38 ], [ 38, 38 ], [ 38, 39 ], [ 39, 38 ], [ 39, 39 ], [ 39, 39 ], [ 39, 40 ],
    [ 40, 39 ], [ 40, 40 ], [ 40, 40 ], [ 40, 41 ], [ 41, 40 ], [ 41, 41 ], [ 41, 41 ], [ 41, 42 ],
    [ 42, 41 ], [ 42, 42 ], [ 42, 42 ], [ 42, 43 ], [ 43, 42 ], [ 40, 48 ], [ 43, 43 ], [ 43, 44 ],
    [ 44, 43 ], [ 41, 49 ], [ 44, 44 ], [ 44, 45 ], [ 45, 44 ], [ 43, 48 ], [ 45, 45 ], [ 45, 46 ],
    [ 46, 45 ], [ 44, 49 ], [ 46, 46 ], [ 46, 47 ], [ 47, 46 ], [ 46, 48 ], [ 47, 47 ], [ 47, 48 ],
    [ 48, 46 ], [ 48, 47 ], [ 49, 46 ], [ 48, 48 ], [ 48, 49 ], [ 49, 48 ], [ 50, 47 ], [ 49, 49 ],
    [ 49, 50 ], [ 50, 49 ], [ 52, 46 ], [ 50, 50 ], [ 50, 51 ], [ 51, 50 ], [ 53, 47 ], [ 51, 51 ],
    [ 51, 52 ], [ 52, 51 ], [ 52, 52 ], [ 52, 52 ], [ 52, 53 ], [ 53, 52 ], [ 53, 53 ], [ 53, 53 ],
    [ 53, 54 ], [ 54, 53 ], [ 54, 54 ], [ 54, 54 ], [ 54, 55 ], [ 55, 54 ], [ 55, 55 ], [ 55, 55 ],
    [ 55, 56 ], [ 56, 55 ], [ 56, 56 ], [ 56, 56 ], [ 56, 57 ], [ 57, 56 ], [ 57, 57 ], [ 57, 57 ],
    [ 57, 58 ], [ 58, 57 ], [ 58, 58 ], [ 58, 58 ], [ 58, 59 ], [ 59, 58 ], [ 59, 59 ], [ 59, 59 ],
    [ 59, 60 ], [ 60, 59 ], [ 60, 60 ], [ 60, 60 ], [ 60, 61 ], [ 61, 60 ], [ 61, 61 ], [ 61, 61 ],
    [ 61, 62 ], [ 62, 61 ], [ 62, 62 ], [ 62, 62 ], [ 62, 63 ], [ 63, 62 ], [ 63, 63 ], [ 63, 63 ]
];

function stb__Mul8Bit(a, b) {
    const t = a*b + 128;
    return (t + (t >> 8)) >> 8;
}

function stb__From16Bit(v) {
    return [
        (((v & 0xf800) >> 11) * 33) >> 2,
        (((v & 0x07e0) >> 5) * 65) >> 4,
        (((v & 0x001f) >> 0) * 33) >> 2,
        0
    ];
}

function stb__As16Bit(r, g, b) {
   return (stb__Mul8Bit(r, 31) << 11) + (stb__Mul8Bit(g, 63) << 5) + stb__Mul8Bit(b, 31);
}

// linear interpolation at 1/3 point between a and b, using desired rounding type
function stb__Lerp13(a, b) {
   // with rounding bias
   return a + stb__Mul8Bit(b-a, 0x55);

//    // without rounding bias
//    // replace "/ 3" by "* 0xaaab) >> 17" if your compiler sucks or you really need every ounce of speed.
//    return (2*a + b) / 3;
}

// lerp RGB color
function stb__Lerp13RGB(p1, p2) {
    return [
        stb__Lerp13(p1[0], p2[0]),
        stb__Lerp13(p1[1], p2[1]),
        stb__Lerp13(p1[2], p2[2])
    ];
}

/****************************************************************************/

// Color table for the block
function stb__EvalColors(c0, c1) {
    const v0 = stb__From16Bit(c0);
    const v1 = stb__From16Bit(c1);
    const v2 = stb__Lerp13RGB(v0, v1);
    const v3 = stb__Lerp13RGB(v1, v2);
    return [
        v0[0], v0[1], v0[2], 0,
        v1[0], v1[1], v1[2], 0,
        v2[0], v2[1], v2[2], 0,
        v3[0], v3[1], v3[2], 0,
    ];
}

// The color matching function
function stb__MatchColorsBlock(block, color) {
    let dirr = color[0*4+0] - color[1*4+0];
    let dirg = color[0*4+1] - color[1*4+1];
    let dirb = color[0*4+2] - color[1*4+2];
    let dots = new Int32Array(16);
    let stops = new Int32Array(4);
    let c0Point, halfPoint, c3Point;

    for(let i=0; i < 16; i++) {
        dots[i] = block[i*4+0]*dirr + block[i*4+1]*dirg + block[i*4+2]*dirb;
    }

    for(let i=0; i < 4; i++) {
        stops[i] = color[i*4+0]*dirr + color[i*4+1]*dirg + color[i*4+2]*dirb;
    }

    // think of the colors as arranged on a line; project point onto that line, then choose
    // next color out of available ones. we compute the crossover points for "best color in top
    // half"/"best in bottom half" and then the same inside that subinterval.
    //
    // relying on this 1d approximation isn't always optimal in terms of euclidean distance,
    // but it's very close and a lot faster.
    // http://cbloomrants.blogspot.com/2008/12/12-08-08-dxtc-summary.html

    c0Point   = (stops[1] + stops[3]);
    halfPoint = (stops[3] + stops[2]);
    c3Point   = (stops[2] + stops[0]);


    
    let mask = 0;

    for(let i=15; i >= 0; i--) {
        const dot = dots[i]*2;
        mask <<= 2;

        if(dot < halfPoint) {
            mask |= (dot < c0Point) ? 0 : 2;
        } else {
            mask |= (dot < c3Point) ? 3 : 1;
        }
    }

    return mask;
}

// The color optimization function. (Clever code, part 1)
function stb__OptimizeColorsBlock(block) {
    let v_r, v_g, v_b;
    const nIterPower = 4;

    // determine color distribution
    let mu = new Int32Array(3); // avg
    let min = new Int32Array(3); // min
    let max = new Int32Array(3); // max

    for(let ch=0; ch < 3; ch++) {
        let muv = block[ch];
        let minv = muv;
        let maxv = muv;

        for(let i=0; i < 16; i++) {
            muv += block[i*4+ch];
            if(block[i*4+ch] < minv) {
                minv = block[i*4+ch];
            } else if(block[i*4+ch] > maxv) {
                maxv = block[i*4+ch];
            }
        }

        mu[ch] = (muv + 8) >> 4;
        min[ch] = minv;
        max[ch] = maxv;
    }

    let cov = new Int32Array(6);
    for(let i=0; i < 16; i++) {
        const r = block[i*4+0] - mu[0];
        const g = block[i*4+1] - mu[1];
        const b = block[i*4+2] - mu[2];

        cov[0] += r*r;
        cov[1] += r*g;
        cov[2] += r*b;
        cov[3] += g*g;
        cov[4] += g*b;
        cov[5] += b*b;
    }

    // convert covariance matrix to float, find principal axis via power iter
    let covf = new Float32Array(6);
    for(let i=0; i < 6; i++) {
        covf[i] = cov[i] / 255;
    }

    let vfr = (max[0] - min[0]);
    let vfg = (max[1] - min[1]);
    let vfb = (max[2] - min[2]);

    for(let iter=0; iter < nIterPower; iter++) {
        const r = vfr*covf[0] + vfg*covf[1] + vfb*covf[2];
        const g = vfr*covf[1] + vfg*covf[3] + vfb*covf[4];
        const b = vfr*covf[2] + vfg*covf[4] + vfb*covf[5];

        vfr = r;
        vfg = g;
        vfb = b;
    }

    let magn = Math.abs(vfr);
    if(Math.abs(vfg) > magn) magn = Math.abs(vfg);
    if(Math.abs(vfb) > magn) magn = Math.abs(vfb);

    if(magn < 4) { // too small, default to luminance
        v_r = 299; // JPEG YCbCr luma coefs, scaled by 1000.
        v_g = 587;
        v_b = 114;
    } else {
        magn = 512.0 / magn;
        v_r = Math.floor(vfr * magn);
        v_g = Math.floor(vfg * magn);
        v_b = Math.floor(vfb * magn);
    }

    let minp = 0;
    let maxp = 0;
    let mind = block[0]*v_r + block[1]*v_g + block[2]*v_b;
    let maxd = mind;
    // Pick colors at extreme points
    for(let i=1; i < 16; i++) {
        const dot = block[i*4+0]*v_r + block[i*4+1]*v_g + block[i*4+2]*v_b;

        if(dot < mind) {
            mind = dot;
            minp = i;
        }
        if(dot > maxd) {
            maxd = dot;
            maxp = i;
        }
    }

    return {
        pmax16: stb__As16Bit(block[maxp*4+0], block[maxp*4+1], block[maxp*4+2]),
        pmin16: stb__As16Bit(block[minp*4+0], block[minp*4+1], block[minp*4+2])
    }
}

const stb__midpoints5 = new Float32Array([
   0.015686, 0.047059, 0.078431, 0.111765, 0.145098, 0.176471, 0.207843, 0.241176, 0.274510, 0.305882, 0.337255, 0.370588, 0.403922, 0.435294, 0.466667, 0.5,
   0.533333, 0.564706, 0.596078, 0.629412, 0.662745, 0.694118, 0.725490, 0.758824, 0.792157, 0.823529, 0.854902, 0.888235, 0.921569, 0.952941, 0.984314, 1.0
]);

const stb__midpoints6 = new Float32Array([
   0.007843, 0.023529, 0.039216, 0.054902, 0.070588, 0.086275, 0.101961, 0.117647, 0.133333, 0.149020, 0.164706, 0.180392, 0.196078, 0.211765, 0.227451, 0.245098,
   0.262745, 0.278431, 0.294118, 0.309804, 0.325490, 0.341176, 0.356863, 0.372549, 0.388235, 0.403922, 0.419608, 0.435294, 0.450980, 0.466667, 0.482353, 0.500000,
   0.517647, 0.533333, 0.549020, 0.564706, 0.580392, 0.596078, 0.611765, 0.627451, 0.643137, 0.658824, 0.674510, 0.690196, 0.705882, 0.721569, 0.737255, 0.754902,
   0.772549, 0.788235, 0.803922, 0.819608, 0.835294, 0.850980, 0.866667, 0.882353, 0.898039, 0.913725, 0.929412, 0.945098, 0.960784, 0.976471, 0.992157, 1.0
]);

function stb__Quantize5(x) {
   x = x < 0 ? 0 : x > 1 ? 1 : x;  // saturate
   let q = Math.floor(x * 31);
   q += (x > stb__midpoints5[q]);
   return q;
}

function stb__Quantize6(x) {
   x = x < 0 ? 0 : x > 1 ? 1 : x;  // saturate
   let q = Math.floor(x * 63);
   q += (x > stb__midpoints6[q]);
   return q;
}

// The refinement function. (Clever code, part 2)
// Tries to optimize colors to suit block contents better.
// (By solving a least squares system via normal equations+Cramer's rule)
function stb__RefineBlock(block, pmax16, pmin16, mask) {
    const w1Tab = [ 3, 0, 2, 1 ];
    const prods = [ 0x090000, 0x000900, 0x040102, 0x010402 ];
    // ^some magic to save a lot of multiplies in the accumulating loop...
    // (precomputed products of weights for least squares system, accumulated inside one 32-bit register)

    let max16, min16;
    
    if((mask ^ (mask << 2)) < 4) { // All pixels have the same index?
        // yes, linear system would be singular; solve using optimal
        // single-color match on average color
        let r = 8; let g = 8; let b = 8;
        for(let i=0; i < 16; i++) {
            r += block[i*4+0];
            g += block[i*4+1];
            b += block[i*4+2];
        }
        r >>= 4; g >>= 4; b >>= 4;

        max16 = (stb__OMatch5[r][0]<<11) | (stb__OMatch6[g][0]<<5) | stb__OMatch5[b][0];
        min16 = (stb__OMatch5[r][1]<<11) | (stb__OMatch6[g][1]<<5) | stb__OMatch5[b][1];
    } else {
        let akku = 0;

        let At1_r = 0; let At1_g = 0; let At1_b = 0;
        let At2_r = 0; let At2_g = 0; let At2_b = 0;
        for(let i=0; i < 16; i++) {
            let step = (mask >> (i*2)) & 3;
            let w1 = w1Tab[step];
            let r = block[i*4+0];
            let g = block[i*4+1];
            let b = block[i*4+2];

            akku += prods[step];
            At1_r += w1*r;
            At1_g += w1*g;
            At1_b += w1*b;
            At2_r += r;
            At2_g += g;
            At2_b += b;
        }

        At2_r = 3*At2_r - At1_r;
        At2_g = 3*At2_g - At1_g;
        At2_b = 3*At2_b - At1_b;

        // extract solutions and decide solvability
        let xx = (akku >> 16);
        let yy = (akku >> 8) & 0xFF;
        let xy = (akku >> 0) & 0xFF;

        let f = 3.0 / 255.0 / (xx*yy - xy*xy);

        max16 = stb__Quantize5((At1_r*yy - At2_r*xy) * f) << 11
                | stb__Quantize6((At1_g*yy - At2_g*xy) * f) << 5
                | stb__Quantize5((At1_b*yy - At2_b*xy) * f) << 0;

        min16 = stb__Quantize5((At2_r*xx - At1_r*xy) * f) << 11
                | stb__Quantize6((At2_g*xx - At1_g*xy) * f) << 5
                | stb__Quantize5((At2_b*xx - At1_b*xy) * f) << 0;
    }

    return {
        pmax16: max16,
        pmin16: min16,
        same: (pmin16 != min16 || pmax16 != max16)
    }
}

// Color block compression
function stb__CompressColorBlock(block, refinecount=1) {
    let mask;
    let max16, min16;

    // first step: PCA+map along principal axis
    const optVal = stb__OptimizeColorsBlock(block);
    max16 = optVal.pmax16;
    min16 = optVal.pmin16;

    mask = stb__MatchColorsBlock(block, stb__EvalColors(min16, max16));

    // third step: refine (multiple times if requested)
    for (let i=0; i < refinecount; i++) {
        let lastmask = mask;

        const refVal = stb__RefineBlock(block, max16, min16, mask);
        max16 = refVal.pmax16;
        min16 = refVal.pmin16;
        if (refVal.same) {
            if (max16 != min16) {
                mask = stb__MatchColorsBlock(block, stb__EvalColors(min16, max16));
            } else {
                mask = 0;
                break;
            }
        }

        if(mask == lastmask) break;
    }

    // write the color block
    if(max16 < min16) {
        let t = min16;
        min16 = max16;
        max16 = t;
        mask ^= 0x55555555;
    }

    return new Uint8Array([
        max16,
        max16 >> 8,
        min16,
        min16 >> 8,
        mask,
        mask >> 8,
        mask >> 16,
        mask >> 24
    ]);
}



export { stb__CompressColorBlock as dxt1_compress_block };
