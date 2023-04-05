//
documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth;
cellSildLength = 0.18 * documentWidth;
cellSpace = 0.04 * documentWidth;

//得到定位
function getTop(i) {
    return cellSpace + i * (cellSpace + cellSildLength);
}

function getLeft(j) {
    return cellSpace + j * (cellSpace + cellSildLength);
}
//格子背景色
function getBgc(num) {
    switch (num) {
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#ede0c8";
            break;
        case 8:
            return "#f2b179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e3b";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#33b5e5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6c";
            break;
    }
    return 'black';
}

//字体颜色
function getColor(num) {
    if (num <= 4) {
        return "#776e65";
    }
    return 'white';
}
//判断是否还有空的格子
function ifSpace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                return true;
            }
        }
    }
    return false;
}
//判断能否向左移动
function canMoveLeft(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])
                    return true;
            }
        }
    }
    return false;
}
//判断能否向右移动
function canMoveRight(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])
                    return true;
            }
        }
    }
    return false;
}
//判断能否向上移动
function canMoveUp(board) {
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j])
                    return true;
            }
        }
    }
    return false;
}
//判断能否向下移动
function canMoveDown(board) {
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
                    return true;
            }
        }
    }
    return false;
}
//判断左右移动路径上没有障碍物
function noBlockRow(row, col1, col2, board) {
    for (var j = col1 + 1; j < col2; j++) {
        if (board[row][j] != 0) {
            return false;
        }
    }
    return true;
}
//判断上下移动路径上没有障碍物
function noBlockCol(col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] != 0) {
            return false;
        }
    }
    return true;
}
//判断是否还能继续游戏
function noMove(board) {
    if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board)) {
        return false;
    }
    return true;
}
//判断是否得到2048
function is2048(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] === 2048) {
                return true;
            }
        }
    }
    return false;
}