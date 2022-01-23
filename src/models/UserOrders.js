import mongoose from 'mongoose';

export default UserOrders = mongoose.model('UserOrders', new mongoose.Schema({
    ordererId: {
        type: String,
        required: true
    },
    {

    },
    restaurantId: {
        type: mongoose.ObjectId,
        ref: 'Restaurants'
    },
    restaurantName: {
        type: String,
        required: true
    },
    itemsOrdered: {
        type: Array,
        required: true,
    },
    dateTimeOrdered: {
        type: DateTime,
        default: new DateTime()
    }
}));