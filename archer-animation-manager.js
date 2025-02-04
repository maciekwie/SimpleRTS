import { UnitAnimationManager } from './unit-animation-manager.js' 

const ArcherAnimationState = {
    STAY: Symbol("stay"),
    WALK: Symbol("walk"),
    SHOOT: Symbol("shoot")
};
Object.freeze(ArcherAnimationState);

class ArcherAnimationManager extends UnitAnimationManager {
    constructor(animations) {
        super();

        this.animations = animations;

        this.currentAnimation = this.animations["archer_stand_000"];
        this.state = ArcherAnimationState.STAY;
    }

    updateState() {
        if(this.state === ArcherAnimationState.WALK) {
            const animName = "archer_walk_" + String(this.direction).padStart(3, '0');;
            this.currentAnimation = this.animations[animName];
        }
        else if(this.state === ArcherAnimationState.SHOOT) {
            if(this.animationFinished) {
                const animName = "archer_shoot_" + String(this.direction).padStart(3, '0');;
                this.currentAnimation = this.animations[animName];
                
                this.animationFinished = false;
                this.currentFrame = 0;
                this.loop = false;
            }
        }
    }

    setAnimationState(state)
    {
        this.state = state;

        this.loop = true;

        let animName = "";
        if(state === ArcherAnimationState.STAY) {
            animName = "archer_stand_" + String(this.direction).padStart(3, '0');;
        }
        else if(state === ArcherAnimationState.WALK) {
            animName = "archer_walk_" + String(this.direction).padStart(3, '0');;
        }
        else if(state === ArcherAnimationState.SHOOT) {
            animName = "archer_shoot_" + String(this.direction).padStart(3, '0');;
            this.loop = false;
            this.animationFinished = false;
        } 

        this.currentAnimation = this.animations[animName];
    }
}

export { ArcherAnimationManager, ArcherAnimationState }