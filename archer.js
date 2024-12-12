import { Unit, UnitType } from './unit.js'
import { ArcherAnimationManager, ArcherAnimationState } from './archer-animation-manager.js'

const ArcherAction = {
    IDLE: Symbol("idle"),
    SHOOT: Symbol("shoot")
};
Object.freeze(ArcherAction);

class Archer extends Unit {
    constructor(posX, posY) {
        super(UnitType.worker, posX, posY);

        this.animationManager = new ArcherAnimationManager();

        this.action = ArcherAction.IDLE;
    }

    SetAction(action) {
        this.action = action;
    }

    startWalking() {
        this.animationManager.setAnimationState(ArcherAnimationState.WALK);
    }

    destinationReached() {
        this.animationManager.setAnimationState(ArcherAnimationState.STAY);
    }
}

export { Archer, ArcherAction }