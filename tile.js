
const TileType = {
    GRASS: Symbol("grass"),
    STONE: Symbol("stone"),
    TREE: Symbol("tree"),
    GROWING_CROPS: Symbol("growing_crops"),
    CROPS: Symbol("crops")
};
Object.freeze(TileType);

class Tile {
    constructor(type) {
        this.type = type;

        this.building = null;
        this.units = [];

        this.occupied = false;
    }

}

export { Tile, TileType }