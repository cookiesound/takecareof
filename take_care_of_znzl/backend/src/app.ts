import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import adminRoutes from './routes/adminRoutes';
import healthRoutes from './routes/healthRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Origin 없음: 동일 출처·curl·헬스체크 등
      if (!origin) {
        callback(null, true);
        return;
      }
      if (env.clientUrls.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/game', gameRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandler);

export default app;
