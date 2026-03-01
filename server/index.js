require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const sequelize = require('./database/connection');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());

// Stripe webhook needs raw body, so we apply it before express.json()
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve ads.txt
app.get('/ads.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, '../ads.txt'));
});

// Serve sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(__dirname, '../client/public/sitemap.xml'));
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, '../client/public/robots.txt'));
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/radio', require('./routes/radio'));
app.use('/api/stations', require('./routes/stations'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/translations', require('./routes/translations'));

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-radio', (radioId) => {
    socket.join(`radio-${radioId}`);
    console.log(`User ${socket.id} joined radio ${radioId}`);
  });

  socket.on('leave-radio', (radioId) => {
    socket.leave(`radio-${radioId}`);
    console.log(`User ${socket.id} left radio ${radioId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('socketio', io);

// Serve static files from client/dist in production
if (process.env.NODE_ENV !== 'development') {
  const clientDistPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  // Handle client-side routing - return index.html for all non-API routes
  app.get('*', (req, res, next) => {
    // Skip API routes and health check
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    // Use sync without alter to avoid recreating indexes
    // For schema changes, use migrations instead
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
    process.exit(1);
  });

module.exports = { app, io };
