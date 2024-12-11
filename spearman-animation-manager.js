
import { AssetManager } from './asset-manager.js';
import { UnitAnimationManager } from './unit-animation-manager.js' 

const SpearmanAnimationState = {
    STAY: Symbol("stay"),
    WALK: Symbol("walk"),
    HIT: Symbol("hit")
};
Object.freeze(SpearmanAnimationState);

class SpearmanAnimationManager extends UnitAnimationManager {
    constructor() {
        super();

        this.atlasImage = AssetManager.spearmanAtlasImage;

        this.currentAnimation = AssetManager.spearmanAnimations["spearman_stand_000"];
        this.state = SpearmanAnimationState.STAY;
    }

    updateState() {
        if(this.state === SpearmanAnimationState.WALK) {
            const animName = "spearman_walk_" + String(this.direction).padStart(3, '0');;
            this.currentAnimation = AssetManager.spearmanAnimations[animName];
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

        this.currentAnimation = AssetManager.spearmanAnimations[animName];
    }
}

export { SpearmanAnimationManager, SpearmanAnimationState }