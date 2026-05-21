import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'
import setupSwagger from './config/swagger.js'
import { env } from './config/env.js';

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true,
    // ✅ Ajouter les méthodes et headers explicitement
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
 }));
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

app.use(express.json());
app.use(cookieParser())

app.use("/api", router)
setupSwagger(app);

export default app;