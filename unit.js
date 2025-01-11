import { GameObject } from './game-object.js';

class UnitType {
    constructor(name) {
        this.name = name;
        this.speed = 2;
    }
}

UnitType.worker = new UnitType("worker");
UnitType.spearman = new UnitType("spearman");
UnitType.archer = new UnitType("archer");

const MoveState = {
    STAY: Symbol("stay"),
    MOVE_IN: Symbol("move_in"),
    MOVE_OUT: Symbol("move_out")
};
Object.freeze(MoveState);

class Unit extends GameObject{
    constructor(type, posX, posY) {
        super(posX, posY);

        this.type = type;

        this.player = "";

        this.selected = false;

        this.path = [];
        this.destinationX = 0;
        this.destinationY = 0;
        this.moveState = MoveState.STAY;
        this.moveProgress = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.diagonalDirection = false;

        this.animationManager = null;

        Unit.DISTANCE_TRIGGER = 6;

        this.targerUnit = null;
    }

    exec(deltaTime, map) {
    }

    nextFrame() {
        this.animationManager.nextFrame();
    }

    setPath(path) {
        this.path = path;

        this.startWalking();
    }

    setDestination(destX, destY) {
        this.destinationX = destX;
        this.destinationY = destY;
    }

    setTargetUnit(unit) {
        this.targetUnit = unit;
    }

    setAction(action) {
        this.action = action;
    }

    move(deltaTime, map) {
        if(this.path.length == 0)
        {
            this.moveState = MoveState.STAY;
            return;
        }

        if(this.moveState == MoveState.STAY)
        {
            this.moveState = MoveState.MOVE_OUT;

            this.path.splice(0, 1);

            if(this.path.length == 0) {
                this.moveState = MoveState.STAY;

                this.destinationReached();

                return;
            }
            this.directionX = this.path[0][0] - this.posX;
            this.directionY = this.path[0][1] - this.posY;

            this.animationManager.setDirection(this.directionX, this.directionY);
            this.animationManager.updateState();

            if(this.directionX + this.directionY == 1 || this.directionX + this.directionY == -1)
                this.diagonalDirection = false;
            else
                this.diagonalDirection = true;

            if(distance(this.destinationX, this.destinationY, this.posX, this.posY) <= Unit.DISTANCE_TRIGGER) {
                this.destinationNear();
            }
        }
        else if(this.moveState == MoveState.MOVE_OUT) {
            if(this.diagonalDirection)
                this.moveProgress += this.type.speed * deltaTime * (1 / Math.sqrt(2));
            else
                this.moveProgress += this.type.speed * deltaTime;

            if(this.moveProgress >= 1) {
                this.moveProgress = 0;
                this.moveState = MoveState.MOVE_IN;

                map.moveUnitToTile(this, this.path[0][0], this.path[0][1]);
            }
        }
        else if(this.moveState == MoveState.MOVE_IN) {
            if(this.diagonalDirection)
                this.moveProgress += this.type.speed * deltaTime * (1 / Math.sqrt(2));
            else
                this.moveProgress += this.type.speed * deltaTime;

            if(this.moveProgress >= 1) {
                this.moveProgress = 0;
                this.moveState = MoveState.STAY;
            }
        }
    }

    destinationReached() {
    }

    destinationNear() {
    }

    startWalking() {
    }

    stopWalking() {
        this.path.length = 0;
        this.moveState = MoveState.STAY;
    }

    getDirectionX() {
        return this.directionY; 
    }

    getDirectionY() {
        return this.directionX; 
    }
}

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export { Unit, UnitType, MoveState }