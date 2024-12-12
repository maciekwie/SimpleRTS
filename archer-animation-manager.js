
import { AssetManager } from './asset-manager.js';
import { UnitAnimationManager } from './unit-animation-manager.js' 

const ArcherAnimationState = {
    STAY: Symbol("stay"),
    WALK: Symbol("walk"),
    SHOOT: Symbol("shoot")
};
Object.freeze(ArcherAnimationState);

class ArcherAnimationManager extends UnitAnimationManager {
    constructor() {
        super();

        this.atlasImage = AssetManager.archerAtlasImage;

        this.currentAnimation = AssetManager.archerAnimations["archer_stand_000"];
        this.state = ArcherAnimationState.STAY;
    }

    updateState() {
        if(this.state === ArcherAnimationState.WALK) {
            const animName = "archer_walk_" + String(this.direction).padStart(3, '0');;
            this.currentAnimation = AssetManager.archerAnimations[animName];
        }
    }

    setAnimationState(state)
    {
        this.state = state;

        let animName = "";
        if(state === ArcherAnimationState.STAY) {
            animName = "archer_stand_" + String(this.direction).padStart(3, '0');;
        }
        else if(state === ArcherAnimationState.WALK) {
            animName = "archer_walk_" + String(this.direction).padStart(3, '0');;
        }
        else if(state === ArcherAnimationState.HIT) {
            animName = "archer_hit_" + String(this.direction).padStart(3, '0');;
        } 

        this.currentAnimation = AssetManager.archerAnimations[animName];
    }
}

export { ArcherAnimationManager, ArcherAnimationState }