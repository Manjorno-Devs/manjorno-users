//modules
import mongoose from 'mongoose';

//models
import UserOrders from "../models/UserOrders.js"

class UserOrdersService {
    static CreateOrder = (orderId, userId, restaurantId, restaurantName, position, dateTimeOrdered) => {
        UserOrders.create({orderId, userId, restaurantId, restaurantName, position, dateTimeOrdered});
    }

    static GetOrders = (orderId, restaurantName, dateTimeOrdered) => {
        const orders = UserOrders.find({orderId, restaurantName, dateTimeOrdered});
        return orders;
    }

    static UpdateOrder = (orderId, restaurantName, itemsOrdered) => {
        const order = UserOrders.find(orderId);
        if (!order) {
            return Error("The Order ID is not found!");
        }
        UserOrders.updateOne({orderId}, {restaurantName, itemsOrdered });
    }
}

export default UserOrdersService;