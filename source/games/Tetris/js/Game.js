// import { Block } from "./Block";

const MAX_LEVEL = 10;

const SPEED_NORMAL = [1000, 450, 400, 350, 300, 250, 200, 150, 100, 50]; //普通速度 
const SPEED_QUICK = 50;   //快速降落速度

const FONTFEIGHT = 60;
const FONTWIDTH = 30;
let lastTime = 0;

class Game{
    constructor(rows, cols, blockSize){
        this._rows = rows;
        this._cols = cols;
        this._blockSize = blockSize;
        this._delay = 0;
        this._isUpdate = false;
        this._score = 0;
        this._level = 1;
        this._lineCount = 0;
        this._hightestScore = 0;
        this._gameover = false;
        this._backBlock = null;
        this._curBlock = null;
        this._nexyBlock = null;
        this._map = new Array();
        this._timer = null;
    }
    init() {
        this._delay = SPEED_NORMAL[0];
        this._isUpdate = false;
        lastTime = new Date().getTime();
        for (let i = 0; i < this._rows; i++) {
            this._map[i] = new Array();
            for(let j=0; j<this._cols; j++){
                this._map[i][j] = 0;
            }
        }
    }
    drop() {
        console.log("game.draw()");
        this._curBlock.draw();
    }
    play(){
        console.log("Game play");
        this.init();
        this._curBlock = new Block();
        this._nexyBlock = new Block();
        this._curBlock.draw();

        
        // this._timer = setInterval(() => {
        //     console.log("timer")
        //     this.drop();
        // }, this._delay);

        // if(timer > this._delay){
        //     timer = 0;
        //     this.drop();
        //     this._isUpdate = true;
        // }
        // if(this._isUpdate){
        //     this._isUpdate = false;
        //     this.updateWindow();
        //     this.clearLine();
        // }
        // if(this._gameover){
        //     this.saveScore();
        //     this.displayOver();
        // }
    }
    keyEvent(){

    }
    getDelay(){ // 返回上次调用该函数的间隔时间(ms),第一次调用返回0ms
        let curTime = new Date().getTime();
        return curTime - lastTime;
    }
    updateWindow(){

    }
	clearLine(){}
	moveLeftRight(offset){}
	rotate(){}
	showScore(){}
	showLevel(){}
	showLineCount(){}
	showHighScore(){}
	setFontStyle(){}
	checkover(){}
	saveScore(){}
	displayOver(){}
}