import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/api/ws' });

const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory active multiplayer rooms
interface ServerRoom {
  code: string;
  name: string;
  hostId: string;
  createdAt: number;
  clients: Map<string, WebSocket>;
  state: any;
}

const rooms = new Map<string, ServerRoom>();

// Clean up stale rooms every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (room.clients.size === 0 && now - room.createdAt > 30 * 60 * 1000) {
      rooms.delete(code);
    }
  }
}, 10 * 60 * 1000);

// API Endpoints
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: Date.now(), activeRooms: rooms.size });
});

app.get('/api/rooms', (_req, res) => {
  const roomList = Array.from(rooms.values()).map((r) => ({
    code: r.code,
    name: r.name,
    playerCount: r.clients.size,
    createdAt: r.createdAt
  }));
  res.json({ rooms: roomList });
});

// WebSocket real-time communication
wss.on('connection', (ws: WebSocket) => {
  let currentRoomCode: string | null = null;
  let playerId: string | null = null;

  ws.on('message', (data: string) => {
    try {
      const msg = JSON.parse(data.toString());
      const { type, payload } = msg;

      switch (type) {
        case 'JOIN_ROOM': {
          const { roomCode, player } = payload;
          playerId = player.id;
          currentRoomCode = roomCode;

          let room = rooms.get(roomCode);
          if (!room) {
            room = {
              code: roomCode,
              name: `Комната ${roomCode}`,
              hostId: player.id,
              createdAt: Date.now(),
              clients: new Map(),
              state: null
            };
            rooms.set(roomCode, room);
          }

          room.clients.set(player.id, ws);

          // Broadcast to everyone in room that a player joined
          const broadcastMsg = JSON.stringify({
            type: 'PLAYER_JOINED',
            payload: {
              player,
              clientCount: room.clients.size
            }
          });

          for (const client of room.clients.values()) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastMsg);
            }
          }
          break;
        }

        case 'SYNC_STATE': {
          if (!currentRoomCode) return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          room.state = payload.gameState;

          const broadcastMsg = JSON.stringify({
            type: 'STATE_UPDATED',
            payload: {
              gameState: room.state,
              senderId: playerId
            }
          });

          for (const [id, client] of room.clients.entries()) {
            if (id !== playerId && client.readyState === WebSocket.OPEN) {
              client.send(broadcastMsg);
            }
          }
          break;
        }

        case 'SEND_ACTION': {
          if (!currentRoomCode) return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          const broadcastMsg = JSON.stringify({
            type: 'ROOM_ACTION',
            payload: {
              action: payload.action,
              senderId: playerId
            }
          });

          for (const [id, client] of room.clients.entries()) {
            if (id !== playerId && client.readyState === WebSocket.OPEN) {
              client.send(broadcastMsg);
            }
          }
          break;
        }

        case 'CHAT': {
          if (!currentRoomCode) return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          const broadcastMsg = JSON.stringify({
            type: 'NEW_CHAT',
            payload: {
              message: payload.message
            }
          });

          for (const client of room.clients.values()) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastMsg);
            }
          }
          break;
        }
      }
    } catch (err) {
      console.error('WS message handling error:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoomCode && playerId) {
      const room = rooms.get(currentRoomCode);
      if (room) {
        room.clients.delete(playerId);
        const leaveMsg = JSON.stringify({
          type: 'PLAYER_LEFT',
          payload: { playerId, clientCount: room.clients.size }
        });
        for (const client of room.clients.values()) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(leaveMsg);
          }
        }
      }
    }
  });
});

// Setup Vite or static serving
async function setupServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Munchkin Online] Server listening on port ${PORT} (dev: ${isDev})`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
