import { Gameplay } from './gameplay.js'
import { AssetLoader, setAnimations } from './asset-loader.js';
import { Player } from './player.js'
import { AIPlayer } from './AIPlayer.js';
import { UnitType } from './unit.js';

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

let loader;

let gameplay;
let player;
let aiPlayer;

main();

function main() {
    loader = new AssetLoader();

    loader.setOnAllLoaded(() => {
        loader.assets.cropsHeight = 32;

        loader.assets.millAnimations = setAnimations(loader.assets['windmill_animations'], loader.assets['windmill_atlas_data']);
        loader.assets.workerAnimations = setAnimations(loader.assets['worker_animations'], loader.assets['worker_atlas_data']);
        loader.assets.spearmanAnimations = setAnimations(loader.assets['spearman_animations'], loader.assets['spearman_atlas_data']);
        loader.assets.archerAnimations = setAnimations(loader.assets['archer_animations'], loader.assets['archer_atlas_data']);

        gameplay = new Gameplay({
            mapWidth: 64,
            mapHeight: 64
        },  loader);
    
        player = new Player("A", gameplay);
        aiPlayer = new AIPlayer("B", gameplay);

        gameplay.playerName = player.playerName;

        gameplay.initMap();
        gameplay.addUnit(UnitType.spearman, 5, 60, aiPlayer.playerName);
        gameplay.addUnit(UnitType.spearman, 6, 60, aiPlayer.playerName);
        gameplay.addUnit(UnitType.spearman, 7, 60, aiPlayer.playerName);

        setEventListeners();
        requestAnimationFrame(mainLoop);
    });

    loadAssets();

    const canvas = document.querySelector("#canvasId");
    const ctx = canvas.getContext("2d");

    let then = 0;
    let lastFrame = 0;

    function mainLoop(now) {
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


        requestAnimationFrame(mainLoop);
    }
}

function loadAssets() {
    loader.loadImage("grass", "Assets/grass.png");
    loader.loadImage("house", "Assets/house.png");
    loader.loadImage("storehouse", "Assets/storehouse.png");
    loader.loadImage("barracks", "Assets/barracks.png");
    loader.loadImage("tree1", "Assets/tree1.png");
    loader.loadImage("tree2", "Assets/tree2.png");
    loader.loadImage("tree3", "Assets/tree3.png");
    loader.loadImage("stone", "Assets/stone.png");
    loader.loadImage("windmill_atlas", "Assets/windmill_atlas.png");
    loader.loadImage("crops_back", "Assets/crops_back.png");
    loader.loadImage("crops_front", "Assets/crops_front.png");
    loader.loadImage("growing_crops_back", "Assets/growing_crops_back.png");
    loader.loadImage("growing_crops_front", "Assets/growing_crops_front.png");
    loader.loadImage("worker_atlas", "Assets/worker_atlas.png");
    loader.loadImage("spearman_atlas", "Assets/spearman_atlas.png");
    loader.loadImage("archer_atlas", "Assets/archer_atlas.png");
    loader.loadJSON("windmill_atlas_data", "Assets/windmill_atlas.json");
    loader.loadJSON("windmill_animations", "Assets/windmill_animations.json");
    loader.loadJSON("worker_atlas_data", "Assets/worker_atlas_data.json");
    loader.loadJSON("worker_animations", "Assets/worker_animations.json");
    loader.loadJSON("spearman_atlas_data", "Assets/spearman_atlas_data.json");
    loader.loadJSON("spearman_animations", "Assets/spearman_animations.json");
    loader.loadJSON("archer_atlas_data", "Assets/archer_atlas_data.json");
    loader.loadJSON("archer_animations", "Assets/archer_animations.json");
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