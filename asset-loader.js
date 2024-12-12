class AssetLoader {
    constructor() {
        this.assets = {};      // Object to hold assets data
        this.assetsToLoad = 0; // Counter for assets to be loaded
        this.loadedAssets = 0; // Counter for assets that have completed loading
    }

    // Method to load an image
    loadImage(key, src) {
        this.assetsToLoad++;

        const img = new Image();
        img.onload = () => {
            this.assets[key] = img;
            this.assetLoaded();
        };
        img.onerror = () => {
            console.error('Error loading image:', src);
        };
        img.src = src;
    }

    // Method to load a JSON file
    loadJSON(key, url) {
        this.assetsToLoad++;

        fetch(url)
            .then(response => response.json())
            .then(json => {
                this.assets[key] = json;
                this.assetLoaded();
            })
            .catch(error => {
                console.error('Error loading JSON:', url, error);
            });
    }

    // Method to handle the loaded asset and check if all assets are loaded
    assetLoaded() {
        this.loadedAssets++;
        if (this.loadedAssets === this.assetsToLoad) {
            this.onAllLoaded();
        }
    }

    // Set the callback function to be executed after all assets are loaded
    setOnAllLoaded(callback) {
        this.onAllLoaded = callback;
    }
}

function setAnimations(animationsData, atlasData)
{
    let animations = [];
    animationsData.animations.forEach(anim => {
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

export { AssetLoader, setAnimations }