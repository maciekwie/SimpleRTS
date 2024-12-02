import { Gameplay } from './gameplay.js'
import { AssetManager } from './asset-manager.js';

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

let deltaTime = 0;

let arrows = {
    up: false,
    down: false,
    left: false,
    right: false
};

let selecting = false;

let gameplay;

main();

function main() {
    AssetManager.loadAssets();


    const canvas = document.querySelector("#canvasId");

    const ctx = canvas.getContext("2d");

    gameplay = new Gameplay({
        mapWidth: 64,
        mapHeight: 64
    });

    setEventListeners();

    let then = 0;
    let lastFrame = 0;

    gameplay.initMap();

    function render(now) {
        now *= 0.001;
        deltaTime = now - then;
        then = now;

        ctx.fill = "black";
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        if(now - lastFrame > 1/30) {
            lastFrame = now;
            gameplay.nextFrame();
        }

        gameplay.exec(deltaTime);
        gameplay.moveMap(arrows);
        gameplay.render(ctx, selecting);


        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function setEventListeners() {
    document.addEventListener("keydown", (event) => {
        const keyName = event.key;

        if (keyName == "ArrowUp") {
            arrows.up = true;
        }
        else if (keyName == "ArrowDown") {
            arrows.down = true;
        }
        else if (keyName == "ArrowLeft") {
            arrows.left = true;
        }
        else if (keyName == "ArrowRight") {
            arrows.right = true;
        }
    });

    document.addEventListener("keyup", (event) => {
        const keyName = event.key;

        if (keyName == "ArrowUp") {
            arrows.up = false;
        }
        else if (keyName == "ArrowDown") {
            arrows.down = false;
        }
        else if (keyName == "ArrowLeft") {
            arrows.left = false;
        }
        else if (keyName == "ArrowRight") {
            arrows.right = false;
        }
        else if (keyName == "b") {
            gameplay.build("house");
        }
        else if (keyName == "m") {
            gameplay.build("mill");
        }
        else if (keyName == "u") {
            gameplay.addUnit("worker");
        }
    });

    document.addEventListener("mousedown", (event) => {
        const x = event.x;
        const y = event.y;

        if(event.button == 0) {
            if(selecting == false) {
                selecting = true;
                gameplay.beginSelection(x, y);
            }
        }
        else if(event.button == 2) {

        }
    });

    document.addEventListener("mouseup", (event) => {
        const x = event.x;
        const y = event.y;

        if(event.button == 0) {
            gameplay.onClick(x, y);

            if(selecting)
            {
                selecting = false;
                gameplay.endSelection();
            }
        }
        else if(event.button == 2) {
            gameplay.moveUnitsTo(x, y);
        }
    })

    document.addEventListener("mousemove", (event) => {
        const x = event.x;
        const y = event.y;

        if(selecting)
        {
            gameplay.updateSelection(x, y);
        }
    })
}