import 'dotenv/config';
import express from 'express';
import routes from '../routes/index.js';
import ErrorHandler from '../middlewares/error.js';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import TicketDraftRepositories from '../services/ticket-draft/ticket-draft-repositories.js';
import cron from 'node-cron';

const app = express();
// Bungkus app Express dengan HTTP server bawaan Node.js
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Inisialisasi Socket.io dengan pengaturan CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`Frontend terhubung dengan ID: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log('Frontend terputus');
  });
});

// Membersihkan sisa draft tiket yang lolos dari timeout
cron.schedule('0 * * * *', async () => {
  try {
    const deletedDrafts = await TicketDraftRepositories.deleteExpiredDrafts(20);

    if (deletedDrafts && deletedDrafts > 0) {
      console.log(`✅ [CRON] Berhasil menghapus ${deletedDrafts.length} draft terbengkalai.`)
    } else {
      console.log('✅ [CRON] Tidak ada draft usang yang perlu dihapus.');
    }
  } catch (error) {
    console.error('❌ [CRON] Error saat membersihkan draft:', error.message);
  }
})

app.use(routes);
app.use(ErrorHandler);

export { app };
export default server;