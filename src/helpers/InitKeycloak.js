import session from "express-session";
import Keycloak from "keycloak-connect";
import dotenv from 'dotenv';

let keycloak;

const env = dotenv.config();

const config = {
    "realm": "Manjorno",
    "bearer-only": true,
    "auth-server-url": process.env.KEYCLOAK_URL,
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