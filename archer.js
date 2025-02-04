import { Unit, UnitType } from './unit.js'
import { ArcherAnimationManager, ArcherAnimationState } from './archer-animation-manager.js'

const ArcherAction = {
    IDLE: Symbol("idle"),
    SHOOT: Symbol("shoot"),
    GO_ATTACK: Symbol("go attack")
};
Object.freeze(ArcherAction);

class Archer extends Unit {
    static SHOOT_RATE = 1;
    static DAMAGE = 0.1;

    constructor(posX, posY) {
        super(UnitType.archer, posX, posY);

        this.animationManager = new ArcherAnimationManager(UnitType.archer.animations);

        this.action = ArcherAction.IDLE;
        this.lastShootingTime = 0;
    }

    exec(deltaTime, time, gameplay) {
        if(this.action === ArcherAction.SHOOT && this.targetUnit != null)
        {
            this.directionX = this.targetUnit.posX - this.posX;
            this.directionY = this.targetUnit.posY - this.posY;

            this.animationManager.setDirection(this.directionX, this.directionY);
            this.animationManager.updateState();

            if(time - this.lastShootingTime > 1 / Archer.SHOOT_RATE)
            {
                gameplay.shootArrow(this.posX, this.posY, this.targetUnit.posX, this.targetUnit.posY, Archer.DAMAGE);
                this.lastShootingTime = time;
                this.animationManager.setAnimationState(ArcherAnimationState.SHOOT);
            }
        }
    }

    startWalking() {
        this.animationManager.setAnimationState(ArcherAnimationState.WALK);
    }

    destinationReached() {
        this.animationManager.setAnimationState(ArcherAnimationState.STAY);
    }

    destinationNear() {
        if(this.action === ArcherAction.GO_ATTACK) {
            this.stopWalking();

            this.action = ArcherAction.SHOOT;
            this.animationManager.setAnimationState(ArcherAnimationState.SHOOT);
        }
    }
}

export { Archer, ArcherAction }