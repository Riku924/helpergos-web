const express  = require('express');
const http     = require('http');
const { Server } = require('socket.io');
const path     = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

// static files
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ── ルーム管理 ────────────────────────────────
// rooms[code] = { players: [{ id, name, index }], started }
const rooms = {};

function genCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function roomPlayers(code) {
  return (rooms[code]?.players || []).map(p => p.name);
}

io.on('connection', socket => {

  // ── ルーム作成 ──
  socket.on('create-room', ({ playerName }) => {
    let code;
    do { code = genCode(); } while (rooms[code]);
    rooms[code] = { players: [{ id: socket.id, name: playerName || 'プレイヤー1', index: 0 }], started: false };
    socket.join(code);
    socket.roomCode    = code;
    socket.playerIndex = 0;
    socket.emit('room-created', { code, playerIndex: 0 });
    io.to(code).emit('lobby-update', roomPlayers(code));
  });

  // ── ルーム参加 ──
  socket.on('join-room', ({ code, playerName }) => {
    const room = rooms[code];
    if (!room)           return socket.emit('room-error', '存在しないルームコードです');
    if (room.started)    return socket.emit('room-error', 'ゲームはすでに開始しています');
    if (room.players.length >= 12) return socket.emit('room-error', 'ルームが満員です（最大12人）');

    const idx = room.players.length;
    room.players.push({ id: socket.id, name: playerName || ('プレイヤー' + (idx + 1)), index: idx });
    socket.join(code);
    socket.roomCode    = code;
    socket.playerIndex = idx;
    socket.emit('room-joined', { code, playerIndex: idx });
    io.to(code).emit('lobby-update', roomPlayers(code));
  });

  // ── ゲーム開始（最初の参加者のみ） ──
  socket.on('start-game', () => {
    const { roomCode } = socket;
    if (!rooms[roomCode]) return;
    rooms[roomCode].started = true;
    io.to(roomCode).emit('game-start', { playerNames: roomPlayers(roomCode) });
  });

  // ── ゲームアクション中継（送信元以外全員へ） ──
  socket.on('game-action', data => {
    socket.to(socket.roomCode).emit('game-action', data);
  });

  // ── 秘密メッセージ（特定プレイヤーのみ） ──
  socket.on('private-message', ({ toIndex, text }) => {
    const room = rooms[socket.roomCode];
    if (!room) return;
    const target = room.players.find(p => p.index === toIndex);
    if (!target) return;
    io.to(target.id).emit('private-message', { fromIndex: socket.playerIndex, text });
  });

  // ── 公開チャット ──
  socket.on('chat-message', ({ text }) => {
    socket.to(socket.roomCode).emit('chat-message', { fromIndex: socket.playerIndex, text });
  });

  // ── 切断処理 ──
  socket.on('disconnect', () => {
    const code = socket.roomCode;
    if (!code || !rooms[code]) return;
    rooms[code].players = rooms[code].players.filter(p => p.id !== socket.id);
    if (rooms[code].players.length === 0) {
      delete rooms[code];
    } else {
      io.to(code).emit('lobby-update', roomPlayers(code));
      io.to(code).emit('player-left', { playerIndex: socket.playerIndex });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Hellpagos server: http://localhost:' + PORT));
