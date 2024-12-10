
import { AssetManager } from './asset-manager.js';
import { UnitAnimationManager } from './unit-animation-manager.js' 

const WorkerAnimationState = {
    STAY: Symbol("stay"),
    WALK: Symbol("walk")
};
Object.freeze(WorkerAnimationState);

class WorkerAnimationManager extends UnitAnimationManager {
    constructor() {
        super();
        this.currentAnimation = AssetManager.workerAnimations["worker_walk_000"];
    }

    updateState() {
        const animName = "worker_walk_" + String(this.direction).padStart(3, '0');;
        this.currentAnimation = AssetManager.workerAnimations[animName];
    }
}

export { WorkerAnimationManager }