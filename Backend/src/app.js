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
app.use(cors({ 
  origin: (origin, callback) => {
    const allowed = env.FRONTEND_URL.split(',').map((url)=>url.trim())
    
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS bloqué: origin="${origin}"`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
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