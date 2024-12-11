import { Unit, UnitType } from './unit.js'
import { WorkerAnimationManager, WorkerAnimationState } from './worker-animation-manager.js'

const WorkerAction = {
    IDLE: Symbol("idle"),
    CUT: Symbol("cut"),
    MINE: Symbol("mine"),
    HARVEST: Symbol("harvest")
};
Object.freeze(WorkerAction);

class WorkerUnit extends Unit {
    constructor(posX, posY) {
        super(UnitType.worker, posX, posY);

        this.animationManager = new WorkerAnimationManager();

        this.action = WorkerAction.IDLE;
    }

    SetAction(action) {
        this.action = action;
    }

    startWalking() {
        this.animationManager.setAnimationState(WorkerAnimationState.WALK);
    }

    destinationReached() {
        if(this.action === WorkerAction.CUT) {
            this.animationManager.setAnimationState(WorkerAnimationState.CUT);
        }
        else if(this.action === WorkerAction.MINE) {
            this.animationManager.setAnimationState(WorkerAnimationState.MINE);
        }
        else if(this.action === WorkerAction.HARVEST)  {
            this.animationManager.setAnimationState(WorkerAnimationState.HARVEST);
        }
        else if(this.action === WorkerAction.IDLE)  {
            this.animationManager.setAnimationState(WorkerAnimationState.STAY);
        }
    }
}

export { WorkerUnit, WorkerAction }