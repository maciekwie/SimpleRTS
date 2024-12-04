
let AssetManager = {};

AssetManager.loadAssets = function() {
    AssetManager.grassImage = AssetManager.loadImage("Assets/grass.png");
    AssetManager.houseImage = AssetManager.loadImage("Assets/house.png");
    AssetManager.storehouseImage = AssetManager.loadImage("Assets/storehouse.png");
    AssetManager.barracksImage = AssetManager.loadImage("Assets/barracks.png");
    AssetManager.workerImage = AssetManager.loadImage("Assets/workel_walk_front0001.png");
    AssetManager.tree1Image = AssetManager.loadImage("Assets/tree1.png");
    AssetManager.tree2Image = AssetManager.loadImage("Assets/tree2.png");
    AssetManager.tree3Image = AssetManager.loadImage("Assets/tree3.png");
    AssetManager.stoneImage = AssetManager.loadImage("Assets/stone.png");
    AssetManager.millImage = AssetManager.loadImage("Assets/windmill_atlas.png");

    let millAtlas;
    let millAnimationsData 
    (async () => {
        millAtlas = await AssetManager.loadJSON("Assets/windmill_atlas.json");
        millAnimationsData = await AssetManager.loadJSON("Assets/windmill_animations.json");
    })().then(() => {
        AssetManager.millAnimations = AssetManager.setAnimations(millAnimationsData.animations, millAtlas);
    });
}


AssetManager.loadImage = function(url) {
    let img = new Image();
    img.src = url;
    return img;
}

AssetManager.loadJSON = async function(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading JSON:', error);
        throw error;
    }
};

AssetManager.setAnimations = function(animationsData, atlasData)
{
    let animations = [];
    animationsData.forEach(anim => {
        let animation = {};
        animation.name = anim.name;
        animation.numberOfFrames = anim.frames;
        animation.frames = [];

        for(let i = 0; i < animation.numberOfFrames; i++)
        {
            const frameName = anim.name + "_" + String(i + 1).padStart(4, '0');;
            const frame = atlasData.frames.find((element) => element.name == frameName);
            animation.frames[i] = {
                x: frame.x,
                y: frame.y,
                width: frame.width,
                height: frame.height
            }
        }

        animations[anim.name] = animation;
    });

    return animations;
}

export { AssetManager }