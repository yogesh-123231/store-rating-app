require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

const sanitizeMiddleware = require('./src/middleware/sanitizeMiddleware');
app.use(sanitizeMiddleware);

const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const storeRoutes = require('./src/routes/storeRoutes');
const ownerRoutes = require('./src/routes/ownerRoutes');
const {
  notFoundHandler,
  errorHandler,
} = require('./src/middleware/errorMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', storeRoutes);
app.use('/api/owner', ownerRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
