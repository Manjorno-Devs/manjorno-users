import express from 'express';
import bp from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import routes from './src/routes.js';

const app = express();

app.use(cors());
app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

const env = dotenv.config();

app.use('/api', routes)

const port = process.env.PORT || 3100

app.listen(port, () => {
    console.log(`Server is up at port ${port}`);
});