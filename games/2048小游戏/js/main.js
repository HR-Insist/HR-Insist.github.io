//主函数
var board = new Array(); //表格数值
var score = 0; //分数
var hasAdd = new Array(); //记录每一个小格子是否一次操作中已经相加过一次了

window.onload = function() {
    prepareForMobile();
    newgame();
}

function prepareForMobile() {
    if (documentWidth >= 500) {
        gridContainerWidth = 500;
        cellSildLength = 100;
        cellSpace = 20;
    }
    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.03 * gridContainerWidth);

    $('.grid-cell').css('width', cellSildLength);
    $('.grid-cell').css('height', cellSildLength);
    $('.grid-cell').css('border-radius', 0.1 * cellSildLength);
}
//新游戏
function newgame() {
    //初始化N
    init();
    //随机在格子里生成两个数字
    randomNum();
    randomNum();
}

function init() {
    //设置格子位置
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = document.getElementById('grid-cell-' + i + '-' + j);
            // console.log(gridCell);
            gridCell.style.top = getTop(i) + 'px';
            gridCell.style.left = getLeft(j) + 'px';
        }
    }
    //为每个格子赋值
    for (var i = 0; i < 4; i++) {
        board[i] = new Array(); //把board变为二维数组
        hasAdd[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasAdd[i][j] = false; //若还没有相加过，那就为false
        }
    }
    //更新格子的里的数字位置
    updateBoard();
    //重置分数
    score = 0;
    updateScore();
}
//更新格子的里的数字位置
function updateBoard() {
    while (document.querySelector('.number-cell')) {
        document.querySelector('.number-cell').remove();
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var theNumberCell = document.createElement('div');
            document.querySelector('#grid-container').appendChild(theNumberCell);
            theNumberCell.className = 'number-cell';
            theNumberCell.id = 'number-cell-' + i + '-' + j;

            if (board[i][j] === 0) {
                theNumberCell.style.width = 0;
                theNumberCell.style.height = 0;
                theNumberCell.style.top = getTop(i) + 'px';
                theNumberCell.style.left = getLeft(j) + 'px';
            } else {
                theNumberCell.style.width = cellSildLength + 'px';
                theNumberCell.style.height = cellSildLength + 'px';
                theNumberCell.style.top = getTop(i) + 'px';
                theNumberCell.style.left = getLeft(j) + 'px';
                theNumberCell.style.backgroundColor = getBgc(board[i][j]);
                theNumberCell.style.color = getColor(board[i][j]);
                theNumberCell.innerHTML = board[i][j];
            }
            hasAdd[i][j] = false; //每一次移位操作结束后，又恢复为false
            theNumberCell.style.lineHeight = cellSildLength + 'px';
            if (board[i][j] >= 1024) {
                theNumberCell.style.fontSize = 0.4 * cellSildLength + 'px';
            } else {
                theNumberCell.style.fontSize = 0.6 * cellSildLength + 'px';
            }
            theNumberCell.style.borderRadius = 0.1 * cellSildLength + 'px';
        }
    }
}
//更新分数
function updateScore() {
    if ((document.querySelector('#newgame').onclick)) {
        console.log('11');
    }
    $('#score').text(score);
}
//随机在格子生成数字
function randomNum() {
    if (!ifSpace(board)) {
        return false;
    }
    //随机一个位置
    var ranX = Math.floor(Math.random() * 4);
    var ranY = Math.floor(Math.random() * 4);
    //为了避免效率过低，只进行50次循环，如果50次之内没有找到空的位置
    //那么久人工生成一个位置
    var times = 0;
    while (times < 50) {
        if (board[ranX][ranY] === 0) {
            break;
        } else {
            ranX = Math.floor(Math.random() * 4);
            ranY = Math.floor(Math.random() * 4);
        }
        times++;
    }
    //人工寻找第一个空位置
    if (times === 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] != 0) {
                    ranX = i;
                    ranY = j;
                }
            }
        }
    }
    //随机一个数字
    var ranNum = Math.random() < 0.66 ? 2 : 4;
    //在随机位置显示随机数
    board[ranX][ranY] = ranNum;
    showNumberAnimation(ranX, ranY, ranNum);
    return true;
}

//键盘事件 上下左右
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37: //向左
            e.preventDefault();
            if (moveLeft()) {
                setTimeout('randomNum()', 210);
                setTimeout('isGameover()', 300);;
            }
            break;
        case 38: //向上
            e.preventDefault();
            if (moveUp()) {
                setTimeout('randomNum()', 210);
                setTimeout('isGameover()', 300);
            }
            break;
        case 39: //向右
            e.preventDefault();
            if (moveRight()) {
                setTimeout('randomNum()', 210);
                setTimeout('isGameover()', 300);
            }
            break;
        case 40: //向下
            e.preventDefault();
            if (moveDown()) {
                setTimeout('randomNum()', 210);
                setTimeout('isGameover()', 300);
            }
            break;
        default:
            break;
    }
}

