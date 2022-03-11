import KCAdminClient, { requiredAction } from 'keycloak-admin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RequiredActionAlias } from 'keycloak-admin/lib/defs/requiredActionProviderRepresentation.js';

import UserService from '../services/UserService.js';

import Authenticate from '../helpers/AuthenticateKeycloak.js';
import IsUserPasswordCorrect from '../helpers/CheckPassword.js';

const env = dotenv.config();

class UserController{


    //Initializes the Keycloak admin client 
    //and authenticates an admin user that will execute all of the CRUD operations to Keycloak
    constructor(){
        this.UserService = new UserService();
    }

    //Registers a new user
    async RegisterUser(req, res) {
        try {
            //Gets all the needed parameters from the body
            const {username, email, password, repeatPassword, firstName, lastName} = req.body;

            //Checks for empty fields in the body and returns an error if any(except first and last name)
            if (!username || !email || !password || !repeatPassword) {
                const error = "The body has missing fields!";
                res.status(400).json({error});
                return;
            }

            //Checks if the passwords match and returns an error if they do
            if (password !== repeatPassword) {
                const error = "Passwords do not match!";
                res.status(400).json({error});
                return;
            }

            // seraches if a user with a username or email matching to that of the body exists
            let user = await this.UserService.FindUser(username, email);

            //if it exists then it returns an error
            if (user[0]) {
                const error = "User with such username or email already exists!";
                res.status(400).json({error});
                return;
            }

            //if everything is fine, it creates the user
            //requiredActions marks that an email should be sent to the user
            //to confirm the email address
            await this.UserService.AddNewUser(username, email, password, firstName, lastName);

            //Searches for the newly created user
            user = await this.UserService.FindUser(username, email);
            
            //returns a success message
            const message = "User registered successfully! Check your E-Mail inbox to verify your email!"
            res.status(200).json({message});
        } catch (error) {
            error = error.message
            res.status(500).json({error});
        }
    }

    //used to search for an user
    async FindUser(req, res) {
        try {
            //gets the one of those parametes needed to seach for an user
            const {id, username, email} = req.query;

            //does the actual searching
            const user = await this.UserService.FindUser(id, username, email);

            //Returns an error if an user doesn't exist
            if (!user[0]) {
                const error = "User could not be found!"
                res.status(400).json({error});
                return;
            }
            
            //returns the user info
            res.status(200).json({user});
        } catch (error) {
            res.status(500).json({error});
        }
    }

    //Gets the count of the currently registered users
    async GetUsersCount(req, res) {
        try {
            //extracts the admin user that does the Keycloak operations in the realm
            const userCount = await this.UserService.UserCount();
            
            res.status(200).json({userCount});
        } catch (err) {
            const error = err.message
            res.status(500).json({error});
        }
    }

    //Updates an user's details
    async UpdateUser(req, res) {
        try {
            //gets the authorization token
            const token = jwt.decode(req.headers.authorization.split(' ')[1]);
            //gets the user id from the authorization token
            const userIdFromToken = token.sub;
            //gets username from token
            const usernameFromToken = token.preferred_username
            //gets the needed parameters from the body
            const {currentPassword, username, email, firstName, lastName} = req.body;

            //finds a user with matching the id of the token
            const user = await this.UserService.FindUser(userIdFromToken);

            //If a user id from the token is not found in Keycloak, it yields an error
            if (!user[0]) {
                const error = "User not found!";
                res.status(401).json({error});
                return;
            }

            //checks if the provided password is correct
            if (!(await IsUserPasswordCorrect(usernameFromToken, currentPassword))) {
                const error = "Incorrect password! Please reset your password through your e-mail!"
                res.status(403).json({error});
                return;
            }

            //Request to keycloak to update the details
            await this.UserService.UpdateUser(userIdFromToken, username, email, firstName, lastName);
            
            //returns a success message
            const message = "User updated successfully!"
            res.status(200).json({message});
        } catch (error) {
            res.status(500).json(error.message);
        }
        
    }

    async ResetPasswordWithCurrentPassword(req, res) {
        try {
            //gets the authorization token
            const token = jwt.decode(req.headers.authorization.split(' ')[1]);
            //gets the user id from the authorization token
            const userIdFromToken = token.sub;
            //gets the username from the authorization token
            const usernameFromToken = token.preferred_username

            //getting the needed parametes from the body
            const {currentPassword, newPassword, repeatPassword} = req.body;

            //finds a user with matching the id of the token
            const user = await this.UserService.FindUser(userIdFromToken);

            //If a user id from the token is not found in Keycloak, it yields an error
            if (!user[0]) {
                const error = "User not found!";
                res.status(401).json({error});
                return;
            }

            //checking if the passwords match
            if (newPassword !== repeatPassword) {
                const error = "Passwords do not match!";
                res.status(403).json({error});
                return;
            }

            if (!(await IsUserPasswordCorrect(usernameFromToken, currentPassword))) {
                const error = "Incorrect password! Please reset your password through your e-mail!";
                res.status(403).json({error});
                return;
            }

            //request keycloak to update user's password
            await this.UserService.ResetPassword(userIdFromToken, newPassword);

            const message = "Password change successful!";
            res.status(200).json({message});
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async ResetPasswordWithEmail(req, res) {
        try {
            //gets the authorization token
            const token = jwt.decode(req.headers.authorization.split(' ')[1]);
            //gets user id from token
            const userIdFromToken = token.sub;

            //finds a user with matching the id of the token
            const user = await this.UserService.FindUser(userIdFromToken);

            //If a user id from the token is not found in Keycloak, it yields an error
            if (!user[0]) {
                const error = "User not found!";
                res.status(401).json({error});
                return;
            }

            //Reset user's password by sending the user an email a link
            await this.UserService.ResetPasswordWithEmail(userIdFromToken);

            const message = "Please check your e-mail inbox for the link to reset your password!";
            res.status(200).json({message});
        } catch (err) {
            res.status(500).json({err});
        }
    }    

    async DeleteUser(req, res) {
        try {
            //gets the authorization token
            const token = jwt.decode(req.headers.authorization.split(' ')[1]);
            //gets user id from token
            const userIdFromToken = token.sub;

            //finds a user with matching the id of the token
            const user = await this.UserService.FindUser(userIdFromToken);

            //If a user id from the token is not found in Keycloak, it yields an error
            if (!user[0]) {
                const error = "User not found!";
                res.status(401).json({error});
                return;
            }

            //Reset user's password by sending link to the user's email
            await this.UserService.DeleteUser(userIdFromToken);

            const message = "Account deleted successfully";
            res.status(200).json({message});
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}

export default UserController;