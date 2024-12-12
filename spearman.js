import { Unit, UnitType } from './unit.js'
import { SpearmanAnimationManager, SpearmanAnimationState } from './spearman-animation-manager.js'

const SpearmanAction = {
    IDLE: Symbol("idle"),
    HIT: Symbol("hit")
};
Object.freeze(SpearmanAction);

class Spearman extends Unit {
    constructor(posX, posY) {
        super(UnitType.worker, posX, posY);

        this.animationManager = new SpearmanAnimationManager(UnitType.spearman.animations);

        this.action = SpearmanAction.IDLE;
    }

    SetAction(action) {
        this.action = action;
    }

    startWalking() {
        this.animationManager.setAnimationState(SpearmanAnimationState.WALK);
    }

    destinationReached() {
        if(this.action === SpearmanAction.HIT) {
            this.animationManager.setAnimationState(SpearmanAnimationState.HIT);
        }
        else {
            this.animationManager.setAnimationState(SpearmanAnimationState.STAY);
        }
    }
}

export { Spearman, SpearmanAction }