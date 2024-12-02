import { BuildingType } from './building.js';
import { Tile, TileType } from './tile.js'
import { MoveState } from './unit.js'
import { AssetManager } from './asset-manager.js';

class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.screenPosX = 0;
        this.screenPosY = 0;

        this.TILE_WIDTH = 128;
        this.TILE_HEIGHT = 64;

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
                    ctx.drawImage(AssetManager.grassImage, screenX - this.TILE_WIDTH, screenY);
                }
                else if(this.tiles[i][j].type == TileType.STONE) {
                    ctx.drawImage(AssetManager.stoneImage, screenX - this.TILE_WIDTH, screenY);
                }
                else if(this.tiles[i][j].type == TileType.TREE) {
                    ctx.drawImage(AssetManager.grassImage, screenX - this.TILE_WIDTH, screenY);

                    if(this.tiles[i][j].treeSort == 1)
                        ctx.drawImage(AssetManager.tree1Image, screenX - this.TILE_WIDTH, screenY - this.TILE_HEIGHT * 3);
                    else if(this.tiles[i][j].treeSort == 2)
                        ctx.drawImage(AssetManager.tree2Image, screenX - this.TILE_WIDTH, screenY - this.TILE_HEIGHT * 3);
                    else if(this.tiles[i][j].treeSort == 3)
                        ctx.drawImage(AssetManager.tree3Image, screenX - this.TILE_WIDTH, screenY - this.TILE_HEIGHT * 3);
                }

                if(this.tiles[i][j].building != null) {
                    if(this.tiles[i][j].building.type === BuildingType.houseType) {
                        ctx.drawImage(AssetManager.houseImage, screenX - AssetManager.houseImage.width / 2, screenY - AssetManager.houseImage.height / 2 - this.TILE_HEIGHT / 2);
                    }
                    else if(this.tiles[i][j].building.type === BuildingType.millType) {
                        let frame = this.tiles[i][j].building.currentAnimation.frames[this.tiles[i][j].building.currentFrame];

                        ctx.drawImage(AssetManager.millImage, frame.x, frame.y, frame.width, frame.height, 
                            screenX - frame.width / 2, screenY - frame.height / 2 - this.TILE_HEIGHT * 1.5, 
                            frame.width, frame.height);
                    }
                }

                this.tiles[i][j].units.forEach(unit => {
                    let x = screenX - AssetManager.workerImage.width / 2;
                    let y = screenY - AssetManager.workerImage.height / 2 - this.TILE_HEIGHT / 2;

                    if(unit.moveState == MoveState.MOVE_OUT) {
                        const dx = unit.getDirectionX();
                        const dy = unit.getDirectionY();

                        x += -unit.moveProgress * dx * this.TILE_WIDTH / 4 + unit.moveProgress * dy * this.TILE_WIDTH / 4;
                        y += unit.moveProgress * dx * this.TILE_HEIGHT / 4 + unit.moveProgress * dy * this.TILE_HEIGHT / 4;
                    }
                    else if(unit.moveState == MoveState.MOVE_IN) {
                        const dx = -unit.getDirectionX();
                        const dy = -unit.getDirectionY();
                        
                        x += -(1 - unit.moveProgress) * dx * this.TILE_WIDTH / 4 + (1 - unit.moveProgress)  * dy * this.TILE_WIDTH / 4;
                        y += (1 - unit.moveProgress) * dx * this.TILE_HEIGHT / 4 + (1 - unit.moveProgress) * dy * this.TILE_HEIGHT / 4;
 
                    }

                    ctx.drawImage(AssetManager.workerImage, x, y);
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
                        ctx.arc(screenX, screenY, 15, 0, 2 * Math.PI);
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

    placeTree(x, y)
    {
        this.tiles[x][y].type = TileType.TREE;
        this.tiles[x][y].treeSort = Math.round(1 + Math.random() * 2);
    }

    placeStone(x, y)
    {
        this.tiles[x][y].type = TileType.STONE;
    }

    moveUnitToTile(unit, x, y)
    {
        const index = this.tiles[unit.posX][unit.posY].units.indexOf(unit);
        this.tiles[unit.posX][unit.posY].units.splice(index, 1);
        this.tiles[x][y].units.push(unit);

        unit.posX = x;
        unit.posY = y;
    }

    getPath(startRow, startCol, endRow, endCol)
    {
        const numRows = this.tiles.length;
        const numCols = this.tiles[0].length;

        // Initialize distance, previous, and visited matrices
        const distances = [];
        const previous = [];
        const visited = [];

        for (let i = 0; i < numRows; i++) {
            distances[i] = [];
            previous[i] = [];
            visited[i] = [];
            for (let j = 0; j < numCols; j++) {
                distances[i][j] = Infinity;
                previous[i][j] = null;
                visited[i][j] = false;
            }
        }

        distances[startRow][startCol] = 0;

        const queue = [];
        queue.push({ position: [startRow, startCol], distance: 0 });

        while(queue.length > 0) {
            // Sort the queue based on distance
            queue.sort((a, b) => a.distance - b.distance);

            // Dequeue the node with the smallest distance
            const current = queue.shift();
            const [row, col] = current.position;

            if (visited[row][col]) {
                continue;
              }
            visited[row][col] = true;

            // If we've reached the end node, reconstruct the path
            if (row === endRow && col === endCol) {
                const path = [];
                let currPos = [row, col];

                while (currPos) {
                    path.push(currPos);
                    currPos = previous[currPos[0]][currPos[1]];
                }
                path.reverse();

                return path;
            }

            const i = row;
            const j = col;
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

            for (const connection of connections) {
                const nRow = connection.x;
                const nCol = connection.y;
                const tile = this.tiles[nRow][nCol];
          
                // Skip if the tile is occupied or impassable
                if (tile.occupied) {
                  continue;
                }
          
                const altDistance = distances[row][col] + connection.cost;
          
                if (altDistance < distances[nRow][nCol]) {
                    distances[nRow][nCol] = altDistance;
                    previous[nRow][nCol] = [row, col];
                    queue.push({ position: [nRow, nCol], distance: altDistance });
                }
            }
        }

        // Return null if no path is found
        return null;
    }
}

export { Map }