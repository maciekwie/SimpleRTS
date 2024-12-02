import { GameObject } from './game-object.js';

class BuildingType  {
    constructor(name) {
        this.name = name;
    }
};

BuildingType.houseType = new BuildingType("house");
BuildingType.millType = new BuildingType("mill");

class Building extends GameObject {
    constructor(type, posX, posY) {
        super(posX, posY);

        this.type = type;

        this.currentFrame = 0;
        this.currentAnimation = null; 
    }

    nextFrame()
    {
        this.currentFrame++;

        if(this.currentFrame == this.currentAnimation.numberOfFrames)
            this.currentFrame = 0;
    }
}

export { BuildingType, Building }