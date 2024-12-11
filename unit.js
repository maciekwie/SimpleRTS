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

        this.selected = false;

        this.path = [];
        this.moveState = MoveState.STAY;
        this.moveProgress = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.diagonalDirection = false;

        this.animationManager = null;
    }

    nextFrame()
    {
        this.animationManager.nextFrame();
    }

    setPath(path) {
        this.path = path;

        this.startWalking();
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

    startWalking() {
    }

    getDirectionX() {
        return this.directionY; 
    }

    getDirectionY() {
        return this.directionX; 
    }
}

export { Unit, UnitType, MoveState }