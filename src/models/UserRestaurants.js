import mongoose from 'mongoose';

const UserRestaurants = mongoose.model('UserRestaurants', new mongoose.Schema({
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
        type: String,
        enum: ['employee', 'manager'],
        required: true,
    },
    dateTimeAdded: {
        type: Date,
        default: new Date()
    },
    workingHere: {
        type: Boolean,
        default: true
    }
}));

export default UserRestaurants;