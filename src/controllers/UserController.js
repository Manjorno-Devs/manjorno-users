import KCAdminClient, { requiredAction } from 'keycloak-admin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RequiredActionAlias } from 'keycloak-admin/lib/defs/requiredActionProviderRepresentation.js';

import Authenticate from './helpers/AuthenticateKeycloak.js';
import IsUserPasswordCorrect from './helpers/CheckPassword.js';

const env = dotenv.config();

let KeycloakAdminClient;

class UserController{


    //Initializes the Keycloak admin client 
    //and authenticates an admin user that will execute all of the CRUD operations to Keycloak
    constructor(){
        KeycloakAdminClient = new KCAdminClient.default({ realmName: "Manjorno" });
        Authenticate(KeycloakAdminClient);
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
            let user = await KeycloakAdminClient.users.findOne({username, email});

            //if it exists then it returns an error
            if (user[0]) {
                const error = "User with such username or email already exists!";
                res.status(400).json({error});
                return;
            }

            //if everything is fine, it creates the user
            //requiredActions marks that an email should be sent to the user
            //to confirm the email address
            await KeycloakAdminClient.users.create({
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName,
                credentials: [{"type":"password","value":password,"temporary":false}],
                requiredActions: [requiredAction.VERIFY_EMAIL],
                enabled: true
            });

            //Searches for the newly created user
            user = await KeycloakAdminClient.users.findOne({username, email});

            //sent an email to confirm the email address
            KeycloakAdminClient.users.executeActionsEmail({
                id: user[0].id,
                lifespan: 43200,
                actions: [RequiredActionAlias.VERIFY_EMAIL],
            });
            
            //returns a success message
            const message = "User registered successfully! Check your E-Mail inbox to verify your email!"
            res.status(200).json({message});
        } catch (error) {
            res.status(500).json(error);
        }
    }

    //used to search for an user
    async FindUser(req, res) {
        try {
            //gets the one of those parametes needed to seach for an user
            const {id, username, email} = req.query;

            //does the actual searching
            const user = await KeycloakAdminClient.users.findOne({id, username, email});

            //Returns an error if an user doesn't exist
            if (!user) {
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
            const userCount = await KeycloakAdminClient.users.count() - 1;
            
            res.status(200).json({userCount});
        } catch (error) {
            res.status(500).json(error);
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
            const user = await KeycloakAdminClient.users.findOne({userIdFromToken});

            //If a user id from the token is not found in Keycloak, it yields an error
            if (!user[0]) {
                const error = "User not found!";
                res.status(401).json({error});
                return;
            }

            if (!(await IsUserPasswordCorrect(usernameFromToken, currentPassword))) {
                const error = "Incorrect password! Please reset your password through your e-mail!"
                res.status(403).json({error});
                return;
            }

            //Request to keycloak to update the details
            await KeycloakAdminClient.users.update(
                { id:userIdFromToken },
                {username, email, firstName, lastName}
            );
            
            //returns a success message
            const message = "User updated successfully!"
            res.status(200).json({message});
        } catch (error) {
            res.status(500).json(error);
        }
        
    }

    async ResetPasswordWithCurrentPassword(req, res) {
        try {
            //gets the authorization token
            const token = jwt.decode(req.headers.authorization.split(' ')[1]);
            //gets the username from the authorization token
            const usernameFromToken = token.preferred_username

            //getting the needed parametes from the body
            const {currentPassword, newPassword, repeatPassword} = req.body;

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

            KeycloakAdminClient.users.executeActionsEmail({
                id: userIdFromToken,
                lifespan: 43200,
                actions: [RequiredActionAlias.UPDATE_PASSWORD],
            });

            const message = "Please check your e-mail inbox for the link to reset your password!";
            res.status(200).json({message});
        } catch (err) {
            res.status(500).json({err});
        }
    }    
}

export default UserController;