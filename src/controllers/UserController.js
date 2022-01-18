import KCAdminClient from 'keycloak-admin';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';

const env = dotenv.config();

const Authenticate = async (KeycloakAdminClient) => {
    return await KeycloakAdminClient.auth({
        username: process.env.KEYCLOAK_USERNAME,
        password: process.env.KEYCLOAK_PASSWORD,
        grantType: 'password',
        clientId: 'admin-cli',
        clientSecret: process.env.KEYCLOAK_CLIENTCLI_SECRET
    });
}

const IsUserPasswordCorrect = async (usernameFromToken, currentPassword) => {
    const paramsToCheckPassword = new URLSearchParams();
    paramsToCheckPassword.append('client_id', 'admin-cli');
    paramsToCheckPassword.append('client_secret', '65b8da5b-0391-4e30-8ef6-4fb85b95fb28');
    paramsToCheckPassword.append('username', usernameFromToken);
    paramsToCheckPassword.append('password', currentPassword);
    paramsToCheckPassword.append('grant_type', 'password');
     const passwordCheckConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      
    await axios.post('http://localhost:8080/auth/realms/Manjorno/protocol/openid-connect/token', paramsToCheckPassword, passwordCheckConfig)
        .then((result) => {
            return true;
        })
        .catch((err) => {
            return false;
        });
}

class UserController{

    KeycloakAdminClient;

    constructor(){
        this.KeycloakAdminClient = new KCAdminClient.default({ realmName: "Manjorno" });
        Authenticate(this.KeycloakAdminClient);
    }


    async RegisterUser(req, res) {
        try {
            const {username, email, password, firstName, lastName} = req.body;

            await this.KeycloakAdminClient.users.create({
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName,
                credentials: [{"type":"password","value":password,"temporary":false}],
                enabled: true
            });
            
            const message = "User registered successfully!"
            res.status(200).json({message});
        } catch (error) {
            const message = error.message;
            res.status(400).json({message});
        }
    }

    async FindUser(req, res) {
        try {
            const {id, username, email} = req.query;

            const user = await this.KeycloakAdminClient.users.findOne({id, username, email});

            if (!user) {
                const message = "User could not be found!"
                res.status(400).json({message});
                return;
            }

            res.status(200).json({user});
        } catch (error) {
            res.status(500).json({error});
        }
    }

    async GetUsersCount(req, res) {
        try {
            const userCount = await this.KeycloakAdminClient.users.count() - 1;
            res.status(200).json({userCount});
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async UpdateUser(req, res) {
        try {
            const token = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userIdFromToken = token.sub;
            const usernameFromToken = token.preferred_username;
            const {currentPassword, username, email, firstName, lastName} = req.body;

            if (IsUserPasswordCorrect(usernameFromToken, currentPassword)) {
                this.KeycloakAdminClient.users.update(
                    { id:userIdFromToken },
                    {username, email, firstName, lastName}
                );

                const message = "User updated successfully!"
                res.status(200).json({message});
            } else {
                const message = "Incorrect password!";
                    res.status(401).json({message});
            }
        } catch (error) {
            res.status(500).json(error);
        }
        
    }

    async ResetPassword(req, res) {
        try {
            const token = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userIdFromToken = token.sub;
            const usernameFromToken = token.preferred_username;

            const {currentPassword, newPassword} = req.body;

            if (IsUserPasswordCorrect(usernameFromToken, currentPassword)) {
                this.KeycloakAdminClient.users.resetPassword({
                    id: userIdFromToken,
                    credential:{
                        temporary: false,
                        type: 'password',
                        value: newPassword
                    }
                });
                
                const message = "Password updated successfully!";
                res.status(200).json({message});
            } else {
                const message = "Incorrect password!";
                res.status(401).json({message});
            }
        } catch (err) {
            const error = err.message
            res.status(500).json({err});
        }
    }

    
}

export default UserController;