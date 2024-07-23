// 七种方块
const blocks = [
    [1,3,5,7],// I
    [2,4,5,7],// Z 1型
    [3,5,4,6], // Z 2型
    [3,5,4,7], // T
    [2,3,5,7], // L
    [3,5,7,6], // J
    [2,3,4,5], // 田
];

const size = 40;


class Block {
    constructor() {
        // 随机生成一种方块
        this._blockType = Math.floor(Math.random() * 7) + 1;
        this._smallBlocks = new Array();
        for (let i = 0; i < 4; i++) {
            let point = {
                row: Math.floor(blocks[this._blockType-1][i] / 2),
                col: Math.floor(blocks[this._blockType-1][i] % 2) + 4
            };
            this._smallBlocks.push(point);
        }
    }
    setColor(row, col){
        let trs = document.getElementsByTagName('tr');
        trs[row].childNodes[col].classList.add("color"+ this._blockType);
    }
    draw(leftMargin=0, topMagin=0){
        for(let i=0; i<4; i++){
            let x = leftMargin + this._smallBlocks[i].row;
            let y = topMagin + this._smallBlocks[i].col;
            this.setColor(x, y);
        }
    }
}
