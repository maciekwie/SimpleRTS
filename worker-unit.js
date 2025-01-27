import { Unit, UnitType } from './unit.js'
import { Building, BuildingType } from './building.js'
import { WorkerAnimationManager, WorkerAnimationState } from './worker-animation-manager.js'

const WorkerAction = {
    IDLE: Symbol("idle"),
    CUT: Symbol("cut"),
    MINE: Symbol("mine"),
    HARVEST: Symbol("harvest"),
    GO_TO_DEST: Symbol("go to destination"),
    GO_CUT: Symbol("go cut"),
    GO_MINE: Symbol("go mine"),
    GO_HARVEST: Symbol("go harvest"),
    RETURN_WITH_WOOD: Symbol("return with wood"),
    RETURN_WITH_STONE: Symbol("return with stone"),
    RETURN_WITH_CROPS: Symbol("return with crops")
};
Object.freeze(WorkerAction);

class WorkerUnit extends Unit {
    static CUT_RATE = 1;
    static MINE_RATE = 1;
    static HARVEST_RATE = 1;

    constructor(posX, posY) {
        super(UnitType.worker, posX, posY);

        this.animationManager = new WorkerAnimationManager(UnitType.worker.animations);

        this.workDestX = 0;
        this.workDestY = 0;

        this.action = WorkerAction.IDLE;
        this.actionProgress = 0;
    }

    exec(deltaTime, gameplay) {
        let destType = null;

        if (this.action == WorkerAction.CUT) {
            this.actionProgress += WorkerUnit.CUT_RATE * deltaTime;
            destType = BuildingType.storehouseType;
        }
        else if(this.action == WorkerAction.MINE) {
            this.actionProgress += WorkerUnit.MINE_RATE * deltaTime;
            destType = BuildingType.storehouseType;
        }
        else if(this.action == WorkerAction.HARVEST) {
            this.actionProgress += WorkerUnit.HARVEST_RATE * deltaTime;
            destType = BuildingType.millType;
        }
        else if(this.action === WorkerAction.GO_TO_DEST)  {
            this.SetAction(WorkerAction.IDLE);
            this.animationManager.setAnimationState(WorkerAnimationState.STAY);
        }
        else if(this.action === WorkerAction.RETURN_WITH_WOOD) {
            if(this.posX != this.destinationX || this.posY != this.destinationY)
                return;

            this.setAction(WorkerAction.GO_CUT);

            const path = gameplay.map.getPath(this.posX, this.posY, this.workDestX, this.workDestY);
            this.setPath(path);
            this.setDestination(this.workDestX, this.workDestY);
        }
        else if(this.action === WorkerAction.RETURN_WITH_STONE) {
            if(this.posX != this.destinationX || this.posY != this.destinationY)
                return;

            this.setAction(WorkerAction.GO_MINE);

            const path = gameplay.map.getPath(this.posX, this.posY, this.workDestX, this.workDestY);
            this.setPath(path);
            this.setDestination(this.workDestX, this.workDestY);
        }
        else if(this.action === WorkerAction.RETURN_WITH_CROPS) {
            if(this.posX != this.destinationX || this.posY != this.destinationY)
                return;

            this.setAction(WorkerAction.GO_HARVEST);
            
            const path = gameplay.map.getPath(this.posX, this.posY, this.workDestX, this.workDestY);
            this.setPath(path);
            this.setDestination(this.workDestX, this.workDestY);
        }

        if(this.actionProgress >= 1) {
            this.actionProgress = 0;

            let destBuilding = gameplay.getNearestBuilding(destType, this.posX, this.posY, this.player);

            if(destBuilding != null) {
                const path = gameplay.map.getPath(this.posX, this.posY, destBuilding.posX - 1, destBuilding.posY);

                if(path != null){
                    this.setPath(path);
                    this.setDestination(destBuilding.posX - 1, destBuilding.posY);

                    if (this.action == WorkerAction.CUT) {
                        this.setAction(WorkerAction.RETURN_WITH_WOOD);
                    }
                    else if(this.action == WorkerAction.MINE) {
                        this.SetAction(WorkerAction.RETURN_WITH_STONE);
                    }
                    else if(this.action == WorkerAction.HARVEST) {
                        this.SetAction(WorkerAction.RETURN_WITH_CROPS);
                    }
                }
                else {
                    this.setAction(WorkerAction.IDLE);
                    this.animationManager.setAnimationState(WorkerAnimationState.STAY);
                }
            }
            else {
                this.setAction(WorkerAction.IDLE);
                this.animationManager.setAnimationState(WorkerAnimationState.STAY);
            }
        }
    }

    SetAction(action) {
        this.action = action;
        this.actionProgress = 0;
    }

    startWalking() {
        this.animationManager.setAnimationState(WorkerAnimationState.WALK);
    }

    destinationReached() {
        if(this.action === WorkerAction.GO_CUT) {
            this.SetAction(WorkerAction.CUT);
            this.animationManager.setAnimationState(WorkerAnimationState.CUT);

            this.workDestX = this.posX;
            this.workDestY = this.posY;
        }
        else if(this.action === WorkerAction.GO_MINE) {
            this.SetAction(WorkerAction.MINE);
            this.animationManager.setAnimationState(WorkerAnimationState.MINE);

            this.workDestX = this.posX;
            this.workDestY = this.posY;
        }
        else if(this.action === WorkerAction.GO_HARVEST)  {
            this.SetAction(WorkerAction.HARVEST);
            this.animationManager.setAnimationState(WorkerAnimationState.HARVEST);

            this.workDestX = this.posX;
            this.workDestY = this.posY;
        }
    }
}

export { WorkerUnit, WorkerAction }