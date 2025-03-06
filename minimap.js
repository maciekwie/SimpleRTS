import { Tile, TileType } from './tile.js';

class Minimap {
    constructor(player, gameplay, canvas) {
        this.player = player;
        this.gameplay = gameplay;

        this.width = canvas.getAttribute("width");
        this.height = canvas.getAttribute("width");

        this.ctx = canvas.getContext("2d");

        this.colors = [];
    }

    setPlayerColor(player, color) {
        this.colors[player] = color;
    }

    render() {
        let ctx = this.ctx;

        ctx.fillStyle = "#009911";
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.fill();

        let map = this.gameplay.map;
        const scaleX = this.width / map.width;
        const scaleY = this.height / map.height;

        for(let i = 0; i < map.width; i++) {
            for(let j = 0; j < map.height; j++) {
                let tile = map.tiles[i][j];

                if(tile.building != null) {
                    ctx.fillStyle = this.colors[tile.building.player];
                }
                else if(tile.units.length > 0) {
                    ctx.fillStyle = this.colors[tile.units[0].player];
                }
                else if(tile.type == TileType.STONE) {
                    ctx.fillStyle = "#AAAAE0";
                }
                else if(tile.type == TileType.TREE) {
                    ctx.fillStyle = "#00DD11";
                }
                else if(tile.type == TileType.CROPS) {
                    ctx.fillStyle = "#DDDD00";
                }
                else {
                    continue;
                }

                ctx.beginPath();
                ctx.rect(i * scaleX, j * scaleY, scaleX, scaleY);
                ctx.fill();
            }
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FFFFFF";

        const windowX = map.getTileX_map(map.screenPosX, map.screenPosY) * scaleX;
        const windowY = map.getTileY_map(map.screenPosX, map.screenPosY) * scaleY;
        const windowWidth = 800;
        const windowHeight = 600;

        ctx.beginPath();
        ctx.moveTo(windowX, windowY);
        ctx.lineTo(windowX + (windowWidth / 2 / map.width) * scaleX, windowY - (windowHeight / map.height) * scaleY);
        ctx.lineTo(windowX + (windowWidth / map.width) * scaleX, windowY);
        ctx.lineTo(windowX + (windowWidth / 2 / map.width) * scaleX, windowY + (windowHeight / map.height) * scaleY);
        ctx.lineTo(windowX, windowY);
        ctx.stroke();
    }

    onClickHandler(x, y, button) {
        const windowWidth = 800;
        const windowHeight = 600;

        let map = this.gameplay.map;
        const scaleX = this.width / map.width;
        const scaleY = this.height / map.height;

        const posX = x / scaleX;
        const posY = y / scaleY;

        const screenPosX = this.gameplay.map.getScreenX_map(posX, posY) - windowWidth / 2;
        const screenPosY = this.gameplay.map.getScreenY_map(posX, posY) - windowHeight / 2;

        if(button == 0)
        {
            this.gameplay.map.screenPosX = screenPosX;
            this.gameplay.map.screenPosY = screenPosY;
        }
        else if(button == 2)
        {
            const x = this.gameplay.map.getTileX_map(screenPosX, screenPosY);
            const y = this.gameplay.map.getTileY_map(screenPosX, screenPosY);

            this.gameplay.moveUnitsTo(x, y);
        }
    }
}

export { Minimap }