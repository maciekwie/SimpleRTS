import { Gameplay } from './gameplay.js'
import { AssetManager } from './asset-manager.js';
import { Player } from './player.js'
import { AIPlayer } from './AIPlayer.js';

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
let player;
let aiPlayer;

main();

function main() {
    AssetManager.loadAssets();

    const canvas = document.querySelector("#canvasId");

    const ctx = canvas.getContext("2d");

    gameplay = new Gameplay({
        mapWidth: 64,
        mapHeight: 64
    });

    player = new Player("A", gameplay);
    aiPlayer = new AIPlayer("B", gameplay);

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

        player.moveMap(arrows);

        gameplay.exec(deltaTime);
        gameplay.render(ctx);

        if(selecting)
            player.drawSelectionRect(ctx);


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
        else if (keyName == "h") {
            player.build("house");
        }
        else if (keyName == "b") {
            player.build("barracks");
        }
        else if (keyName == "s") {
            player.build("storehouse");
        }
        else if (keyName == "m") {
            player.build("mill");
        }
        else if (keyName == "w") {
            player.addUnit("worker");
        }
        else if (keyName == "u") {
            player.addUnit("spearman");
        }
        else if (keyName == "a") {
            player.addUnit("archer");
        }
        else if (keyName == "p") {
            player.plantCrops();
        }
    });

    document.addEventListener("mousedown", (event) => {
        const x = event.x;
        const y = event.y;

        if(event.button == 0) {
            if(selecting == false) {
                selecting = true;
                player.beginSelection(x, y);
            }
        }
        else if(event.button == 2) {

        }
    });

    document.addEventListener("mouseup", (event) => {
        const x = event.x;
        const y = event.y;

        if(event.button == 0) {
            player.onClick(x, y);

            if(selecting)
            {
                selecting = false;
                player.endSelection();
            }
        }
        else if(event.button == 2) {
            player.moveUnitsTo(x, y);
        }
    })

    document.addEventListener("mousemove", (event) => {
        const x = event.x;
        const y = event.y;

        if(selecting)
        {
            player.updateSelection(x, y);
        }
    })
}