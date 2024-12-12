import { UnitAnimationManager } from './unit-animation-manager.js' 

const WorkerAnimationState = {
    STAY: Symbol("stay"),
    WALK: Symbol("walk"),
    CUT: Symbol("cut"),
    MINE: Symbol("mine"),
    HARVEST: Symbol("harvest")
};
Object.freeze(WorkerAnimationState);

class WorkerAnimationManager extends UnitAnimationManager {
    constructor(animations) {
        super();

        this.animations = animations;

        this.currentAnimation = this.animations["worker_stand_000"];
        this.state = WorkerAnimationState.STAY;
    }

    updateState() {
        if(this.state === WorkerAnimationState.WALK) {
            const animName = "worker_walk_" + String(this.direction).padStart(3, '0');;
            this.currentAnimation = this.animations[animName];
        }
    }

    setAnimationState(state)
    {
        this.state = state;

        let animName = "";
        if(state === WorkerAnimationState.STAY) {
            animName = "worker_stand_" + String(this.direction).padStart(3, '0');;
        }
        else if(state === WorkerAnimationState.WALK) {
            animName = "worker_walk_" + String(this.direction).padStart(3, '0');;
        }
        else if(state === WorkerAnimationState.CUT) {
            animName = "worker_woodcut";
        }
        else if(state === WorkerAnimationState.MINE) {
            animName = "worker_stonemining";
        }
        else if(state === WorkerAnimationState.HARVEST) {
            animName = "worker_cropsharvest";
        }

        this.currentAnimation = this.animations[animName];
    }
}

export { WorkerAnimationManager, WorkerAnimationState }