//移动端 手指滑动事件
document.addEventListener('touchstart', function(e) {
    //不加var，声明的是全局变量
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
});
//防止屏幕滑动
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
})

document.addEventListener('touchend', function(e) {
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;

    //判断移动的距离和方向
    var movex = endx - startx;
    var movey = endy - starty;
    //如果移动的距离过小或者只是触摸屏幕 就不进行移动操作 
    if (Math.abs(movex) < 0.2 * documentWidth && Math.abs(movey) < 0.2 * documentWidth) {
        return;
    }

    //x方向移动
    if (Math.abs(movex) > Math.abs(movey)) {
        //右移
        if (movex > 0) {
            if (moveRight()) {
                setTimeout('randomNum()', 210);
                setTimeout('isGameover()', 300);
            }
        }
        //左移
        else {
            if (moveLeft()) {
                setTimeout('randomNum()', 210);
                setTimeout('isGameover()', 300);;
            }
        }
    }
    //y方向移动 
    else {
        //向下移动
        if (movey > 0) {
            if (moveDown()) {
                setTimeout('randomNum()', 210);
                setTimeout('isGameover()', 300);
            }
        }
        //向上移动
        else {
            if (moveUp()) {
                setTimeout('randomNum()', 210);
                setTimeout('isGameover()', 300);
            }
        }
    }
});
//向左移动
function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    //目标位置为空 且 中间没有障碍物
                    if (board[i][k] == 0 && noBlockRow(i, k, j, board)) {
                        //移动
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //二者相等 且 中间没有障碍物 且 目标位置没有进过相加操作
                    else if (board[i][k] === board[i][j] && noBlockRow(i, k, j, board) && !hasAdd[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //相加操作
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k]; //增加增加相应分数
                        updateScore(); //更新分数
                        hasAdd[i][k] = true; //设置为true 代表已经进行一次相加操作 不能再次相加
                        isGameWin();
                        continue;
                    }
                }
            }
        }
    }
    //刷新表格 使用setTimeout使得移动动画能够实现
    setTimeout('updateBoard()', 200);
    return true;
}
//向右移动
function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockRow(i, j, k, board)) {
                        //移动
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] === board[i][j] && noBlockRow(i, j, k, board) && !hasAdd[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //相加操作
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k]; //增加增加相应分数
                        updateScore(); //更新分数
                        hasAdd[i][k] = true; //设置为true 代表已经进行一次相加操作 不能再次相加
                        isGameWin();
                        continue;
                    }
                }
            }
        }
    }
    //刷新表格 使用setTimeout使得移动动画能够实现
    setTimeout('updateBoard()', 200);
    return true;
}
//向上移动
function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockCol(j, k, i, board)) {
                        //移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] === board[i][j] && noBlockCol(j, k, i, board) && !hasAdd[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //相加操作
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j]; //增加增加相应分数
                        updateScore(); //更新分数
                        hasAdd[k][j] = true;
                        isGameWin();
                        continue;
                    }
                }
            }
        }
    }
    //刷新表格 使用setTimeout使得移动动画能够实现
    setTimeout('updateBoard()', 200);
    return true;
}
//向下移动
function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockCol(j, i, k, board)) {
                        //移动
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] === board[i][j] && noBlockCol(j, i, k, board) && !hasAdd[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //相加操作
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j]; //增加增加相应分数
                        updateScore(); //更新分数
                        hasAdd[k][j] = true;
                        isGameWin();
                        continue;
                    }
                }
            }
        }
    }
    //刷新表格 使用setTimeout使得移动动画能够实现
    setTimeout('updateBoard()', 200);
    return true;
}
//游戏结束 显示Gameover
function isGameover() {
    if (!ifSpace(board) && noMove(board)) {
        var gameOver = document.querySelector('.game-over');
        gameOver.style.display = 'block';
        var p = gameOver.children[0];
        p.innerHTML = 'Game Over!';
        p.className = 'lose';
        //游戏结束 点击try again
        document.querySelector('.try-again').onclick = function() {
            gameOver.style.display = 'none';
            p.innerHTML = '';
            p.className = '';
        }
    }
}
//得到2048，游戏胜利
function isGameWin() {
    if (is2048(board)) {
        var gameWin = document.querySelector('.game-over');
        var p = gameWin.children[0];
        gameWin.style.display = 'block';
        p.innerHTML = 'You win!';
        p.className = 'win';
        //游戏结束 点击try again
        document.querySelector('.try-again').onclick = function() {
            gameWin.style.display = 'none';
            p.innerHTML = '';
            p.className = '';
        }
    }
}