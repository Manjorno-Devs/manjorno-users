import axios from 'axios';
import dotenv from 'dotenv';

const env = dotenv.config();

const IsUserPasswordCorrect = async (username, password) => {
    const params= new URLSearchParams();
    params.append('client_id', 'admin-cli');
    params.append('client_secret', process.env.KEYCLOAK_CLIENTCLI_SECRET);
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');
    const headers = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    let result;
    await axios.post(`${process.env.KEYCLOAK_URL}/realms/Manjorno/protocol/openid-connect/token`, params, headers)
        .then(() => {
                result = true;
        })
        .catch(() => {
            result = false;
        });
    return result;
}

export default IsUserPasswordCorrect;
