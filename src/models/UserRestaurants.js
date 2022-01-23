import mongoose from 'mongoose';

export default UserRestaurants = mongoose.model('UserRestaurants', new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    restaurantId: {
        type: mongoose.ObjectId,
        ref: 'Restaurants'
    },
    restaurantName: {
        type: String,
        required: true
    },
    position: {
        type: Array,
        required: true,
    },
    dateTimeAdded: {
        type: DateTime,
        default: new DateTime()
    }
}));