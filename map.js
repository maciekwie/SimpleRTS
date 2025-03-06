import { BuildingType } from './building.js';
import { Tile, TileType } from './tile.js';
import { MoveState } from './unit.js';

class Map {
    constructor(width, height, assets) {
        this.width = width;
        this.height = height;

        this.assets = assets;

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

        this.buildingToPlace = {
            selectingPlace: false,
            notOccupied: false,
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
    }

    getScreenX(i, j) {
        return this.TILE_WIDTH * i / 2 + this.height * this.TILE_WIDTH / 2 - j * this.TILE_WIDTH / 2 - this.screenPosX;
    }

    getScreenY(i, j) {
        return (j - 1) * this.TILE_HEIGHT / 2 - this.width * this.TILE_HEIGHT / 2 + i * this.TILE_HEIGHT / 2 - this.screenPosY;
    }

    getScreenX_map(i, j) {
        return this.TILE_WIDTH * i / 2 + this.height * this.TILE_WIDTH / 2 - j * this.TILE_WIDTH / 2;
    }

    getScreenY_map(i, j) {
        return (j - 1) * this.TILE_HEIGHT / 2 - this.width * this.TILE_HEIGHT / 2 + i * this.TILE_HEIGHT / 2;
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
        const assets = this.assets;

        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                const screenX = this.getScreenX(i, j);
                const screenY = this.getScreenY(i, j);
    
                this.renderTerrainBack(ctx, screenX, screenY, this.tiles[i][j]);
                this.renderBuildings(ctx, screenX, screenY, this.tiles[i][j], i, j);
                this.renderUnits(ctx, screenX, screenY, this.tiles[i][j]);
                this.renderTerrainFront(ctx, screenX, screenY, this.tiles[i][j]);
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

        if(this.buildingToPlace.selectingPlace) {
            if(this.buildingToPlace.notOccupied) {
                ctx.strokeStyle = "blue";
            }
            else {
                ctx.strokeStyle = "red";
            }

            for(let i = 0; i < this.buildingToPlace.width; i++) {
                for(let j = 0; j < this.buildingToPlace.height; j++) {
                    const tileX = this.buildingToPlace.x + i;
                    const tileY = this.buildingToPlace.y + j;
                    const screenX = this.getScreenX(tileX, tileY);
                    const screenY = this.getScreenY(tileX, tileY);

                    ctx.beginPath();
                    ctx.moveTo(screenX - this.TILE_WIDTH / 2, screenY);
                    ctx.lineTo(screenX, screenY - this.TILE_HEIGHT / 2);
                    ctx.lineTo(screenX + this.TILE_WIDTH / 2, screenY);
                    ctx.lineTo(screenX, screenY + this.TILE_HEIGHT / 2);
                    ctx.lineTo(screenX - this.TILE_WIDTH / 2, screenY);
                    ctx.stroke();
                }
            }
        }
    }

    renderTerrainBack(ctx, screenX, screenY, tile) {
        const assets = this.assets;

        if(tile.type == TileType.GRASS) {
            ctx.drawImage(assets['grass'], screenX - this.TILE_WIDTH / 2, screenY - this.TILE_HEIGHT / 2);
        }
        else if(tile.type == TileType.STONE) {
            ctx.drawImage(assets['stone'], screenX - this.TILE_WIDTH / 2, screenY - this.TILE_HEIGHT / 2);
        }
        else if(tile.type == TileType.TREE) {
            ctx.drawImage(assets['grass'], screenX - this.TILE_WIDTH / 2, screenY - this.TILE_HEIGHT / 2);

            if(tile.treeSort == 1)
                ctx.drawImage(assets['tree1'], screenX - this.TILE_WIDTH, screenY - this.TILE_HEIGHT * 3);
            else if(tile.treeSort == 2)
                ctx.drawImage(assets['tree2'], screenX - this.TILE_WIDTH, screenY - this.TILE_HEIGHT * 3);
            else if(tile.treeSort == 3)
                ctx.drawImage(assets['tree3'], screenX - this.TILE_WIDTH, screenY - this.TILE_HEIGHT * 3);
        }
        else if(tile.type == TileType.GROWING_CROPS) {
            ctx.drawImage(assets['growing_crops_back'], screenX - this.TILE_WIDTH / 2, screenY - this.TILE_HEIGHT / 2 - assets.cropsHeight);
        }
        else if(tile.type == TileType.CROPS) {
            ctx.drawImage(assets['crops_back'], screenX - this.TILE_WIDTH / 2, screenY - this.TILE_HEIGHT / 2 - assets.cropsHeight );
        }
    }

    renderTerrainFront(ctx, screenX, screenY, tile) {
        const assets = this.assets;

        if(tile.type == TileType.GROWING_CROPS) {
            ctx.drawImage(assets['growing_crops_front'], screenX - this.TILE_WIDTH / 2, screenY - this.TILE_HEIGHT / 2 - assets.cropsHeight );
        }
        else if(tile.type == TileType.CROPS) {
            ctx.drawImage(assets['crops_front'], screenX - this.TILE_WIDTH / 2, screenY - this.TILE_HEIGHT / 2 - assets.cropsHeight );
        }
    }

    renderBuildings(ctx, screenX, screenY, tile, i, j) {
        const assets = this.assets;

        if(tile.building != null) {
            const buildingPartX = i - tile.building.posX + 1;
            const buildingPartY = j - tile.building.posY + 1;
            const type = tile.building.type;

            if(tile.building.type === BuildingType.millType) {
                let frame = tile.building.currentAnimation.frames[tile.building.currentFrame];

                let frontSlice = type.height - buildingPartY;
                let sideSlice = type.width - buildingPartX;

                if(buildingPartX == type.width)
                {
                    const sx = frame.x + frontSlice * (this.TILE_WIDTH / 2) + this.TILE_WIDTH / 2 + (type.width - 1) * (this.TILE_WIDTH / 2);
                    const sy = frame.y;
                    const sw = this.TILE_WIDTH / 2;
                    const sh = frame.height;
                    const dx = screenX;
                    const dy = screenY - frame.height + frontSlice * (this.TILE_HEIGHT / 2) + this.TILE_HEIGHT / 2;;
                    ctx.drawImage(type.image, sx, sy, sw, sh, dx, dy, this.TILE_WIDTH / 2, frame.height);
                }
                if(buildingPartY == type.height)
                {
                    const sx = frame.x + (type.width - 1) * (this.TILE_WIDTH / 2)- sideSlice * (this.TILE_WIDTH / 2);
                    const sy = frame.y;
                    const sw = this.TILE_WIDTH / 2;
                    const sh = frame.height;
                    const dx = screenX - this.TILE_WIDTH / 2;
                    const dy = screenY - frame.height + sideSlice * (this.TILE_HEIGHT / 2) + this.TILE_HEIGHT / 2;
                    ctx.drawImage(type.image, sx, sy, sw, sh, dx, dy, this.TILE_WIDTH / 2, frame.height);
                }
            }
            else {
                let frontSlice = type.height - buildingPartY;
                let sideSlice = type.width - buildingPartX;

                if(buildingPartX == type.width)
                {
                    const sx = frontSlice * (this.TILE_WIDTH / 2) + this.TILE_WIDTH / 2 + (type.width - 1) * (this.TILE_WIDTH / 2);
                    const sy = 0;
                    const sw = this.TILE_WIDTH / 2;
                    const sh = type.image.height;
                    const dx = screenX;
                    const dy = screenY - type.image.height + frontSlice * (this.TILE_HEIGHT / 2) + this.TILE_HEIGHT / 2;;
                    ctx.drawImage(type.image, sx, sy, sw, sh, dx, dy, this.TILE_WIDTH / 2, type.image.height);
                }
                if(buildingPartY == type.height)
                {
                    const sx = (type.width - 1) * (this.TILE_WIDTH / 2)- sideSlice * (this.TILE_WIDTH / 2);
                    const sy = 0;
                    const sw = this.TILE_WIDTH / 2;
                    const sh = type.image.height;
                    const dx = screenX - this.TILE_WIDTH / 2;
                    const dy = screenY - type.image.height + sideSlice * (this.TILE_HEIGHT / 2) + this.TILE_HEIGHT / 2;
                    ctx.drawImage(type.image, sx, sy, sw, sh, dx, dy, this.TILE_WIDTH / 2, type.image.height);
                }
            }
        }
    }

    renderUnits(ctx, screenX, screenY, tile) {
        const assets = this.assets;

        tile.units.forEach(unit => {
            let frame = unit.animationManager.currentAnimation.frames[unit.animationManager.currentFrame];

            let x = screenX - frame.width / 2;
            let y = screenY - frame.height / 2 - this.TILE_HEIGHT / 2;

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

            ctx.drawImage(unit.animationManager.atlasImage, frame.x, frame.y, frame.width, frame.height, x, y, frame.width, frame.height);
        });
    }

    renderArrows(ctx, arrows) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        
        for(let i = 0; i < arrows.length; i++) {
            if(arrows[i].active) {
                const length = 0.6 / arrows[i].distance;
                const startX = arrows[i].startX - 0.5;
                const startY = arrows[i].startY - 0.8;
                const dx = arrows[i].targetX - startX; 
                const dy = arrows[i].targetY - startY; 
                const sx = this.getScreenX(startX + dx * arrows[i].progress, startY + dy * arrows[i].progress);
                const sy = this.getScreenY(startX + dx * arrows[i].progress, startY + dy * arrows[i].progress);
                const tx = this.getScreenX(startX + dx * (arrows[i].progress + length), startY + dy * (arrows[i].progress + length));
                const ty = this.getScreenY(startX + dx * (arrows[i].progress + length), startY + dy * (arrows[i].progress + length));
                
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(tx, ty);
                ctx.stroke();
            }
        }
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
        const x = building.posX;
        const y = building.posY;

        for(let i = 0; i < building.type.width; i++) {
            for(let j = 0; j < building.type.height; j++) {
                this.tiles[x + i][y + j].building = building;
                this.tiles[x + i][y + j].occupied = true;
            }
        }
    }

