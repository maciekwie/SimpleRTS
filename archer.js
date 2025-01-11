import { Unit, UnitType } from './unit.js'
import { ArcherAnimationManager, ArcherAnimationState } from './archer-animation-manager.js'

const ArcherAction = {
    IDLE: Symbol("idle"),
    SHOOT: Symbol("shoot"),
    ATTACK: Symbol("attack")
};
Object.freeze(ArcherAction);

class Archer extends Unit {
    constructor(posX, posY) {
        super(UnitType.archer, posX, posY);

        this.animationManager = new ArcherAnimationManager(UnitType.archer.animations);

        this.action = ArcherAction.IDLE;
    }

    exec(deltaTime, map) {
        if(this.action === ArcherAction.SHOOT && this.targetUnit != null)
        {
            this.directionX = this.targetUnit.posX - this.posX;
            this.directionY = this.targetUnit.posY - this.posY;

            this.animationManager.setDirection(this.directionX, this.directionY);
            this.animationManager.updateState();
        }
    }

    startWalking() {
        this.animationManager.setAnimationState(ArcherAnimationState.WALK);
    }

    destinationReached() {
        this.animationManager.setAnimationState(ArcherAnimationState.STAY);
    }

    destinationNear() {
        if(this.action === ArcherAction.ATTACK) {
            this.stopWalking();

            this.action = ArcherAction.SHOOT;
            this.animationManager.setAnimationState(ArcherAnimationState.SHOOT);
        }
    }
}

export { Archer, ArcherAction }