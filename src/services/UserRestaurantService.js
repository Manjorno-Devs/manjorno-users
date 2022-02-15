//modules
import mongoose from 'mongoose';

//models
import UserRestaurants from '../models/UserRestaurants.js';

class UserRestaurantsService {
    static CreateRestaurantUserRelation = (userId, restaurantId, restaurantName, position, dateTimeAdded) => {
        const _id = mongoose.Types.ObjectId();
        UserRestaurants.create({_id, userId, restaurantId, restaurantName, position, dateTimeAdded});
        return _id;
    }

    static GetRestaurantsUserRelations = (_id, userId, restaurantId, restaurantName) => {
        const userRestaurantRelation = UserRestaurants.find({userId, restaurantId, restaurantName});
        return userRestaurantRelation;
    }
    static UpdateRestaurantUserRelation = (restaurantId, restaurantName, position) => {
        const relation = UserRestaurants.find(restaurantId);
        if (!relation) {
            return Error("The restaurant ID is not found!");
        }
        UserRestaurants.updateOne({restaurantId}, {restaurantName, position });       
    }
    static DeleteRestaurantUserRelation = async (restaurantId) => {
        const relation = UserRestaurants.find(restaurantId);
        if (!relation) {
            return Error("The restaurant ID is not found!");
        }
        UserRestaurants.deleteMany({restaurantId});
    }
}

export default UserRestaurantsService