    addUnit(unit) {
        const i = unit.posX;
        const j = unit.posY;

        this.tiles[i][j].units.push(unit);
    }

    placeBuilding(screenX, screenY, buildingType) {
        this.buildingToPlace.x = this.getTileX(screenX, screenY);
        this.buildingToPlace.y = this.getTileY(screenX, screenY);
        this.buildingToPlace.width = buildingType.width;
        this.buildingToPlace.height = buildingType.height;

        this.buildingToPlace.selectingPlace = true;
    }

    discardPlacingBuilding() {
        this.buildingToPlace.selectingPlace = false;
    }

    checkIfPlaceOccupied() {
        for(let i = 0; i < this.buildingToPlace.width; i++) {
            for(let j = 0; j < this.buildingToPlace.height; j++) {
                const tileX = this.buildingToPlace.x + i;
                const tileY = this.buildingToPlace.y + j;

                if(this.tiles[tileX][tileY].type != TileType.GRASS ||
                    this.tiles[tileX][tileY].occupied ||
                    this.tiles[tileX][tileY].units.length != 0) {
                    this.buildingToPlace.notOccupied = false;

                    return;
                }
            }
        }

        this.buildingToPlace.notOccupied = true;
    }

    placeTree(x, y) {
        this.tiles[x][y].type = TileType.TREE;
        this.tiles[x][y].treeSort = Math.round(1 + Math.random() * 2);
    }

