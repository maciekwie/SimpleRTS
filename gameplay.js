import { Map } from './map.js';
import { Building, BuildingType } from './building.js';
import { UnitType } from './unit.js';
import { WorkerUnit, WorkerAction } from './worker-unit.js';
import { Spearman, SpearmanAction } from './spearman.js';
import { Archer, ArcherAction } from './archer.js';
import { TileType } from './tile.js';

class Arrow {
    static SPEED = 8;

    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.damage = 0;
        this.progress = 0;
        this.distance = 0;

        this.active = false;
    }

    activate(startX, startY, targetX, targetY, damage) {
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.progress = 0;
        this.distance = distance(startX, startY, targetX, targetY);

        this.active = true;
    }

    exec(deltatTime) {
        this.progress += Arrow.SPEED / this.distance * deltatTime;
    }
}

class Gameplay {
    static CROPS_GROW_RATE = 0.1;

    static WOOD_INCREMENT = 5;
    static STONE_INCREMENT = 5;
    static FOOD_INCREMENT = 5;

    constructor(params, loader) {
        this.assets = loader.assets;

        this.map = new Map(params.mapWidth, params.mapHeight, loader.assets);

        this.players = [];
        this.buildings = [];
        this.units = [];
        this.growingCrops = [];

        BuildingType.houseType.image = loader.assets['house'];
        BuildingType.houseType.width = 3;
        BuildingType.houseType.height = 3;
        BuildingType.houseType.cost = { wood: 10, stone: 5, food: 0, money: 0 };

        BuildingType.millType.image = loader.assets['windmill_atlas'];
        BuildingType.millType.width = 2;
        BuildingType.millType.height = 3;
        BuildingType.millType.cost = { wood: 20, stone: 10, food: 0, money: 100 };

        BuildingType.storehouseType.image = loader.assets['storehouse'];
        BuildingType.storehouseType.width = 1;
        BuildingType.storehouseType.height = 3;
        BuildingType.storehouseType.cost = { wood: 20, stone: 0, food: 0, money: 100 };

        BuildingType.barracksType.image = loader.assets['barracks'];;
        BuildingType.barracksType.width = 3;
        BuildingType.barracksType.height = 2;
        BuildingType.barracksType.cost = { wood: 10, stone: 50, food: 10, money: 1000 };

        UnitType.worker.animations = this.assets.workerAnimations;
        UnitType.spearman.animations = this.assets.spearmanAnimations;
        UnitType.archer.animations = this.assets.archerAnimations;

        this.arrows = [];
        for(let i = 0; i < 100; i++) {
            this.arrows.push(new Arrow());
        }
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

    addPlayer(player) {
        this.players.push(player);
    }

    exec (deltaTime, time) {
        this.units.forEach(unit => {
            unit.move(deltaTime, this.map);
            unit.exec(deltaTime, time, this);
            
            unit.nextFrame();
        });

        for(let i = 0; i < this.growingCrops.length; i++) {
            const pos = this.growingCrops[i];
            if(this.map.growCrops(pos.x, pos.y, Gameplay.CROPS_GROW_RATE * deltaTime)) {
                this.growingCrops.splice(i, 1);
            }
        }

        for(let i = 0; i < this.arrows.length; i++) {
            if(this.arrows[i].active) {
                this.arrows[i].exec(deltaTime);

                if(this.arrows[i].progress >= 1) {
                    this.arrowHit(this.arrows[i].targetX, this.arrows[i].targetY, this.arrows[i].damage);
                    this.arrows[i].active = false;
                }
            }
        }
    }

    render(ctx) {
        this.map.render(ctx);
        this.map.renderArrows(ctx, this.arrows);
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
        let workerAction = WorkerAction.GO_TO_DEST;
        if(this.map.tiles[x][y].type === TileType.TREE)
            workerAction = WorkerAction.GO_CUT;
        else if(this.map.tiles[x][y].type === TileType.STONE)
            workerAction = WorkerAction.GO_MINE;
        else if(this.map.tiles[x][y].type === TileType.CROPS)
            workerAction = WorkerAction.GO_HARVEST;

        let attack = false;
        let targetUnit = null;

        for(let i = 0; i < this.map.tiles[x][y].units.length; i++) {
            if(this.map.tiles[x][y].units[i].player != this.playerName) {
                attack = true;
                targetUnit = this.map.tiles[x][y].units[i];

                break;
            }
        }

        let spearmanAction = SpearmanAction.IDLE
        let archerAction = ArcherAction.IDLE;
        if(attack) {
            spearmanAction = SpearmanAction.GO_ATTACK;
            archerAction = ArcherAction.GO_ATTACK;
        }

        this.units.forEach(unit => {
            if(unit.selected) {
                const path = this.map.getPath(unit.posX, unit.posY, x, y);
                unit.setPath(path);
                unit.setDestination(x, y);

                if(unit.type === UnitType.worker) {
                    unit.setAction(workerAction);
                }
                else if(unit.type === UnitType.spearman)  {
                    unit.setAction(spearmanAction);
                }
                else if(unit.type === UnitType.archer) {
                    unit.setAction(archerAction);
                    if(attack) {
                        unit.setTargetUnit(targetUnit);
                    }
                }
            }
        });
    }

    hitUnits(attackingUnit, damage) {
        const player = attackingUnit.player;
        const posX = attackingUnit.posX;
        const posY = attackingUnit.posY;

        let enemies = this.map.getEnemies(posX, posY, player);
        if(enemies.length == 0)
            return;

        let index = Math.floor(Math.random() * enemies.length);
        enemies[index].health -= damage;
        enemies[index].unitAttacked();

        if(enemies[index].health <= 0) {
            if(enemies.length === 1) {
                attackingUnit.enemiesDefeated();
            }

            this.destroyUnit(enemies[index]);
        }
    }

    arrowHit(targetX, targetY, damage) {
        let units = this.map.tiles[targetX][targetY].units;

        if(units.length == 0)
            return;
    
        let index = Math.floor(Math.random() * units.length);
        units[index].health -= damage;
        units[index].unitAttacked();

        if(units[index].health <= 0) {
            this.destroyUnit(units[index]);
        }
    }

    shootArrow(startX, startY, targetX, targetY, damage) {
        for(let i = 0; i < this.arrows.length; i++) {
            if(this.arrows[i].active === false) {
                this.arrows[i].activate(startX, startY, targetX, targetY, damage);

                break;
            }
        }
    }

    getNearestBuilding(type, x, y, player) {
        const buildingsArr = this.buildings.filter((building) => building.type === type && building.player === player);    
        
        if(buildingsArr.length == 0)
            return null;
        else if(buildingsArr.length == 1)
            return buildingsArr[0];
        
        let building = buildingsArr[0];
        let dist = distance(x, y, building.posX, building.posY);

        for(let i = 1; i < buildingsArr.length; i++) {
            let newBuilding = buildingsArr[i];
            let newDist = distance(x, y, newBuilding.posX, newBuilding.posY);

            if(newDist < dist) {
                dist = newDist;
                building = newBuilding;
            }
        }

        return building;
    }

    addWood(playerName, amount) {
        if(amount === undefined)
            amount = Gameplay.WOOD_INCREMENT;

        for(let player of this.players) {
            if(player.playerName === playerName) {
                player.resources.wood += amount;
                break;
            }
        }

        if(playerName == this.playerName)
            this.updateResourcesBar();
    }

    addStone(playerName, amount) {
        if(amount === undefined)
            amount = Gameplay.STONE_INCREMENT;

        for(let player of this.players) {
            if(player.playerName === playerName) {
                player.resources.stone += amount;
                break;
            }
        }

        if(playerName == this.playerName)
            this.updateResourcesBar();
    }

    addFood(playerName, amount) {
        if(amount === undefined)
            amount = Gameplay.FOOD_INCREMENT;

        for(let player of this.players) {
            if(player.playerName === playerName) {
                player.resources.food += amount;
                break;
            }
        }

        if(playerName == this.playerName)
            this.updateResourcesBar();
    }

    addMoney(playerName, amount) {
        for(let player of this.players) {
            if(player.playerName === playerName) {
                player.resources.food += amount;
                break;
            }
        }

        if(playerName == this.playerName)
            this.updateResourcesBar();
    }

    addBuilding(type, posX, posY, player) {
        let building = new Building(type, posX, posY);
        building.player = player;

        if(type === BuildingType.millType) {
            building.currentAnimation = this.assets.millAnimations['mill'];
        }

        this.buildings.push(building);
        this.map.addBuilding(building);

        let resources = this.players.find((item) => item.playerName === player).resources;
        resources.wood -= type.cost.wood;
        resources.stone -= type.cost.stone;
        resources.food -= type.cost.food;
        resources.money -= type.cost.money;

        if(player == this.playerName)
            this.updateResourcesBar();
    }

    addUnit(type, posX, posY, player) {
        let unit;

        if(type === UnitType.worker) {
            unit = new WorkerUnit(posX, posY);
            unit.animationManager.atlasImage = this.assets['worker_atlas'];
        }
        if(type === UnitType.spearman){
            unit = new Spearman(posX, posY);
            unit.animationManager.atlasImage = this.assets['spearman_atlas'];
        }
        if(type === UnitType.archer) {
            unit = new Archer(posX, posY);
            unit.animationManager.atlasImage = this.assets['archer_atlas'];
        }

        unit.player = player;

        this.units.push(unit);
        this.map.addUnit(unit);
    }

    plantCrops(posX, posY) {
        this.growingCrops.push({ x: posX, y: posY });
        this.map.plantCrops(posX, posY);
    }

    destroyUnit(unit) {
        this.map.deleteUnit(unit);

        const index = this.units.indexOf(unit);
        this.units.splice(index, 1);
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

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export { Gameplay, distance }