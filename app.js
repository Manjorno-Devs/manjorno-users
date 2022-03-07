import express from 'express';
import bp from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import routes from './src/routes.js';

const app = express();

const env = dotenv.config();
app.use(express.json());

app.use('/api/users', routes);

const port = process.env.PORT || 3100;

mongoose.connect(process.env.MONGODB_CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        app.listen(port, () => {
            console.log(`Microservice is up at port ${port}`);
        });
    })
    .catch(error => {
        console.log("Unable to connect to db!");
        console.log(error);
    });



