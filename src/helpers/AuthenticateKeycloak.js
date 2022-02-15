const Authenticate = async (KeycloakAdminClient) => {
    try {
        return await KeycloakAdminClient.auth({
            username: process.env.KEYCLOAK_USERNAME,
            password: process.env.KEYCLOAK_PASSWORD,
            grantType: 'password',
            clientId: 'admin-cli',
            clientSecret: process.env.KEYCLOAK_CLIENTCLI_SECRET
        });
    } catch (error) {
        console.log(error);
    }
}

export default Authenticate;