    placeStone(x, y) {
        this.tiles[x][y].type = TileType.STONE;
    }

    plantCrops(x, y)  {
        this.tiles[x][y].type = TileType.GROWING_CROPS;
        this.tiles[x][y].status = 0;
    }

    growCrops(x, y, growRate)  {
        if(this.tiles[x][y].type != TileType.GROWING_CROPS)
            return false;

        this.tiles[x][y].status += growRate;

        if(this.tiles[x][y].status >= 1) {
            this.tiles[x][y].status = 1;
            this.tiles[x][y].type = TileType.CROPS;

            return true;
        }

        return false;
    }

    moveUnitToTile(unit, x, y) {
        const index = this.tiles[unit.posX][unit.posY].units.indexOf(unit);
        this.tiles[unit.posX][unit.posY].units.splice(index, 1);
        this.tiles[x][y].units.push(unit);

        unit.posX = x;
        unit.posY = y;
    }

    getEnemies(x, y, playerName) {
        return this.tiles[x][y].units.filter((unit) => unit.player != playerName);
    }

    deleteUnit(unit) {
        const x = unit.posX;
        const y = unit.posY;

        const index = this.tiles[x][y].units.indexOf(unit);
        if (index > -1) { 
            this.tiles[x][y].units.splice(index, 1);
        }
    }

    getPath(startRow, startCol, endRow, endCol) {
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