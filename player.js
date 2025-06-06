
import { UnitType } from './unit.js'
import { BuildingType } from './building.js'

class Player {
    constructor(name, gameplay) {
        this.playerName = name;
        this.gameplay = gameplay;

        this.selectionStartX = 0;
        this.selectionStartY = 0;
        this.selectionEndX = 0;
        this.selectionEndY = 0;
        this.selectedUnits = [];
        this.selectedBuilding = null;

        this.resources = {
            wood: 100,
            stone: 100,
            food: 100,
            money: 12000
        };
    }

    moveMap(arrows) {
        this.gameplay.map.moveMap(arrows);
    }

    onClick(x, y) {
        this.gameplay.map.checkTile(x, y);
    }

    moveUnitsTo(screenX, screenY) {
        const x = this.gameplay.map.getTileX(screenX, screenY);
        const y = this.gameplay.map.getTileY(screenX, screenY);

        this.gameplay.moveUnitsTo(x, y);
    }

    beginSelection(x, y) {
        const screenPosX = this.gameplay.map.screenPosX;
        const screenPosY = this.gameplay.map.screenPosY;
        
        this.selectionStartX = x + screenPosX;
        this.selectionStartY = y + screenPosY;
        this.selectionEndX = x + screenPosX;
        this.selectionEndY = y + screenPosY;

        this.selectedBuilding = null;
    }

    updateSelection(x, y)  {
        const screenPosX = this.gameplay.map.screenPosX;
        const screenPosY = this.gameplay.map.screenPosY;

        this.selectionEndX = x + screenPosX;
        this.selectionEndY = y + screenPosY;

        this.selectUnits();
    }

    endSelection() {
        if(this.selectedUnits.length === 0) {
            this.selectBuilding(this.selectionEndX, this.selectionEndY);
        }
        else {
            this.selectedBuilding = null;
        }
    }

    selectUnits() {
        let sx, sy, ex, ey;

        if(this.selectionStartX < this.selectionEndY) {
            sx = this.gameplay.map.getTileX_map(this.selectionStartX, this.selectionStartY);
            ex = this.gameplay.map.getTileX_map(this.selectionEndX, this.selectionEndY);
        }
        else {
            sx = this.gameplay.map.getTileX_map(this.selectionEndX, this.selectionEndY);
            ex = this.gameplay.map.getTileX_map(this.selectionStartX, this.selectionStartY);
        }

        if(this.selectionStartX < this.selectionEndY) {
            sy = this.gameplay.map.getTileY_map(this.selectionStartX, this.selectionStartY);
            ey = this.gameplay.map.getTileY_map(this.selectionEndX, this.selectionEndY);
        }
        else {
            sy = this.gameplay.map.getTileY_map(this.selectionEndX, this.selectionEndY);
            ey = this.gameplay.map.getTileY_map(this.selectionStartX, this.selectionStartY);
        }

        this.selectedUnits = this.gameplay.selectUnits(sx, sy, ex, ey, this.playerName);
    }

    selectBuilding(x, y) {
        const tileX = this.gameplay.map.getTileX_map(x, y);
        const tileY = this.gameplay.map.getTileY_map(x, y);

        if(this.gameplay.map.tiles[tileX][tileY].building != null &&
            this.gameplay.map.tiles[tileX][tileY].building.player === this.playerName) {
            this.selectedBuilding = this.gameplay.map.tiles[tileX][tileY].building;
        }
        else {
            this.selectedBuilding = null;
        }
    }

    placeBuilding(x, y, buildingType) {
        this.gameplay.placeBuilding(x, y, buildingType);
    }

    build() {
       return this.gameplay.build();
    }

    discardPlacingBuilding () {
        this.gameplay.discardPlacingBuilding();
    }

    recruit(building, unitType) {
        building.addToQueue(unitType);

        this.gameplay.subtractUnitCost(unitType, this.playerName);
    }

    addUnit(typeName) {
        const posX = this.gameplay.map.checkedTileX;
        const posY = this.gameplay.map.checkedTileY;

        if(typeName == "worker") {
            this.gameplay.addUnit(UnitType.worker, posX, posY, this.playerName);
        }
        else if(typeName == "spearman") {
            this.gameplay.addUnit(UnitType.spearman, posX, posY, this.playerName);
        }
        else if(typeName == "archer") {
            this.gameplay.addUnit(UnitType.archer, posX, posY, this.playerName);
        }
    }

    plantCrops() {
        const posX = this.gameplay.map.checkedTileX;
        const posY = this.gameplay.map.checkedTileY;

        this.gameplay.plantCrops(posX, posY)
    }

    drawSelectionRect(ctx) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
    
        let sx, sy, sw, sh;
    
        const screenPosX = this.gameplay.map.screenPosX;
        const screenPosY = this.gameplay.map.screenPosY;
    
        if(this.selectionStartX < this.selectionEndX){
            sx = this.selectionStartX - screenPosX;
            sw = this.selectionEndX - this.selectionStartX;
        }
        else {
            sx = this.selectionEndX - screenPosX;
            sw = this.selectionStartX - this.selectionEndX;
        }
    
        if(this.selectionStartY < this.selectionEndY) {
            sy = this.selectionStartY - screenPosY;
            sh = this.selectionEndY - this.selectionStartY;
        }
        else {
            sy = this.selectionEndY - screenPosY;
            sh = this.selectionStartY - this.selectionEndY;
        }
    
        ctx.rect(sx, sy, sw, sh);
        ctx.stroke();
    }
}

export { Player }
