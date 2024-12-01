
const TileType = {
    GRASS: Symbol("grass"),
    STONE: Symbol("stone"),
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