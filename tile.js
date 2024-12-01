
const TileType = {
    GRASS: Symbol("grass"),
    WATER: Symbol("water"),
    TREE: Symbol("tree")
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