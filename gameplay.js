import { Map } from './map.js';
import { Building, BuildingType } from './building.js';
import { UnitType } from './unit.js';
import { WorkerUnit, WorkerAction } from './worker-unit.js';
import { Spearman, SpearmanAction } from './spearman.js';
import { Archer, ArcherAction } from './archer.js';
import { TileType } from './tile.js'
import { AssetManager } from './asset-manager.js';

class Gameplay {
    constructor(params) {
        this.map = new Map(params.mapWidth, params.mapHeight);

        this.buildings = [];
        this.units = [];
        this.growingCrops = [];

        BuildingType.houseType.image = AssetManager.houseImage;
        BuildingType.houseType.width = 3;
        BuildingType.houseType.height = 3;

        BuildingType.millType.image = AssetManager.millImage;
        BuildingType.millType.width = 2;
        BuildingType.millType.height = 3;

        BuildingType.storehouseType.image = AssetManager.storehouseImage;
        BuildingType.storehouseType.width = 1;
        BuildingType.storehouseType.height = 3;

        BuildingType.barracksType.image = AssetManager.barracksImage;
        BuildingType.barracksType.width = 3;
        BuildingType.barracksType.height = 2;

        this.CROPS_GROW_RATE = 0.1;
    }

    initMap() {
        for(let i = 0; i < 200; i++) {
            const x = Math.round(Math.random() * (this.map.width - 1));
            const y = Math.round(Math.random() * (this.map.height - 1));

            this.map.placeTree(x, y);
        }
        for(let i = 0; i < 150; i++) {
            const x = Math.round(Math.random() * (this.map.width - 1));
            const y = Math.round(Math.random() * (this.map.height - 1));

            this.map.placeStone(x, y);
        }
    }

    exec (deltaTime) {
        this.units.forEach(unit => {
            unit.move(deltaTime, this.map);
            unit.nextFrame();
        });

        for(let i = 0; i < this.growingCrops.length; i++)
        {
            const pos = this.growingCrops[i];
            if(this.map.growCrops(pos.x, pos.y, this.CROPS_GROW_RATE * deltaTime)) {
                this.growingCrops.splice(i, 1);
            }
        }
    }

    render(ctx, selecting) {
        this.map.render(ctx);
    }

    nextFrame() {
        this.buildings.forEach(building => {
            building.nextFrame();
        })
    }

    selectUnits(sx, sy, ex, ey, player) {
        this.units.forEach(unit => {
            if(unit.player == player && isPointInSelection(sx, sy, ex, ey, unit.posX, unit.posY)) {
                unit.selected = true;
            }
            else {
                unit.selected = false;
            }
        });
    }

    moveUnitsTo(x, y) {
        let action = WorkerAction.IDLE;
        if(this.map.tiles[x][y].type === TileType.TREE)
            action = WorkerAction.CUT;
        else if(this.map.tiles[x][y].type === TileType.STONE)
            action = WorkerAction.MINE;
        else if(this.map.tiles[x][y].type === TileType.CROPS)
            action = WorkerAction.HARVEST;

        this.units.forEach(unit => {
            if(unit.selected) {
                const path = this.map.getPath(unit.posX, unit.posY, x, y);
                unit.setPath(path);

                if(unit.type === UnitType.worker)
                {
                    unit.SetAction(action);
                }
            }
        });
    }

    addBuilding(type, posX, posY, player) {
        let building = new Building(type, posX, posY);
        building.player = player;

        if(type === BuildingType.millType) {
            building.currentAnimation = AssetManager.millAnimations["mill"];
        }

        this.buildings.push(building);
        this.map.addBuilding(building);
    }

    addUnit(type, posX, posY, player) {
        let unit;

        if(type === UnitType.worker) {
            unit = new WorkerUnit(posX, posY);
        }
        if(type === UnitType.spearman){
            unit = new Spearman(posX, posY);
        }
        if(type === UnitType.archer) {
            unit = new Archer(posX, posY);
        }

        unit.player = player;

        this.units.push(unit);
        this.map.addUnit(unit);
    }

    plantCrops(posX, posY) {
        this.growingCrops.push({ x: posX, y: posY });
        this.map.plantCrops(posX, posY);
    }
}

function isPointInSelection(sx, sy, ex, ey, x, y) {
    const sqrt2 = Math.sqrt(2);

    // Rotate the rectangle vertices
    const x1Prime = (sx + sy) / sqrt2;
    const y1Prime = (-sx + sy) / sqrt2;

    const x2Prime = (ex + ey) / sqrt2;
    const y2Prime = (-ex + ey) / sqrt2;

    // Rotate the point
    const xPrime = (x + y) / sqrt2;
    const yPrime = (-x + y) / sqrt2;

    // Determine the bounding box
    const xMin = Math.min(x1Prime, x2Prime);
    const xMax = Math.max(x1Prime, x2Prime);
    const yMin = Math.min(y1Prime, y2Prime);
    const yMax = Math.max(y1Prime, y2Prime);

    // Check if the point lies within the bounds
    return (xPrime >= xMin && xPrime <= xMax && yPrime >= yMin && yPrime <= yMax);
}

export { Gameplay }