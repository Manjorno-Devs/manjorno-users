import express from 'express';
import bp from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import routes from './src/routes.js';
import RabbitMQConsumer from './src/controllers/rabbitmq-routes.js';
import amqp from 'amqplib/callback_api.js';

const app = express();

const env = dotenv.config();
app.use(express.json());

app.use('/api/users', routes);

amqp.connect(process.env.AMQP_CONNECTION_URL, (connectionError, connection) =>{
    if (connectionError) {
        throw connectionError
    }
    connection.createChannel((channelCreationError, channel) => {
        if (channelCreationError) {
            throw channelCreationError;
        }

        const queues = ['create_restaurant', 'update_restaurant', 'delete_restaurant', 'create_order', 'update_order'];

        queues.forEach(queueName => {
            channel.assertQueue(queueName, { durable: false });
        });

        RabbitMQConsumer(channel);

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
    });
});



