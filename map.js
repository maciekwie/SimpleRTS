import { BuildingType } from './building.js';
import { Tile, TileType } from './tile.js'
import { MoveState } from './unit.js'


class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.screenPosX = 0;
        this.screenPosY = 0;

        this.TILE_WIDTH = 256;
        this.TILE_HEIGHT = 128;

        this.MOVE_SPEED = 3;

        this.tiles = new Array(width);
        for(let i = 0; i < width; i++) {
            this.tiles[i] = new Array(height);

            for(let j = 0; j < height; j++) {
                this.tiles[i][j] = new Tile(TileType.GRASS);
            }
        }

        this.checkedTileX = 1;
        this.checkedTileY = 1;
    }

    getScreenX(i, j) {
        return this.TILE_WIDTH * i / 2 + this.height * this.TILE_WIDTH / 2 - j * this.TILE_WIDTH / 2 - this.screenPosX;
    }

    getScreenY(i, j) {
        return (j - 1) * this.TILE_HEIGHT / 2 - this.width * this.TILE_HEIGHT / 2 + i * this.TILE_HEIGHT / 2 - this.screenPosY;
    }

    getTileX(screenX, screenY) {
        const s1 = screenX + this.screenPosX - (this.height * this.TILE_WIDTH) / 2;
        const s2 = screenY + this.screenPosY + (this.width * this.TILE_HEIGHT) / 2;

        const i = ((2 * s1) / this.TILE_WIDTH + (2 * s2) / this.TILE_HEIGHT + 1) / 2;
        return Math.round(i);
    }
    
    getTileY(screenX, screenY) {
        const s1 = screenX + this.screenPosX - (this.height * this.TILE_WIDTH) / 2;
        const s2 = screenY + this.screenPosY + (this.width * this.TILE_HEIGHT) / 2;

        const j = ((2 * s2) / this.TILE_HEIGHT - (2 * s1) / this.TILE_WIDTH + 1) / 2;
        return Math.round(j);
    }

    getTileX_map(posX, posY) {
        const s1 = posX - (this.height * this.TILE_WIDTH) / 2;
        const s2 = posY + (this.width * this.TILE_HEIGHT) / 2;

        const i = ((2 * s1) / this.TILE_WIDTH + (2 * s2) / this.TILE_HEIGHT + 1) / 2;
        return Math.round(i);
    }
    
    getTileY_map(posX, posY) {
        const s1 = posX - (this.height * this.TILE_WIDTH) / 2;
        const s2 = posY + (this.width * this.TILE_HEIGHT) / 2;

        const j = ((2 * s2) / this.TILE_HEIGHT - (2 * s1) / this.TILE_WIDTH + 1) / 2;
        return Math.round(j);
    }

    render(ctx) {
        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                const screenX = this.getScreenX(i, j);
                const screenY = this.getScreenY(i, j);
    
                if(this.tiles[i][j].type == TileType.GRASS) {
                    ctx.drawImage(this.grassImage, screenX, screenY);
                }

                if(this.tiles[i][j].building != null) {
                    if(this.tiles[i][j].building.type == BuildingType.house) {
                        ctx.drawImage(this.houseImage, screenX - this.houseImage.width / 2, screenY - this.houseImage.height / 2 - this.TILE_HEIGHT / 2);
                    }
                }

                this.tiles[i][j].units.forEach(unit => {
                    let x = screenX - this.workerImage.width / 2;
                    let y = screenY - this.workerImage.height / 2 - this.TILE_HEIGHT / 2;

                    if(unit.moveState == MoveState.MOVE_OUT) {
                        const dx = unit.getDirectionX();
                        const dy = unit.getDirectionY();

                        x += unit.moveProgress * dx * this.TILE_WIDTH / 4 - unit.moveProgress * dy * this.TILE_HEIGHT / 4;
                        y += unit.moveProgress * dy * this.TILE_HEIGHT / 4 + unit.moveProgress * dx * this.TILE_WIDTH / 4;
                    }
                    else if(unit.moveState == MoveState.MOVE_IN) {
                        const dx = -unit.getDirectionX();
                        const dy = -unit.getDirectionY();

                        x += unit.moveProgress * dx * this.TILE_WIDTH / 4 - unit.moveProgress * dy * this.TILE_HEIGHT / 4;
                        y += unit.moveProgress * dy * this.TILE_HEIGHT / 4 + unit.moveProgress * dx * this.TILE_WIDTH / 4;
                    }

                    ctx.drawImage(this.workerImage, x, y);
                });
            }
        }

        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;

        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                const screenX = this.getScreenX(i, j);
                const screenY = this.getScreenY(i, j);

                this.tiles[i][j].units.forEach(unit => {
                    if(unit.selected) {
                        ctx.beginPath();
                        ctx.arc(screenX, screenY, 40, 0, 2 * Math.PI);
                        ctx.stroke();
                    }
                });
            }
        }

        const screenX = this.getScreenX(this.checkedTileX, this.checkedTileY);
        const screenY = this.getScreenY(this.checkedTileX, this.checkedTileY);
        
        if(this.tiles[this.checkedTileX][this.checkedTileY].building != null) {
            ctx.strokeStyle = "orange";
        }
        else {
            ctx.strokeStyle = "blue";
        }
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(screenX - this.TILE_WIDTH / 2, screenY);
        ctx.lineTo(screenX, screenY - this.TILE_HEIGHT / 2);
        ctx.lineTo(screenX + this.TILE_WIDTH / 2, screenY);
        ctx.lineTo(screenX, screenY + this.TILE_HEIGHT / 2);
        ctx.lineTo(screenX - this.TILE_WIDTH / 2, screenY);
        ctx.stroke();
    }

    moveMap(arrows) {
        if(arrows.up) {
            this.screenPosY -= this.MOVE_SPEED;
        }
        else if(arrows.down) {
            this.screenPosY += this.MOVE_SPEED;
        }

        if(arrows.left) {
            this.screenPosX -= this.MOVE_SPEED;
        }
        else if(arrows.right) {
            this.screenPosX += this.MOVE_SPEED;
        }
    }

    checkTile(screenX, screenY) {
        this.checkedTileX = this.getTileX(screenX, screenY);
        this.checkedTileY = this.getTileY(screenX, screenY);
    }

    addBuilding(building) {
        const i = building.posX;
        const j = building.posY;

        this.tiles[i][j].building = building;
        this.tiles[i][j].occupied = true;
    }

    addUnit(unit)
    {
        const i = unit.posX;
        const j = unit.posY;

        this.tiles[i][j].units.push(unit);
    }

    moveUnitToTile(unit, x, y)
    {
        const index = this.tiles[unit.posX][unit.posY].units.indexOf(unit);
        this.tiles[unit.posX][unit.posY].units.splice(index, 1);
        this.tiles[x][y].units.push(unit);

        unit.posX = x;
        unit.posY = y;
    }

    getPath(sx, sy, ex, ey)
    {
        function NodeRecord() {
            this.node = null;
            this.connection = null;
            this.costSoFar = 0;
        }

        let startRecord = new NodeRecord();
        startRecord.node = [sx, sy];

        let open = [];
        open.push(startRecord);
        let closed = [];

        let current;

        while(open.length > 0) {
            // Find the smallest element in the open list.
            /*current = open.reduce((accumulator, currentValue) => {
                currentValue.costSoFar < accumulator.costSoFar ? currentValue : accumulator;
            });*/
            current = open[0];
            for(let index = 0; index < open.length; index++) {
                if(open[index].costSoFar < current.costSoFar) {
                    current = open[index];
                }
            }

            // If it is the goal, then terminate.
            if(current.node[0] == ex && current.node[1] == ey)
                break;

            const i = current.node[0];
            const j = current.node[1];
            let connections = [];

            if(i >= 1)
            {
                if(j >= 1 && this.tiles[i-1][j-1].occupied == false) {
                    connections.push({ x: i-1, y: j-1, cost: Math.sqrt(2) });
                }
                if(this.tiles[i-1][j].occupied == false) {
                    connections.push({ x: i-1, y: j, cost: 1 });
                }
                if(j < this.tiles[0].length - 1 && this.tiles[i-1][+1].occupied == false) {
                    connections.push({ x: i-1, y: j+1, cost: Math.sqrt(2) });
                }
            }
            if(j >= 1 && this.tiles[i][j-1].occupied == false) {
                connections.push({ x: i, y: j-1, cost: 1 });
            }
            if(j < this.tiles[0].length  - 1 && this.tiles[i][j+1].occupied == false) {
                connections.push({ x: i, y: j+1, cost: 1 });
            }
            if(i < this.tiles.length - 1)
            {
                if(j >= 1 && this.tiles[i+1][j-1].occupied == false) {
                    connections.push({ x: i+1, y: j-1, cost: Math.sqrt(2) });
                }
                if(this.tiles[i+1][j].occupied == false) {
                    connections.push({ x: i+1, y: j, cost: 1 });
                }
                if(j < this.tiles[0].length - 1 && this.tiles[i+1][j+1].occupied == false) {
                    connections.push({ x: i+1, y: j+1, cost: Math.sqrt(2) });
                }
            }

            connections.forEach((connection) => {
                const endNodeCost = current.costSoFar + connection.cost;
                let endNodeRecord = null;

                if(closed.find((element) => {
                    element.node[0] == connection.x && element.node[1] == connection.y;
                })) {
                    return;
                }
                else if(open.find((element) => {
                    element.node[0] == connection.x && element.node[1] == connection.y;
                })) {
                    if(element.costSoFar <= endNodeCost) {
                        return;
                    }

                    endNodeRecord = element;
                }
                else {
                    endNodeRecord = new NodeRecord();
                    endNodeRecord.node = [connection.x, connection.y]
                }

                endNodeRecord.costSoFar = endNodeCost;
                endNodeRecord.connection = current;

                if(!open.find((element) => {
                    element.node == endNodeRecord.node;
                })) {
                    open.push(endNodeRecord);
                }
            });

            const removeIndex = open.find((element => {
                element.node == current.node;
            }));
            open.splice(removeIndex, 1);
            closed.push(current);
        }

        if(current.node[0] != ex || current.node[1] != ey) {
            console.log("null path");
            return null;
        }
        else {
            let path = [];

            while(current.node[0] != sx || current.node[1] != sy) {
                path.push(current.connection.node);

                current = current.connection;
            }

            path.reverse();
            path.push([ex, ey]);

            return path;
        }
    }
}

export { Map }