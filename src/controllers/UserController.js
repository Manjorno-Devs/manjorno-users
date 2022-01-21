import KCAdminClient, { requiredAction } from 'keycloak-admin';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import { RequiredActionAlias } from 'keycloak-admin/lib/defs/requiredActionProviderRepresentation.js';
// /lib/defs/requiredActionProviderRepresentation

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
    paramsToCheckPassword.append('client_secret', process.env.KEYCLOAK_CLIENTCLI_SECRET);
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
            const {username, email, password, repeatPassword, firstName, lastName} = req.body;

            if (username === undefined || email === undefined || password === undefined || repeatPassword === undefined) {
                const error = "The body has missing fields!";
                res.status(400).json({error});
                return;
            }

            if (password !== repeatPassword) {
                const error = "Passwords do not match!";
                res.status(400).json({error});
                return;
            }

            let user = await this.KeycloakAdminClient.users.findOne({username, email});

            if (user[0]) {
                const error = "User already exists!";
                res.status(400).json({error});
                return;
            }

            await this.KeycloakAdminClient.users.create({
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName,
                credentials: [{"type":"password","value":password,"temporary":false}],
                requiredActions: [requiredAction.VERIFY_EMAIL],
                enabled: true
            });

            user = await this.KeycloakAdminClient.users.findOne({username, email});

            this.KeycloakAdminClient.users.executeActionsEmail({
                id: user[0].id,
                lifespan: 43200,
                actions: [RequiredActionAlias.VERIFY_EMAIL],
            });
            
            const message = "User registered successfully! Check your E-Mail inbox to verify your email!"
            res.status(200).json({message});
        } catch (error) {
            res.status(500).json(error);
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

            await this.KeycloakAdminClient.users.update(
                { id:userIdFromToken },
                {username:username, email:email, firstName:firstName, lastName:lastName}
            );

            
            
            const message = "User updated successfully!"
            res.status(200).json({message});
        } catch (error) {
            res.status(500).json(error);
        }
        
    }

    async ResetPassword(req, res) {
        try {
            const token = jwt.decode(req.headers.authorization.split(' ')[1]);
            const userIdFromToken = token.sub;

            this.KeycloakAdminClient.users.executeActionsEmail({
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