//modules
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'

import routes from './routes/routes.js'

const env = dotenv.config();
const app = express();


app.use (bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());

app.use('/userapi', routes);

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true, useUnifiedTopology: true})
    .then(result => {
        var port = process.env.PORT || 3100;
        console.log(`Connected to DB. Server listening on ${port}`);
        app.listen(port);
    })
    .catch(error => {
        console.log("Can't connect to database, because of this error: ");
        console.log(error);
    });

export default app;
