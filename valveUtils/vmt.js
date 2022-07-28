
/*
    W.I.P.
*/



/** @type {"BaseTimesLightmap"|"Cable"|"Decal"|"DecalModulate"|"LightMappedGeneric"|"Modulate"|"MonitorScreen"|"Predator"|"Refract"|"ShatteredGlass"|"Sprite"|"UnlitGeneric"|"VertexLitGeneric"|"Water"} */
const SHADERS = undefined;

/** @type {"AlienFlesh"|"ArmorFlesh"|"BloodyFlesh"|"Boulder"|"Brick"|"Chain"|"ChainLink"|"Computer"|"Concrete"|"Concrete_Block"|"Default"|"Default_Silent"|"Dirt"|"Flesh"|"Glass"|"Grass"|"Gravel"|"Ice"|"Ladder"|"Metal_Box"|"Metal"|"MetalGrate"|"MetalPanel"|"MetalVent"|"MudSlipperySlime"|"Player_Control_Clip"|"Porcelain"|"QuickSand"|"Rock"|"Slime"|"SlipperyMetal"|"Snow"|"SolidMetal"|"Tile"|"Wade"|"Water"|"WaterMelon"|"Wood_Box"|"Wood_Crate"|"Wood_Furniture"|"Wood_Panel"|"Wood_Plank"|"Wood_Solid"|"WoodWood_LowDensity"} */
const SURFACES = undefined;



/*
    All parameters were picked from TF2
    Other source games parameters aren't here.
    (Maybe a TODO to add them all?)
*/

class VMT {
    /** @type {SHADERS} Shader */
    shader;
    /** @param {SHADERS} shader */
    setShader(shader) { this.shader = shader; }


    /** @type {string} Albedo base texture */
    baseTexture;

    /** @type {string} Material base texture transform (Can be matrix array "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]" or text "center .5 .5 scale 1 1 rotate 0 translate 0 0") */
    baseTextureTransform;

    /** @type {number} Start frame */
    frame;

    /** @type {SURFACES} Material surface type */
    surfaceProp;
    /** @param {SURFACES} surfaceProp */
    setSurfaceProp(surfaceProp) { this.surfaceProp = surfaceProp; }

    

    /** @type {string} Albedo base texture 2 (Used in certain shaders) */
    baseTexture2;

    /** @type {string} Material base texture transform (Used in certain shaders) (Can be matrix array "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]" or text "center .5 .5 scale 1 1 rotate 0 translate 0 0") */
    baseTextureTransform2;

    /** @type {number} Start frame 2 (Used in certain shaders)  */
    frame2;

    /** @type {SURFACES} Material surface type 2 (Used in certain shaders) */
    surfaceProp2;
    /** @param {SURFACES} surfaceProp2 (Used in certain shaders) */
    setSurfaceProp2(surfaceProp2) { this.surfaceProp2 = surfaceProp2; }
    


    /** @type {boolean} Is material a decal (Is displayed above all others) */
    decal;

    /** @type {number} Decal scale */
    decalScale;

    /** @type {string} Material that will replace this one if decal hits a model */
    modelMaterial;

    /** @type {number} Amount of time to spend fading out */
    decalFadeDuration;

    /** @type {boolean} If to apply ontop of other decals first */
    decalSecondPass;





    /** @type {string} Noise overlay */
    detail;

    /** @type {string} Detail texture transform (Can be matrix array "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]" or text "center .5 .5 scale 1 1 rotate 0 translate 0 0") */
    detailTextureTransform;

    /** @type {number} Scale of detail */
    detailScale;

    /** @type {number} Amount of detail that is applied to base texture (0 is none, 1 is full.) */
    detailBlendFactor;

    /**
     * Detail blend mode  
     * 
     * 0=DecalModulate (Colors below 128 darken the image, Colors above lighten the image.)  
     * 1=Additive (Detail is added to base image.)  
     * 2=Translucent Detail (Detail is applied as translucent overlay above the base texture.)  
     * 3=Blend Factor Face (Detail is applied as transluctent overlay, but no alpha channel, the blend factor is used to determine how much base texture shows.)  
     * 4=Translucent Base (Flips the detail and the base image, with detail controlling the alpha.)  
     * 5=Unlit Additive (Identical to mode 1, but is unaffected to lighting.)  
     * 6=Unlit Additive Threshold Fade (Mode 5, but first modifies the color added in two modes, depending if the blend factor is above or below 0.5)  
     * 7=Two-Pattern DecalModulate (Same as mode 0, But only red and alpha channel are used. For grayscale.)  
     * 8=Multiply (The color of base channel is multiplied with the detail.)  
     * 9=Base Mask (Only multiplies the base details alpha with the base texture alpha.)  
     * 10=Self-Shadowed Bumpmap (The detail texture is used as a bumpmap. no blend factor.)  
     * 11=SSBump Albedo (Unknown.)  
     * 12+ Will disable blend mode.  
     * @type {number}
     */
    detailBlendMode;

    /** @type {number[]} Detail tint */
    detailTint;

    /** @type {number} Detail start frame */
    detailFrame;



    /** @type {boolean} If material will be for use on a model */
    model;



    /** @type {number[]} Scale color channels */
    color;

    /** @type {number[]} Scale color channels (For use with models) */
    color2;



    /** @type {boolean} Scale opacity of the entire material */
    alpha;

    /** @type {boolean} ON or OFF alpha */
    alphaTest;

    /** @type {number} When alpha is considered on or off. (Used with alphaTest) */
    alphaTestReference;



    /** @type {string} The modulation texture for blending. */
    blendModulateTexture;

    /** @type {string} Detail texture transform (Can be matrix array "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]" or text "center .5 .5 scale 1 1 rotate 0 translate 0 0") */
    blendMaskTransform;

    /** @type {boolean} Makes the shader use modulation texture for the blend instead of using the vertex alpha for the displacement. */
    maskedBlending;



    /** @type {boolean} Cheap edge filtering */
    distanceAlpha;



    /** @type {boolean} Disable back face culling */
    noCull;



    /** @type {boolean} Specify if material is partially see-through, Use for non-intersecting textures */
    translucent;

    /** @type {boolean} If translucent colors should be added to the image instead of multiplied */
    additive;

}

const test = new VMT();

export { VMT };
