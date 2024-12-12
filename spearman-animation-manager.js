import { UnitAnimationManager } from './unit-animation-manager.js' 

const SpearmanAnimationState = {
    STAY: Symbol("stay"),
    WALK: Symbol("walk"),
    HIT: Symbol("hit")
};
Object.freeze(SpearmanAnimationState);

class SpearmanAnimationManager extends UnitAnimationManager {
    constructor(animations) {
        super();

        this.animations = animations;

        this.currentAnimation = this.animations["spearman_stand_000"];
        this.state = SpearmanAnimationState.STAY;
    }

    updateState() {
        if(this.state === SpearmanAnimationState.WALK) {
            const animName = "spearman_walk_" + String(this.direction).padStart(3, '0');;
            this.currentAnimation = this.animations[animName];
        }
    }

    setAnimationState(state)
    {
        this.state = state;

        let animName = "";
        if(state === SpearmanAnimationState.STAY) {
            animName = "spearman_stand_" + String(this.direction).padStart(3, '0');;
        }
        else if(state === SpearmanAnimationState.WALK) {
            animName = "spearman_walk_" + String(this.direction).padStart(3, '0');;
        }
        else if(state === SpearmanAnimationState.HIT) {
            animName = "spearman_hit_" + String(this.direction).padStart(3, '0');;
        } 

        this.currentAnimation = this.animations[animName];
    }
}

export { SpearmanAnimationManager, SpearmanAnimationState }