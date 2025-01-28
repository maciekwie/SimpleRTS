import { Unit, UnitType } from './unit.js'
import { SpearmanAnimationManager, SpearmanAnimationState } from './spearman-animation-manager.js'

const SpearmanAction = {
    IDLE: Symbol("idle"),
    GO_ATTACK: Symbol("go attack"),
    FIGHT: Symbol("fight")
};
Object.freeze(SpearmanAction);

class Spearman extends Unit {
    static HIT_RATE = 3;
    static DAMAGE = 0.1;

    constructor(posX, posY) {
        super(UnitType.spearman, posX, posY);

        this.animationManager = new SpearmanAnimationManager(UnitType.spearman.animations);

        this.action = SpearmanAction.IDLE;
        this.lastHitTime = 0;
    }

    exec(deltaTime, time, gameplay) {
        if(this.action === SpearmanAction.FIGHT)
        {
            if(time - this.lastHitTime > 1 / Spearman.HIT_RATE)
            {
                gameplay.hitUnits(this, Spearman.DAMAGE);
                this.lastHitTime = time;
                this.animationManager.setAnimationState(SpearmanAnimationState.HIT);
            }
        }
    }

    setAction(action) {
        this.action = action;
    }

    startWalking() {
        this.animationManager.setAnimationState(SpearmanAnimationState.WALK);
    }

    destinationReached() {
        if(this.action === SpearmanAction.GO_ATTACK) {
            this.setAction(SpearmanAction.FIGHT);
            this.animationManager.setAnimationState(SpearmanAnimationState.HIT);
        }
        else {
            this.animationManager.setAnimationState(SpearmanAnimationState.STAY);
        }
    }

    unitAttacked() {
        this.setAction(SpearmanAction.FIGHT);
        this.animationManager.setAnimationState(SpearmanAnimationState.HIT);
    }

    enemiesDefeated() {
        this.setAction(SpearmanAction.IDLE);
        this.animationManager.setAnimationState(SpearmanAnimationState.STAY);
    }
}

export { Spearman, SpearmanAction }