import { GameObject } from './game-object.js';

class BuildingType  {
    constructor(name) {
        this.name = name;
    }
};

BuildingType.houseType = new BuildingType("house");
BuildingType.millType = new BuildingType("mill");
BuildingType.storehouseType = new BuildingType("storehouse");
BuildingType.barracksType = new BuildingType("barracks");

class Building extends GameObject {
    constructor(type, posX, posY) {
        super(posX, posY);

        this.type = type;

        this.recruitQueue = [];
        this.recruitProgress = 0;

        this.player = "";

        this.image = null;
        this.width = 1;
        this.height = 1;

        this.currentFrame = 0;
        this.currentAnimation = null; 
    }

    exec(deltaTime, time, gameplay) {
        if(this.recruitQueue.length > 0) {
            const type = this.recruitQueue[0];

            if(this.recruitProgress < 1) {
               
                this.recruitProgress += deltaTime / type.recruitTime;
            }
            else {
                gameplay.addUnit(type, this.posX - 1, this.posY - 1, this.player);

                this.recruitProgress = 0;
                this.recruitQueue.splice(0, 1);
            }
        }
    }

    addToQueue(unitType) {
        this.recruitQueue.push(unitType);
    }

    nextFrame()
    {
        if(this.currentAnimation == null)
            return;

        this.currentFrame++;

        if(this.currentFrame == this.currentAnimation.numberOfFrames)
            this.currentFrame = 0;
    }
}

export { BuildingType, Building }