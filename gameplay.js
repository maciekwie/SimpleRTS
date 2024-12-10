import { Map } from './map.js';
import { Building, BuildingType } from './building.js';
import { WorkerUnit } from './worker-unit.js';
import { AssetManager } from './asset-manager.js';

class Gameplay {
    constructor(params) {
        this.map = new Map(params.mapWidth, params.mapHeight);

        this.buildings = [];
        this.units = [];
        this.growingCrops = [];

        this.selectionStartX = 0;
        this.selectionStartY = 0;
        this.selectionEndX = 0;
        this.selectionEndY = 0;

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

        if(selecting) {
            this.drawSelectionRect(ctx);
        }
    }

    nextFrame() {
        this.buildings.forEach(building => {
            building.nextFrame();
        })
    }

    drawSelectionRect(ctx) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;

        let sx, sy, sw, sh;

        if(this.selectionStartX < this.selectionEndX){
            sx = this.selectionStartX - this.map.screenPosX;
            sw = this.selectionEndX - this.selectionStartX;
        }
        else {
            sx = this.selectionEndX - this.map.screenPosX;
            sw = this.selectionStartX - this.selectionEndX;
        }

        if(this.selectionStartY < this.selectionEndY) {
            sy = this.selectionStartY - this.map.screenPosY;
            sh = this.selectionEndY - this.selectionStartY;
        }
        else {
            sy = this.selectionEndY - this.map.screenPosY;
            sh = this.selectionStartY - this.selectionEndY;
        }

        ctx.rect(sx, sy, sw, sh);
        ctx.stroke();
    }

    moveMap(arrows) {
        this.map.moveMap(arrows);
    }

    onClick(x, y) {
        this.map.checkTile(x, y);
    }

    beginSelection(x, y) {
        this.selectionStartX = x + this.map.screenPosX;
        this.selectionStartY = y + this.map.screenPosY;
    }

    updateSelection(x, y)  {
        this.selectionEndX = x + this.map.screenPosX;
        this.selectionEndY = y + this.map.screenPosY;

        this.selectUnits();
    }

    endSelection() {

    }

    selectUnits() {
        let sx, sy, ex, ey;

        if(this.selectionStartX < this.selectionEndY) {
            sx = this.map.getTileX_map(this.selectionStartX, this.selectionStartY);
            ex = this.map.getTileX_map(this.selectionEndX, this.selectionEndY);
        }
        else {
            sx = this.map.getTileX_map(this.selectionEndX, this.selectionEndY);
            ex = this.map.getTileX_map(this.selectionStartX, this.selectionStartY);
        }

        if(this.selectionStartX < this.selectionEndY) {
            sy = this.map.getTileY_map(this.selectionStartX, this.selectionStartY);
            ey = this.map.getTileY_map(this.selectionEndX, this.selectionEndY);
        }
        else {
            sy = this.map.getTileY_map(this.selectionEndX, this.selectionEndY);
            ey = this.map.getTileY_map(this.selectionStartX, this.selectionStartY);
        }

        this.units.forEach(unit => {
            if(isPointInSelection(sx, sy, ex, ey, unit.posX, unit.posY)) {
                unit.selected = true;
            }
            else {
                unit.selected = false;
            }
        });
    }

    moveUnitsTo(screenX, screenY) {
        const x = this.map.getTileX(screenX, screenY);
        const y = this.map.getTileY(screenX, screenY);

        this.units.forEach(unit => {
            if(unit.selected) {
                const path = this.map.getPath(unit.posX, unit.posY, x, y);
                unit.setPath(path);
            }
        });
    }

    build(typeName) {
        const posX = this.map.checkedTileX;
        const posY = this.map.checkedTileY;
        
        if(typeName == "house") {
            let building = new Building(BuildingType.houseType, posX, posY);

            this.buildings.push(building);
            this.map.addBuilding(building);
        }
        else if(typeName == "mill") {
            let building = new Building(BuildingType.millType, posX, posY);

            building.currentAnimation = AssetManager.millAnimations["mill"];

            this.buildings.push(building);
            this.map.addBuilding(building);
        }
        else if(typeName == "barracks") {
            let building = new Building(BuildingType.barracksType, posX, posY);

            this.buildings.push(building);
            this.map.addBuilding(building);
        }
        else if(typeName == "storehouse") {
            let building = new Building(BuildingType.storehouseType, posX, posY);

            this.buildings.push(building);
            this.map.addBuilding(building);
        }
    }

    addUnit(typeName) {
        if(typeName == "worker") {
            const posX = this.map.checkedTileX;
            const posY = this.map.checkedTileY;

            let unit = new WorkerUnit(posX, posY);

            this.units.push(unit);

            this.map.addUnit(unit);
        }
    }

    plantCrops() {
        const posX = this.map.checkedTileX;
        const posY = this.map.checkedTileY;

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