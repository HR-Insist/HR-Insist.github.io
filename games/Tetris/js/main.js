
const ROWS = 20;
const COLS = 10;

let map=new Array();

window.onload = function() {
    // prepareForMobile();
    newgame();
}

//新游戏
function newgame() {
    //初始化N
    init();
    let game = new Game(20, 10, 40);
    game.play();
    
}

function init() {
    let $table = document.getElementById('game-table');
    for(let i=0; i<ROWS; i++){
        let $tr = document.createElement('tr');
        for(let j=0; j<COLS; j++){
            let $td = document.createElement('td');
            $tr.appendChild($td);
        }
        $table.appendChild($tr)
    }
    console.log($table);

}