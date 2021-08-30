//modules
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const env = dotenv.config();
const app = express();


app.use (bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.get('/', (req, res) => {
    res.status(418).json({"title":"Az sum kafe"});
});

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
