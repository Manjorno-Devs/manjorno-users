import UserService from '../services/user.service.js';

export const RegisterUser = (req, res) => {
    const {username, password, email, profilePicture} = req.body;
    UserService.RegisterUser(username, password, email);
}