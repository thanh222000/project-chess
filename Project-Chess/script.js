var board = null;
var game = new Chess();

function onDragStart (source, piece, position, orientation) {
    if (game.game_over()) return false;

    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop (source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    updateStatus();
}

function onSnapEnd () {
    board.position(game.fen());
}

function updateStatus () {
    var status = '';
    var moveColor = (game.turn() === 'w') ? 'Trắng' : 'Đen';

    if (game.in_checkmate()) {
        status = 'Chiếu hết! ' + (game.turn() === 'w' ? 'Đen' : 'Trắng') + ' đã thắng!';
    } else if (game.in_draw()) {
        status = 'Ván đấu hòa!';
    } else {
        status = 'Đến lượt quân: ' + moveColor;
        if (game.in_check()) {
            status += ' (Đang bị chiếu!)';
        }
    }

    $('#game-status').text(status);
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    // Tự động liên kết với bộ ảnh wk.png, wp.png,... bạn đang có trong thư mục
    pieceTheme: function(piece) {
        return piece.toLowerCase() + '.png';
    }
};

board = Chessboard('board', config);
updateStatus();