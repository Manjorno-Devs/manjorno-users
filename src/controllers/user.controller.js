import jwt from 'jsonwebtoken';
import bcrypt from  'bcrypt';

import UserService from '../services/user.service.js';

export const RegisterUser = async (req, res) => {
    
    try {
        const {username, password, email, profilePicture} = req.body;
        const userByUsername = await UserService.FindUserByUsername(username);
        if (userByUsername) {
            res.status(409).json({"message": "Username is already taken!"});
            return;
        }
        const userByEmail = await UserService.FindUserByEmail(email);
        if (userByEmail) {
            res.status(409).json({"message":"User with such e-mail is already registered!"});
            return;
        }
        await UserService.RegisterUser(username, password, email);
        res.status(200).json({"message": "User registered successfully!"});
    } catch (error) {
        res.status(500).json({"title": "It's not you, it's us!", "text":`Here's a cookie in the mean time while the bug is hopefully getting fixed`, "errorMessage": `${error}`});
    }
    
};

export const LoginUser = async (req, res) => {
    const {usernameORemail, password} = req.body;
    const user = await UserService.FindUserByUsername(usernameORemail) || await UserService.FindUserByEmail(usernameORemail);
    console.log(user === null);
    if (user === null || user.password != await bcrypt.compare(password, user.password)) {
        res.status(404).json("kur");
        return;
    }
    res.status(200).json("found");
};