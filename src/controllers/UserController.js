import KCAdminClient from 'keycloak-admin';
const kcAdminClient = KCAdminClient.default;

class UserController{

    KeycloakAdminClient;

    

    constructor(){
        this.KeycloakAdminClient = new kcAdminClient({ realmName: "Manjorno" });
        
    }

    async RegisterUser(req, res) {
        try {
            const {username, email, password} = req.body;

            await this.KeycloakAdminClient.auth({
                username: 'Backendapp',
                password: 'xgG.z;9W.2ox$"ZQp@Z,%T<*OI.r+-',
                grantType: 'password',
                clientId: 'admin-cli',
                clientSecret: '65b8da5b-0391-4e30-8ef6-4fb85b95fb28'
            });

            await this.KeycloakAdminClient.users.create({
                username: username,
                email: email,
                credentials: [{"type":"password","value":password,"temporary":false}],
                enabled: true
            });
        
        
            const users = await this.KeycloakAdminClient.users.find({
                username
            });
        
            res.status(200).json({users});
        } catch (error) {
            const message = "User creation error! Are you sure you haven't registered yet?"
            res.status(400).json({message});
        }

        
    }

}

export default UserController;