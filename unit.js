import { GameObject } from './game-object.js';

class UnitType {
    constructor(name) {
        this.name = name;
        this.speed = 2;
    }
}

UnitType.worker = new UnitType("worker");

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
    }

    setPath(path) {
        this.path = path;
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
        }
        else if(this.moveState == MoveState.MOVE_OUT) {
            this.moveProgress += this.type.speed * deltaTime;

            if(this.moveProgress >= 1) {
                this.moveProgress = 0;
                this.moveState = MoveState.MOVE_IN;

                map.moveUnitToTile(this, this.path[0][0], this.path[0][1]);
            }
        }
        else if(this.moveState == MoveState.MOVE_IN) {
            this.moveProgress += this.type.speed * deltaTime;

            if(this.moveProgress >= 1) {
                this.moveProgress = 0;
                this.moveState = MoveState.STAY;
                this.path.splice(0, 1);
            }
        }
    }

    getDirectionX() {
        if(this.path.length == 0)
            return 0;

        return this.path[0][0] - this.posX; 
    }

    getDirectionY() {
        if(this.path.length == 0)
            return 0;

        return this.path[0][1] - this.posY; 
    }
}

export { Unit, UnitType, MoveState }