import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

import woundImageRoutes from './routes/woundImage.routes.js';

app.use('/api/v1/wound-images', woundImageRoutes)

export default app;