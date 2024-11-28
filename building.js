import { GameObject } from './game-object.js';

class BuildingType  {
    constructor(name) {
        this.name = name;
    }
};

BuildingType.houseType = new BuildingType("house");

class Building extends GameObject {
    constructor(type, posX, posY) {
        super(posX, posY);

        this.type = type;
    }
}

export { BuildingType, Building }