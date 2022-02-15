import session from "express-session";
import Keycloak from "keycloak-connect";

let keycloak;

const config = {
    "realm": "Manjorno",
    "bearer-only": true,
    "auth-server-url": "http://localhost:8080/auth/",
    "ssl-required": "external",
    "resource": "express-microservice",
    "confidential-port": 0
  }

export default function KeycloakInit() {
    if (keycloak) {
        return keycloak;
    } else {
        const memoryStore = new session.MemoryStore();
        keycloak = new Keycloak({
            secret: 'some secret',
            resave: false,
            saveUninitialized: true,
            store: memoryStore
        }, config);
        return keycloak;
    }
};