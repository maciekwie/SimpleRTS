import { Unit, UnitType } from './unit.js'
import { SpearmanAnimationManager, SpearmanAnimationState } from './spearman-animation-manager.js'

const SpearmanAction = {
    IDLE: Symbol("idle"),
    ATTACK: Symbol("attack")
};
Object.freeze(SpearmanAction);

class Spearman extends Unit {
    constructor(posX, posY) {
        super(UnitType.spearman, posX, posY);

        this.animationManager = new SpearmanAnimationManager(UnitType.spearman.animations);

        this.action = SpearmanAction.IDLE;
    }

    startWalking() {
        this.animationManager.setAnimationState(SpearmanAnimationState.WALK);
    }

    destinationReached() {
        if(this.action === SpearmanAction.ATTACK) {
            this.animationManager.setAnimationState(SpearmanAnimationState.HIT);
        }
        else {
            this.animationManager.setAnimationState(SpearmanAnimationState.STAY);
        }
    }
}

export { Spearman, SpearmanAction }