import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

app.use(express.json());
app.use(cookieParser())

app.use("/api", router)

export default app;