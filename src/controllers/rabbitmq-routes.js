import UserRestaurantsController from "../services/UserRestaurantService.js";

const RabbitMQConsumer = async (channel, queues) => {
    
    channel.consume('create_restaurant', payload => {
        const {userId, restaurantId, restaurantName, position, dateTimeAdded} = JSON.parse(payload.content.toString());
        UserRestaurantsController.CreateRestaurantUserRelation(userId, restaurantId, restaurantName, position, dateTimeAdded);
        channel.ack(payload);
    });

}

export default RabbitMQConsumer;