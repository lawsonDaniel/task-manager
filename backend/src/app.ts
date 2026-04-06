import express, { Application } from 'express';
import cors from 'cors';
import router from './routes/index';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// CORS configuration
// Example with specific origins
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use('/api/v1', router);
app.use(errorHandler);

export default app;