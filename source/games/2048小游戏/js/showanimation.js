//产生新的随机数动画
function showNumberAnimation(X, Y, ranNum) {
    // var numCell = document.getElementById('number-cell-' + X + '-' + Y);
    // numCell.style.backgroundColor = getBgc(ranNum);
    // numCell.style.color = getColor(ranNum);
    // numCell.innerHTML = ranNum;
    // numCell.style.width = 100 + 'px';
    // numCell.style.height = 100 + 'px';
    // numCell.style.top = 20 + X * 120 + 'px';
    // numCell.style.left = 20 + Y * 120 + 'px';

    var numCell = $('#number-cell-' + X + '-' + Y);
    numCell.css('background-color', getBgc(ranNum));
    numCell.css('color', getColor(ranNum));
    numCell.text(ranNum);
    numCell.animate({
        width: cellSildLength,
        height: cellSildLength,
        top: getTop(X),
        left: getLeft(Y)
    }, 50);
}

//移动动画
function showMoveAnimation(fromx, fromy, tox, toy) {
    var numCell = $('#number-cell-' + fromx + '-' + fromy);
    numCell.animate({
        top: getTop(tox),
        left: getLeft(toy)
    }, 200);
}