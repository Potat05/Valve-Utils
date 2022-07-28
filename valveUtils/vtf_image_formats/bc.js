
/*

    https://github.com/microsoft/DirectXTex/blob/main/DirectXTex/BC.h
    https://github.com/microsoft/DirectXTex/blob/main/DirectXTex/BC.cpp

*/


const BC_FLAGS_NONE = 0x0;
const BC_FLAGS_DITHER_RGB = 0x10000;
const BC_FLAGS_DITHER_A = 0x20000;
const BC_FLAGS_UNIFORM = 0x40000;
const BC_FLAGS_USE_3SUBSET = 0x80000;
const BC_FLAGS_FORCE_BC7_MODE6 = 0x100000;


class HDRColorA {
    constructor(r=0, g=0, b=0, a=0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    copy() {
        return new HDRColorA(this.r, this.g, this.b, this.a);
    }
}

function HDRColorALerp(pC1, pC2, s) {
    return new HDRColorA(
        pC1.r + s * (pC2.r - pC1.r),
        pC1.g + s * (pC2.g - pC1.g),
        pC1.b + s * (pC2.b - pC1.b),
        pC1.a + s * (pC2.a - pC1.a)
    );
}



function Decode565(w565) {
    return new HDRColorA(
        ((w565 >> 11) & 31) * (1.0 / 31.0),
        ((w565 >> 5) & 63) * (1.0 / 63.0),
        ((w565 >> 0) & 31) * (1.0 / 31.0),
        1
    );
}

function Encode565(pColor) {
    const r = (pColor.r < 0.0) ? 0.0 : (pColor.r > 1.0) ? 1.0 : pColor.r;
    const g = (pColor.g < 0.0) ? 0.0 : (pColor.g > 1.0) ? 1.0 : pColor.g;
    const b = (pColor.b < 0.0) ? 0.0 : (pColor.b > 1.0) ? 1.0 : pColor.b;

    return (Math.floor(r * 31.0 + 0.5) << 11)
         | (Math.floor(g * 63.0 + 0.5) << 5)
         | (Math.floor(b * 31.0 + 0.5) << 0);
}



const g_Luminance = new HDRColorA(0.2125 / 0.7154, 1.0, 0.0721 / 0.7154, 1.0);
const g_LuminanceInv = new HDRColorA(0.7154 / 0.2125, 1.0, 0.7154 / 0.0721, 1.0);



const COLOR_WEIGHTS = false;

function OptimizeRGB(pPoints, cSteps, flags) {
    const fEpsilon = (0.25 / 64.0) * (0.25 / 64.0);
    const pC3 = [ 2.0 / 2.0, 1.0 / 2.0, 0.0 / 2.0 ];
    const pD3 = [ 0.0 / 2.0, 1.0 / 2.0, 2.0 / 2.0 ];
    const pC4 = [ 3.0 / 3.0, 2.0 / 3.0, 1.0 / 3.0, 0.0 / 3.0 ];
    const pD4 = [ 0.0 / 3.0, 1.0 / 3.0, 2.0 / 3.0, 3.0 / 3.0 ];

    const pC = (3 == cSteps) ? pC3 : pC4;
    const pD = (3 == cSteps) ? pD3 : pD4;

    // Find Min and Max points, as starting point
    let X = (flags & BC_FLAGS_UNIFORM) ? new HDRColorA(1.0, 1.0, 1.0, 1.0) : g_Luminance.copy();
    let Y = new HDRColorA(0.0, 0.0, 0.0, 1.0);

    for(let iPoint = 0; iPoint < 16; iPoint++) {
        if(COLOR_WEIGHTS ? pPoints[iPoint].a > 0.0 : true) {
            if(pPoints[iPoint].r < X.r) X.r = pPoints[iPoint].r;
            if(pPoints[iPoint].g < X.g) X.g = pPoints[iPoint].g;
            if(pPoints[iPoint].b < X.b) X.b = pPoints[iPoint].b;

            if(pPoints[iPoint].r > Y.r) Y.r = pPoints[iPoint].r;
            if(pPoints[iPoint].g > Y.g) Y.g = pPoints[iPoint].g;
            if(pPoints[iPoint].b > Y.b) Y.b = pPoints[iPoint].b;
        }
    }

    // Diagonal axis
    const AB = new HDRColorA(Y.r - X.r, Y.g - X.g, Y.b - X.b, 0.0);

    const fAB = AB.r * AB.r + AB.g * AB.g + AB.b * AB.b;

    // Single color block.. no need to root-find
    if(fAB <= 0.0000001) {
        return {
            pX: new HDRColorA(X.r, X.g, X.b, 1.0),
            pY: new HDRColorA(Y.r, Y.g, Y.b, 1.0)
        }
    }

    // Try all four axis directions, to determine which diagonal best fits data
    const fABInv = 1.0 / fAB;

    let Dir = new HDRColorA(AB.r * fABInv, AB.g * fABInv, AB.b * fABInv, 0.0);

    const Mid = new HDRColorA(
        (X.r + Y.r) * 0.5,
        (X.g + Y.g) * 0.5,
        (X.b + Y.b) * 0.5,
        0.0
    );

    let fDir = new Float32Array(4);

    for(let iPoint = 0; iPoint < 16; iPoint++) {
        let Pt = new HDRColorA(
            (pPoints[iPoint].r - Mid.r) * Dir.r,
            (pPoints[iPoint].g - Mid.g) * Dir.g,
            (pPoints[iPoint].b - Mid.b) * Dir.b,
            0.0
        );

        let f;

        if(COLOR_WEIGHTS) {
            f = Pt.r + Pt.g + Pt.b;
            fDir[0] += pPoints[iPoint].a * f * f;

            f = Pt.r + Pt.g - Pt.b;
            fDir[1] += pPoints[iPoint].a * f * f;

            f = Pt.r - Pt.g + Pt.b;
            fDir[2] += pPoints[iPoint].a * f * f;

            f = Pt.r - Pt.g - Pt.b;
            fDir[3] += pPoints[iPoint].a * f * f;
        } else {
            f = Pt.r + Pt.g + Pt.b;
            fDir[0] += f * f;

            f = Pt.r + Pt.g - Pt.b;
            fDir[1] += f * f;

            f = Pt.r - Pt.g + Pt.b;
            fDir[2] += f * f;

            f = Pt.r - Pt.g - Pt.b;
            fDir[3] += f * f;
        }
    }

    let fDirMax = fDir[0];
    let iDirMax = 0;

    for(let iDir = 1; iDir < 4; iDir++) {
        if(fDir[iDir] > fDirMax) {
            fDirMax = fDir[iDir];
            iDirMax = iDir;
        }
    }

    if(iDirMax & 2) {
        const f = X.g; X.g = Y.g; Y.g = f;
    }

    if(iDirMax & 1) {
        const f = X.b; X.b = Y.b; Y.b = f;
    }


    // Two color block.. no need to root-find
    if(fAB < 1.0 / 4096.0) {
        return {
            pX: new HDRColorA(X.r, X.g, X.b, 1.0),
            pY: new HDRColorA(Y.r, Y.g, Y.b, 1.0)
        }
    }

    // Use Newton's Method to find local minima of sum-of-squares error.
    const fSteps = (cSteps - 1);

    for(let iIteration = 0; iIteration < 8; iIteration++) {
        // Calculate new steps
        let pSteps = [
            new HDRColorA(),
            new HDRColorA(),
            new HDRColorA(),
            new HDRColorA()
        ];

        for(let iStep = 0; iStep < cSteps; iStep++) {
            pSteps[iStep].r = X.r * pC[iStep] + Y.r * pD[iStep];
            pSteps[iStep].g = X.g * pC[iStep] + Y.g * pD[iStep];
            pSteps[iStep].b = X.b * pC[iStep] + Y.b * pD[iStep];
            pSteps[iStep].a = 1.0;
        }


        // Calculate color direction
        Dir.r = Y.r - X.r;
        Dir.g = Y.g - X.g;
        Dir.b = Y.b - X.b;

        const fLen = (Dir.r * Dir.r + Dir.g * Dir.g + Dir.b * Dir.b);

        if(fLen < (1.0 / 4096.0))
            break;

        const fScale = fSteps / fLen;

        Dir.r *= fScale;
        Dir.g *= fScale;
        Dir.b *= fScale;


        // Evaluate function, and derivatives
        let d2X = 0.0;
        let d2Y = 0.0;
        let dX = new HDRColorA();
        let dY = new HDRColorA();

        for(let iPoint = 0; iPoint < 16; iPoint++) {
            const fDot = (pPoints[iPoint].r - X.r) * Dir.r +
                         (pPoints[iPoint].g - X.g) * Dir.g +
                         (pPoints[iPoint].b - X.b) * Dir.b;

            let iStep = (fDot <= 0.0 ? 0 : (fDot >= fSteps ? cSteps - 1 : Math.floor(fDot + 0.5)));

            let Diff = new HDRColorA(
                pSteps[iStep].r - pPoints[iPoint].r,
                pSteps[iStep].g - pPoints[iPoint].g,
                pSteps[iStep].b - pPoints[iPoint].b,
                0.0
            );

            let fC;
            let fD;
            if(COLOR_WEIGHTS) {
                fC = pC[iStep] * pPoints[iPoint].a * (1.0 / 8.0);
                fD = pD[iStep] * pPoints[iPoint].a * (1.0 / 8.0);
            } else {
                fC = pC[iStep] * (1.0 / 8.0);
                fD = pD[iStep] * (1.0 / 8.0);
            }

            d2X += fC * pC[iStep];
            dX.r += fC * Diff.r;
            dX.g += fC * Diff.g;
            dX.b += fC * Diff.b;

            d2Y += fD * pD[iStep];
            dY.r += fD * Diff.r;
            dY.g += fD * Diff.g;
            dY.b += fD * Diff.b;
        }

        // Move endpoints
        if(d2X > 0.0) {
            const f = -1.0 / d2X;

            X.r += dX.r * f;
            X.g += dX.g * f;
            X.b += dX.b * f;
        }

        if(d2Y > 0.0) {
            const f = -1.0 / d2Y;

            Y.r += dY.r * f;
            Y.g += dY.g * f;
            Y.b += dY.b * f;
        }

        if ((dX.r * dX.r < fEpsilon) && (dX.g * dX.g < fEpsilon) && (dX.b * dX.b < fEpsilon) &&
            (dY.r * dY.r < fEpsilon) && (dY.g * dY.g < fEpsilon) && (dY.b * dY.b < fEpsilon)) {
            break;
        }
    }

    return {
        pX: new HDRColorA(X.r, X.g, X.b, 1.0),
        pY: new HDRColorA(Y.r, Y.g, Y.b, 1.0)
    }
}


class D3DX_BC1 {
    /** @type {number} */
    rgb0;
    /** @type {number} */
    rgb1;
    /** @type {number} */
    bitmap;
    constructor(rgb0, rgb1, bitmap) {
        this.rgb0 = rgb0;
        this.rgb1 = rgb1;
        this.bitmap = bitmap;
    }
}


function EncodeBC1(pColor, bColorKey, threshold, flags) {
    // Determine if we need to colorkey this block
    let uSteps;

    if(bColorKey) {
        let uColorKey = 0;

        for(let i = 0; i < 16; ++i) {
            if(pColor[i].a < threshold)
                uColorKey++;
        }
        
        if(16 == uColorKey) {
            return new D3DX_BC1(
                0x0000,
                0xFFFF,
                0xFFFFFFFF
            );
        }

        uSteps = (uColorKey > 0) ? 3 : 4;
    } else {
        uSteps = 4;
    }


    // Quantize block to R56B5, using Floyd Stienberg error diffusion.  This
    // increases the chance that colors will map directly to the quantized
    // axis endpoints.
    let Color = new Array(16);
    let Error = new Array(16);
    for(let i=0; i < 16; i++) {
        Color[i] = new HDRColorA();
        Error[i] = new HDRColorA();
    }

    for(let i = 0; i < 16; ++i) {
        let Clr = new HDRColorA(
            pColor[i].r,
            pColor[i].g,
            pColor[i].b,
            1.0
        );

        if(flags & BC_FLAGS_DITHER_RGB) {
            Clr.r += Error[i].r;
            Clr.g += Error[i].g;
            Clr.b += Error[i].b;
        }

        Color[i].r = Math.floor(Clr.r * 31.0 + 0.5) * (1.0 / 31.0);
        Color[i].g = Math.floor(Clr.g * 63.0 + 0.5) * (1.0 / 63.0);
        Color[i].b = Math.floor(Clr.b * 31.0 + 0.5) * (1.0 / 31.0);

        if(COLOR_WEIGHTS) {
            Color[i].a = pColor[i].a;
        } else {
            Color[i].a = 1.0;
        }

        if(flags & BC_FLAGS_DITHER_RGB) {
            let Diff = new HDRColorA(
                Color[i].a * (Clr.r - Color[i].r),
                Color[i].a * (Clr.g - Color[i].g),
                Color[i].a * (Clr.b - Color[i].b),
                0.0
            );

            if(3 != (i & 3)) {
                Error[i + 1].r += Diff.r * (7.0 / 16.0);
                Error[i + 1].g += Diff.g * (7.0 / 16.0);
                Error[i + 1].b += Diff.b * (7.0 / 16.0);
            }

            if(i < 12) {
                if(i & 3) {
                    Error[i + 3].r += Diff.r * (3.0 / 16.0);
                    Error[i + 3].g += Diff.g * (3.0 / 16.0);
                    Error[i + 3].b += Diff.b * (3.0 / 16.0);
                }

                Error[i + 4].r += Diff.r * (5.0 / 16.0);
                Error[i + 4].g += Diff.g * (5.0 / 16.0);
                Error[i + 4].b += Diff.b * (5.0 / 16.0);

                if (3 != (i & 3)) {
                    Error[i + 5].r += Diff.r * (1.0 / 16.0);
                    Error[i + 5].g += Diff.g * (1.0 / 16.0);
                    Error[i + 5].b += Diff.b * (1.0 / 16.0);
                }
            }
        }

        if(!(flags & BC_FLAGS_UNIFORM)) {
            Color[i].r *= g_Luminance.r;
            Color[i].g *= g_Luminance.g;
            Color[i].b *= g_Luminance.b;
        }

    }

    // Perform 6D root finding function to find two endpoints of color axis.
    // Then quantize and sort the endpoints depending on mode.
    const opt = OptimizeRGB(Color, uSteps, flags);
    let ColorA = opt.pX;
    let ColorB = opt.pY;
    let ColorC = new HDRColorA();
    let ColorD = new HDRColorA();

    if(flags & BC_FLAGS_UNIFORM) {
        ColorC = ColorA;
        ColorD = ColorB;
    } else {
        ColorC.r = ColorA.r * g_LuminanceInv.r;
        ColorC.g = ColorA.g * g_LuminanceInv.g;
        ColorC.b = ColorA.b * g_LuminanceInv.b;
        ColorC.a = ColorA.a;

        ColorD.r = ColorB.r * g_LuminanceInv.r;
        ColorD.g = ColorB.g * g_LuminanceInv.g;
        ColorD.b = ColorB.b * g_LuminanceInv.b;
        ColorD.a = ColorB.a;
    }

    const wColorA = Encode565(ColorC);
    const wColorB = Encode565(ColorD);

    if((uSteps == 4) && (wColorA == wColorB)) {
        return new D3DX_BC1(
            wColorA,
            wColorB,
            0x00000000
        );
    }

    ColorC = Decode565(wColorA);
    ColorD = Decode565(wColorB);

    if(flags & BC_FLAGS_UNIFORM) {
        ColorA = ColorC;
        ColorB = ColorD;
    } else {
        ColorA.r = ColorC.r * g_Luminance.r;
        ColorA.g = ColorC.g * g_Luminance.g;
        ColorA.b = ColorC.b * g_Luminance.b;

        ColorB.r = ColorD.r * g_Luminance.r;
        ColorB.g = ColorD.g * g_Luminance.g;
        ColorB.b = ColorD.b * g_Luminance.b;
    }

    // Calculate color steps
    let Step = [
        new HDRColorA(),
        new HDRColorA(),
        new HDRColorA(),
        new HDRColorA()
    ];

    let pBC_rgb0;
    let pBC_rgb1;

    if((3 == uSteps) == (wColorA <= wColorB)) {
        pBC_rgb0 = wColorA;
        pBC_rgb1 = wColorB;

        Step[0] = ColorA;
        Step[1] = ColorB;
    } else {
        pBC_rgb0 = wColorB;
        pBC_rgb1 = wColorA;

        Step[0] = ColorB;
        Step[1] = ColorA;
    }


    let pSteps;
    if(3 == uSteps) {
        pSteps = [ 0, 2, 1 ];

        Step[2] = HDRColorALerp(Step[0], Step[1], 0.5);
    } else {
        pSteps = [ 0, 2, 3, 1 ];

        Step[2] = HDRColorALerp(Step[0], Step[1], 1.0 / 3.0);
        Step[3] = HDRColorALerp(Step[0], Step[1], 2.0 / 3.0);
    }

    // Calculate color direction
    let Dir = new HDRColorA(
        Step[1].r - Step[0].r,
        Step[1].g - Step[0].g,
        Step[1].b - Step[0].b,
        0.0
    );

    const fSteps = (uSteps - 1);
    let fScale = (wColorA != wColorB) ? (fSteps / (Dir.r * Dir.r + Dir.g * Dir.g + Dir.b * Dir.b)) : 0.0;

    Dir.r *= fScale;
    Dir.g *= fScale;
    Dir.b *= fScale;

    // Encode colors
    let dw = 0x00000000;
    if(flags & BC_FLAGS_DITHER_RGB) {
        for(let i=0; i < 16; i++) {
            Error[i].r = 0;
            Error[i].g = 0;
            Error[i].b = 0;
            Error[i].a = 0;
        }
    }

    for(let i = 0; i < 16; ++i) {
        if((3 == uSteps) && (pColor[i].a < threshold)) {
            dw |= (3 << (i*2));
        } else {
            let Clr = new HDRColorA();
            if(flags & BC_FLAGS_UNIFORM) {
                Clr.r = pColor[i].r;
                Clr.g = pColor[i].g;
                Clr.b = pColor[i].b;
            } else {
                Clr.r = pColor[i].r * g_Luminance.r;
                Clr.g = pColor[i].g * g_Luminance.g;
                Clr.b = pColor[i].b * g_Luminance.b;
            }
            Clr.a = 1.0;

            if(flags & BC_FLAGS_DITHER_RGB) {
                Clr.r += Error[i].r;
                Clr.g += Error[i].g;
                Clr.b += Error[i].b;
            }

            const fDot = (Clr.r - Step[0].r) * Dir.r + (Clr.g - Step[0].g) * Dir.g + (Clr.b - Step[0].b) * Dir.b;

            const iStep = (fDot < 0.0 ? 0 : (fDot >= fSteps ? 1 : pSteps[Math.floor(fDot + 0.5)]));

            dw |= (iStep << (i*2));

            if(flags & BC_FLAGS_DITHER_RGB) {
                let Diff = new HDRColorA(
                    Color[i].a * (Clr.r - Step[iStep].r),
                    Color[i].a * (Clr.g - Step[iStep].g),
                    Color[i].a * (Clr.b - Step[iStep].b),
                    0.0
                );

                if(3 != (i & 3)) {
                    Error[i + 1].r += Diff.r * (7.0 / 16.0),
                    Error[i + 1].g += Diff.g * (7.0 / 16.0),
                    Error[i + 1].b += Diff.b * (7.0 / 16.0)
                }

                if(i < 12) {
                    if(i & 3) {
                        Error[i + 3].r += Diff.r * (3.0 / 16.0);
                        Error[i + 3].g += Diff.g * (3.0 / 16.0);
                        Error[i + 3].b += Diff.b * (3.0 / 16.0);
                    }

                    Error[i + 4].r += Diff.r * (5.0 / 16.0);
                    Error[i + 4].g += Diff.g * (5.0 / 16.0);
                    Error[i + 4].b += Diff.b * (5.0 / 16.0);

                    if(3 != (i & 3)) {
                        Error[i + 5].r += Diff.r * (1.0 / 16.0);
                        Error[i + 5].g += Diff.g * (1.0 / 16.0);
                        Error[i + 5].b += Diff.b * (1.0 / 16.0);
                    }
                }
            }
        }
    }

    return new D3DX_BC1(
        pBC_rgb0,
        pBC_rgb1,
        dw
    );
}

function D3DXEncodeBC1(Color, threshold, flags) {
    if(flags & BC_FLAGS_DITHER_A) {
        const fError = new Float32Array(16);

        for(let i = 0; i < 16; ++i) {
            const fAlph = Color[i].a + fError[i];

            Color[i].a += fError[i] + 0.4; // + 0.5;

            const fDiff = fAlph - Color[i].a;

            if(3 != (i & 3)) {
                fError[i + 1] += fDiff * (7.0 / 16.0);
            }

            if(i < 12) {
                if(i & 3)
                    fError[i + 3] += fDiff * (3.0 / 16.0);

                fError[i + 4] += fDiff * (5.0 / 16.0);

                if(3 != (i & 3)) {
                    fError[i + 5] += fDiff * (1.0 / 16.0);
                }
            }
        }
    }

    return EncodeBC1(Color, true, threshold, flags);
}

















function dxt1_compress_block(rgba8888, dither=false, threshold=0.5) {
    let Colors = new Array(16);
    for(let i=0; i < 16; i++) {
        Colors[i] = new HDRColorA(rgba8888[i*4+0] / 255, rgba8888[i*4+1] / 255, rgba8888[i*4+2] / 255, rgba8888[i*4+3] / 255);
    }
    if(dither) threshold = 0.5;
    const block = D3DXEncodeBC1(
        Colors,
        threshold,
        (dither ? BC_FLAGS_DITHER_RGB | BC_FLAGS_DITHER_A : 0)
    );
    return new Uint8Array([
        block.rgb0,
        block.rgb0 >> 8,
        block.rgb1,
        block.rgb1 >> 8,
        block.bitmap,
        block.bitmap >> 8,
        block.bitmap >> 16,
        block.bitmap >> 24
    ]);
}



export { dxt1_compress_block };
