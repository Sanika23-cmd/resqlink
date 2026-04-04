const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'] }
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/alerts', require('./routes/alerts'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ResQLink backend running' });
});

// Socket
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Auto seed
async function autoSeed() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcryptjs');
    const prisma = new PrismaClient();

    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@resqlink.com' }
    });

    if (!existingAdmin) {
      console.log('Running auto-seed...');

      const adminHash = await bcrypt.hash('admin123', 10);

      await prisma.user.create({
        data: {
          email: 'admin@resqlink.com',
          password: adminHash,
          role: 'admin'
        }
      });

      await prisma.incident.createMany({
        data: [
          {
            type: 'flood',
            description: 'Heavy flooding in Mumbai coastal areas',
            latitude: 19.0760,
            longitude: 72.8777,
            severity: 'high',
            reportedBy: 'system'
          }
        ]
      });

      console.log('Auto-seed completed');
    }

  } catch (err) {
    console.error('Auto-seed error:', err);
  }
}

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await autoSeed();
});