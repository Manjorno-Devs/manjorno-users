import KCAdminClient, { requiredAction } from 'keycloak-admin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RequiredActionAlias } from 'keycloak-admin/lib/defs/requiredActionProviderRepresentation.js';

import Authenticate from '../helpers/AuthenticateKeycloak.js';
import IsUserPasswordCorrect from '../helpers/CheckPassword.js';

const env = dotenv.config();

let KeycloakAdminClient;

class UserService {

    constructor(){
        this.KeycloakAdminClient = new KCAdminClient.default({ 
            baseUrl: process.env.KEYCLOAK_URL, 
            realmName: "Manjorno"});
    }

    //if everything is fine, it creates the user
    //requiredActions marks that an email should be sent to the user
    //to confirm the email address
    async AddNewUser (username, email, password, firstName, lastName) {
        
        await Authenticate(this.KeycloakAdminClient);

        await this.KeycloakAdminClient.users.create({
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName,
            credentials: [{"type":"password","value":password,"temporary":false}],
            requiredActions: [requiredAction.VERIFY_EMAIL],
            enabled: true
        });

        const user = await this.KeycloakAdminClient.users.find({username, email});
        const userId = user[0].id;

        //sent an email to confirm the email address
        await this.KeycloakAdminClient.users.executeActionsEmail({
            id: userId,
            lifespan: 43200,
            actions: [RequiredActionAlias.VERIFY_EMAIL],
        });
    }

    // seraches if a user with a username or email matching
    async FindUser(_id, username, email, firstName, lastName) {
        await Authenticate(this.KeycloakAdminClient);

        const user = await this.KeycloakAdminClient.users.find({username, email, firstName, lastName});
        return user;
    }

    //extracts the admin user that does the Keycloak operations in the realm
    async UserCount() {
        await Authenticate(this.KeycloakAdminClient);

        const userCount = await this.KeycloakAdminClient.users.count() - 1;
        return userCount;
    }

    //Updates an user's details
    async UpdateUser(id, username, email, firstName, lastName) {
        await Authenticate(this.KeycloakAdminClient);

        await this.KeycloakAdminClient.users.update(
            { id },
            {username, email, firstName, lastName}
        );
    }

    //Reset user's password
    async ResetPassword(_id, password) {
        await Authenticate(this.KeycloakAdminClient);
        
        await this.KeycloakAdminClient.users.resetPassword({
            id: _id,
            credential: {
              temporary: false,
              type: 'password',
              value: password,
            }});
    }

    //Reset user's password by sending link to the user's email
    async ResetPasswordWithEmail(_id) {
        await Authenticate(this.KeycloakAdminClient);

        await this.KeycloakAdminClient.users.executeActionsEmail({
            id: _id,
            lifespan: 43200,
            actions: [RequiredActionAlias.UPDATE_PASSWORD],
        });
    }

    //Deletes the user by id
    async DeleteUser(_id) {
        await Authenticate(this.KeycloakAdminClient);

        await this.KeycloakAdminClient.users.del({id:_id});
    }
}

export default UserService;