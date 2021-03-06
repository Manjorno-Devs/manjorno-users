const Authenticate = async (KeycloakAdminClient) => {
    try {
        console.log(process.env.KEYCLOAK_USERNAME);
        console.log(process.env.KEYCLOAK_PASSWORD);
        console.log(process.env.KEYCLOAK_CLIENTCLI_SECRET);
        return await KeycloakAdminClient.auth({

            clientSecret: process.env.KEYCLOAK_CLIENTCLI_SECRET,
            username: process.env.KEYCLOAK_USERNAME,
            password: process.env.KEYCLOAK_PASSWORD,
            grantType: 'password',
            clientId: 'admin-cli'
        });
    } catch (error) {
        console.log(error);
    }
}

export default Authenticate;