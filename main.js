import { Gameplay } from './gameplay.js'
import { AssetLoader, setAnimations } from './asset-loader.js';
import { Player } from './player.js'
import { AIPlayer } from './AIPlayer.js';
import { UnitType } from './unit.js';
import { BuildingType } from './building.js';

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
let placeBuildingType = null;

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

        gameplay.addPlayer(player);
        gameplay.addPlayer(aiPlayer);

        gameplay.playerName = player.playerName;

        gameplay.initMap();
        gameplay.addUnit(UnitType.spearman, 5, 60, aiPlayer.playerName);
        gameplay.addUnit(UnitType.spearman, 6, 60, aiPlayer.playerName);
        gameplay.addUnit(UnitType.spearman, 7, 60, aiPlayer.playerName);

        updateResourcesBar();
        gameplay.updateResourcesBar = updateResourcesBar;

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

        gameplay.exec(deltaTime, now);
        gameplay.render(ctx);

        if(selecting)
            player.drawSelectionRect(ctx);

        if(player.selectedBuilding != null) {
            updateBuildingPanel();
        }


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
            placeBuildingType = BuildingType.houseType;
        }
        else if (keyName == "b") {
            placeBuildingType = BuildingType.barracksType;
        }
        else if (keyName == "s") {
            placeBuildingType = BuildingType.storehouseType;
        }
        else if (keyName == "m") {
            placeBuildingType = BuildingType.millAnimations;
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

    let canvasElement = document.querySelector("#canvasId");

    canvasElement.addEventListener("mousedown", (event) => {
        const x = event.x;
        const y = event.y;

        if(event.button == 0) {
            if(selecting == false) {
                selecting = true;
                player.beginSelection(x, y);
            }

            if(placeBuildingType != null) {
                gameplay.build();
            }
        }
        else if(event.button == 2) {

        }
    });

    canvasElement.addEventListener("mouseup", (event) => {
        const x = event.x;
        const y = event.y;

        if(event.button == 0) {
            player.onClick(x, y);

            if(selecting)
            {
                selecting = false;
                player.endSelection();

                if(player.selectedBuilding != null) {
                    for(let element of document.querySelectorAll("#actionsPanel .optionGroup"))
                    {
                        element.style.display = "none";
                    }

                    document.querySelector("#selectedBuildingPanel").style.display = "block";

                    updateBuildingPanel();
                }
            }

            if(placeBuildingType != null) {
                if(player.build())
                    placeBuildingType = null;
            }
        }
        else if(event.button == 2) {
            player.moveUnitsTo(x, y);

            if(placeBuildingType != null) {
                player.discardPlacingBuilding();
                placeBuildingType = null;
            }
        }
    })

    canvasElement.addEventListener("mousemove", (event) => {
        const x = event.x;
        const y = event.y;

        if(selecting)
        {
            player.updateSelection(x, y);

            updateUnitsPanel();
        }

        if(placeBuildingType != null) {
            player.placeBuilding(x, y, placeBuildingType);
        }
    })

    document.querySelector("#buildHouseButton").addEventListener("click", (event) => {
        placeBuildingType = BuildingType.houseType;
    });

    document.querySelector("#buildSorehouseButton").addEventListener("click", (event) => {
        placeBuildingType = BuildingType.storehouseType;
    });

    document.querySelector("#buildMillButton").addEventListener("click", (event) => {
        placeBuildingType = BuildingType.millType;
    });

    document.querySelector("#buildBarracksButton").addEventListener("click", (event) => {
        placeBuildingType = BuildingType.barracksType;
    });

    document.querySelector("#recruitWorkerButton").addEventListener("click", (event) => {
        event.stopPropagation();

        if(player.selectedBuilding != null && player.selectedBuilding.type === BuildingType.houseType) {
            player.recruit(player.selectedBuilding, UnitType.worker);
        }
    });

    document.querySelector("#recruitSpearmanButton").addEventListener("click", (event) => {
        if(player.selectedBuilding != null && player.selectedBuilding.type === BuildingType.barracksType) {
            player.recruit(player.selectedBuilding, UnitType.spearman);
        }
    });

    document.querySelector("#recruitArcherButton").addEventListener("click", (event) => {
        if(player.selectedBuilding != null && player.selectedBuilding.type === BuildingType.barracksType) {
            player.recruit(player.selectedBuilding, UnitType.archer);
        }
    });
}

function updateResourcesBar() {
    document.querySelector("#woodAmount").innerHTML = player.resources.wood;
    document.querySelector("#stoneAmount").innerHTML = player.resources.stone;
    document.querySelector("#foodAmount").innerHTML = player.resources.food;
    document.querySelector("#moneyAmount").innerHTML = player.resources.money;
}

function updateUnitsPanel() {
    for(let element of document.querySelectorAll("#actionsPanel .optionGroup"))
    {
        element.style.display = "none";
    }

    if(player.selectedUnits.length == 0)
    {
        document.querySelector("#buildPanel").style.display = "block";
        return;
    }
    
    document.querySelector("#unitsPanel").style.display = "block";
    document.querySelector("#selectedUnitsNumber").innerHTML = player.selectedUnits.length;

    let selectedWorkers = 0;
    let selectedSpearmen = 0;
    let selectedArchers = 0;
    for(let unit of player.selectedUnits) {
        if(unit.type === UnitType.worker) {
            selectedWorkers++;
        }
        else  if(unit.type === UnitType.spearman) {
            selectedSpearmen++;
        }
        else if(unit.type === UnitType.archer) {
            selectedArchers++;
        }
    }

    document.querySelector("#selectedWorkersNumber").innerHTML = selectedWorkers;
    document.querySelector("#selectedSpearmenNumber").innerHTML = selectedSpearmen;
    document.querySelector("#selectedArchersNumber").innerHTML = selectedArchers;
}

function updateBuildingPanel() {
    for(let element of document.querySelectorAll("#selectedBuildingPanel .optionGroup"))
    {
        element.style.display = "none";
    }

    if(player.selectedBuilding.type === BuildingType.houseType) {
        document.querySelector("#houseOptions").style.display = "block";

        document.querySelector("#houseRecruitProgress").innerHTML = player.selectedBuilding.recruitProgress * 100 + "%";

        let workersInQueue = 0;

        for(let type of player.selectedBuilding.recruitQueue) {
            if(type === UnitType.worker) {
                workersInQueue++;
            }
        }

        document.querySelector("#workersInQueue").innerHTML = workersInQueue;
    }
    else if(player.selectedBuilding.type === BuildingType.storehouseType) {
        document.querySelector("#storehouseOptions").style.display = "block";
    }
    else if(player.selectedBuilding.type === BuildingType.barracksType) {
        document.querySelector("#barracksOptions").style.display = "block";

        document.querySelector("#barracksRecruitProgress").innerHTML = player.selectedBuilding.recruitProgress * 100 + "%";

        let spearmenInQueue = 0;
        let archersInQueue = 0;

        for(let type of player.selectedBuilding.recruitQueue) {
            if(type === UnitType.spearman) {
                spearmenInQueue++;
            }
            else if(type === UnitType.archer) {
                archersInQueue++;
            }
        }

        document.querySelector("#spearmenInQueue").innerHTML = spearmenInQueue;
        document.querySelector("#archersInQueue").innerHTML = archersInQueue;
    }
    else if(player.selectedBuilding.type === BuildingType.millType) {
        document.querySelector("#millOptions").style.display = "block";
    }
}