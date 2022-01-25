const Authenticate = async (KeycloakAdminClient) => {
    return await KeycloakAdminClient.auth({
        username: process.env.KEYCLOAK_USERNAME,
        password: process.env.KEYCLOAK_PASSWORD,
        grantType: 'password',
        clientId: 'admin-cli',
        clientSecret: process.env.KEYCLOAK_CLIENTCLI_SECRET
    });
}

export default Authenticate;