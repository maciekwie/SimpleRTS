
class UnitAnimationManager {
    constructor() {
        this.currentFrame = 0;
        this.currentAnimation = null; 

        this.direction = 0;
    }

    nextFrame() {
        if(this.currentAnimation == null)
            return;

        this.currentFrame++;

        if(this.currentFrame >= this.currentAnimation.numberOfFrames)
            this.currentFrame = 0;
    }

    setDirection(x, y) {
        if(x == -1 && y == -1)
            this.direction = 5;
        else if(x == -1 && y == 0)
            this.direction = 6;
        else if(x == -1 && y == 1)
            this.direction = 7;
        else if(x == 0 && y == 1)
            this.direction = 0;
        else if(x == 1 && y == 1)
            this.direction = 1;
        else if(x == 1 && y == 0)
            this.direction = 2;
        else if(x == 1 && y == -1)
            this.direction = 3;
        else if(x == 0 && y == -1)
            this.direction = 4;
    }

    updateState() {

    }
}

export { UnitAnimationManager }