
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
    }

    updateSelection(x, y)  {
        const screenPosX = this.gameplay.map.screenPosX;
        const screenPosY = this.gameplay.map.screenPosY;

        this.selectionEndX = x + screenPosX;
        this.selectionEndY = y + screenPosY;

        this.selectUnits();
    }

    endSelection() {

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

        this.gameplay.selectUnits(sx, sy, ex, ey, this.playerName);
    }

    build(typeName) {
        const posX = this.gameplay.map.checkedTileX;
        const posY = this.gameplay.map.checkedTileY;
        
        if(typeName == "house") {
            this.gameplay.addBuilding(BuildingType.houseType, posX, posY, this.playerName);
        }
        else if(typeName == "mill") {
            this.gameplay.addBuilding(BuildingType.millType, posX, posY, this.playerName);
        }
        else if(typeName == "barracks") {
            this.gameplay.addBuilding(BuildingType.barracksType, posX, posY, this.playerName);
        }
        else if(typeName == "storehouse") {
            this.gameplay.addBuilding(BuildingType.storehouseType, posX, posY, this.playerName);
        }
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
