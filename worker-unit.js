import { Unit, UnitType } from './unit.js'
import { WorkerAnimationManager } from './worker-animation-manager.js'

class WorkerUnit extends Unit {
    constructor(posX, posY) {
        super(UnitType.worker, posX, posY);

        this.animationManager = new WorkerAnimationManager();
    }
}

export { WorkerUnit }