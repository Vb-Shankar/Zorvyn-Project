const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { authenticate } = require('./middlewares/authMiddleware');
const { authorize } = require('./middlewares/rbacMiddleware');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const { ROLES } = require('./utils/constants');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy - Shankar ',
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/users', authenticate, authorize(ROLES.ADMIN), userRoutes);
app.use('/api/records', authenticate, recordRoutes);
app.use('/api/dashboard', authenticate, authorize(ROLES.ADMIN, ROLES.ANALYST), dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
