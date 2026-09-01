// Khởi tạo bàn cờ vua với đường dẫn ảnh nằm chung thư mục gốc
var config = {
  draggable: true,
  position: 'start',
  // Trỏ thẳng tới tên file ảnh nằm ở thư mục gốc hiện tại
  pieceTheme: '{piece}.png',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

var board = Chessboard('board', config);

var game = new Chess();

function onDragStart (source, piece, position, orientation) {
  // Không cho phép đi quân khi game đã kết thúc
  if (game.game_over()) return false;

  // Chỉ cho phép di chuyển quân của lượt hiện tại
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop (source, target) {
  // Kiểm tra nước đi hợp lệ
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // Mặc định phong hậu khi tốt đi đến cuối bàn cờ
  });

  // Nếu nước đi không hợp lệ thì trả về quân cờ về vị trí cũ
  if (move === null) return 'snapback';

  updateStatus();
}

// Cập nhật lại vị trí bàn cờ sau khi quân cờ di chuyển xong
function onSnapEnd () {
  board.position(game.fen());
}

function updateStatus () {
  var status = '';

  var moveColor = 'Trắng';
  if (game.turn() === 'b') {
    moveColor = 'Đen';
  }

  // Kiểm tra chiếu hết (Checkmate)
  if (game.in_checkmate()) {
    status = 'Trận đấu kết thúc, quân ' + moveColor + ' đã bị chiếu hết!';
  }
  // Kiểm tra hòa cờ (Draw)
  else if (game.in_draw()) {
    status = 'Trận đấu kết thúc, hòa cờ!';
  }
  // Trận đấu đang diễn ra bình thường
  else {
    status = 'Đến lượt quân: ' + (game.turn() === 'w' ? 'Trắng' : 'Đen');
    if (game.in_check()) {
      status += ', quân ' + moveColor + ' đang bị chiếu!';
    }
  }

  // Hiển thị trạng thái lên web
  var statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.innerHTML = status;
  }
}

// Cập nhật trạng thái ban đầu khi load trang
updateStatus();