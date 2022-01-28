import UserRestaurantsService from "../services/UserRestaurantService.js";

export default class UserRestaurantController {
    static AddANewEmployee = (req, res) => {
        try {
            const {userId, restaurantId, restaurantName, position} = req.body;

            UserRestaurantsService.CreateRestaurantUserRelation(userId, restaurantId, restaurantName, position);

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json(error);
        }
    }
} 