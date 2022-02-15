import UserRestaurants from "../models/UserRestaurants.js";
import UserRestaurantsService from "../services/UserRestaurantService.js";

class UserRestaurantController {

    constructor(){}

    static AddANewEmployee = (req, res) => {
        try {
            const {userId, restaurantId, restaurantName, position} = req.body;

            UserRestaurantsService.CreateRestaurantUserRelation(userId, restaurantId, restaurantName, position);

            const message = "User created successfully!";

            res.status(200).json({message});

        } catch (error) {
            res.status(500).json(error);
        }
    }

    static GetRestaurantRelations(req, res) {
        try {
            const { relationId, userId, username, restaurantId, restaurantName } = req.body;

            if (username) {
                
            }

        } catch (error) {
            res.status(500).json(error);
        }
    }
} 

export default UserRestaurantController;