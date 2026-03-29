var board = null;
var game = new Chess();
var $status = $('#status');
var whiteSquareGrey = '#a9a9a9';
var blackSquareGrey = '#696969';

// --- TURBO AI BRAIN: Fast & Smart ---
// --- FLASH-GENIUS AI: Instant & Deadly ---

const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// Simplified Evaluation for Speed
function evaluateBoard(game) {
    let totalEval = 0;
    const board = game.board();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece) {
                const val = pieceValues[piece.type];
                totalEval += (piece.color === 'w' ? val : -val);
            }
        }
    }
    return totalEval;
}

// Ultra-Fast Minimax
function minimax(game, depth, alpha, beta, isMaximizing) {
    if (depth === 0) return -evaluateBoard(game);

    var moves = game.moves();
    
    // MOVE ORDERING: Prioritize captures to prune faster
    moves.sort((a, b) => (b.indexOf('x') > -1 ? 1 : -1));

    if (isMaximizing) {
        let bestEval = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            bestEval = Math.max(bestEval, minimax(game, depth - 1, alpha, beta, false));
            game.undo();
            alpha = Math.max(alpha, bestEval);
            if (beta <= alpha) break;
        }
        return bestEval;
    } else {
        let bestEval = Infinity;
        for (let i = 0; i < moves.length; i++) {
            game.move(moves[i]);
            bestEval = Math.min(bestEval, minimax(game, depth - 1, alpha, beta, true));
            game.undo();
            beta = Math.min(beta, bestEval);
            if (beta <= alpha) break;
        }
        return bestEval;
    }
}

function makeSmartMove() {
    var moves = game.moves();
    if (game.game_over() || moves.length === 0) return;

    let bestMove = null;
    let bestValue = Infinity;

    // Use Depth 2 for INSTANT response time
    for (let i = 0; i < moves.length; i++) {
        game.move(moves[i]);
        let boardValue = minimax(game, 2, -10000, 10000, true);
        game.undo();
        if (boardValue <= bestValue) {
            bestValue = boardValue;
            bestMove = moves[i];
        }
    }

    game.move(bestMove);
    board.position(game.fen());
    updateStatus();
}

// --- BOARD UI LOGIC ---

function removeGreySquares() {
    $('#myBoard .square-55d63').css('background', '');
}

function greySquare(square) {
    var $square = $('#myBoard .square-' + square);
    var background = whiteSquareGrey;
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey;
    }
    $square.css('background', background);
}

function onDragStart(source, piece) {
    if (game.game_over()) return false;
    // Only allow player to move white pieces
    if (piece.search(/^b/) !== -1) return false;

    var moves = game.moves({
        square: source,
        verbose: true
    });
    if (moves.length === 0) return;
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
}

function onDrop(source, target) {
    removeGreySquares();
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    updateStatus();
    // AI responds 500ms after your move
    window.setTimeout(makeSmartMove, 500);
}

function onSnapEnd() {
    board.position(game.fen());
}

function updateStatus() {
    var status = '';
    var moveColor = (game.turn() === 'b') ? 'Black' : 'White';
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    } else if (game.in_draw()) {
        status = 'Game over, drawn position';
    } else {
        status = moveColor + ' to move';
        if (game.in_check()) status += ', ' + moveColor + ' is in check';
    }
    $status.html(status);
}

function onMouseoverSquare(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });
    if (moves.length === 0) return;
    greySquare(square);
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
}

function onMouseoutSquare(square, piece) {
    removeGreySquares();
}

function resetGame() {
    game.reset();
    board.start();
    updateStatus();
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    onMouseoverSquare: onMouseoverSquare,
    onMouseoutSquare: onMouseoutSquare,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

board = Chessboard('myBoard', config);
updateStatus();
