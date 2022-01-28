import express from 'express';

import UserRestaurantController from './controllers/UserRestaurantController.js';

import KeycloakInit from '../src/configurations/InitKeycloak.js';

const router = express.Router();

const UserRestaurants = new UserRestaurantController();

const keycloak = KeycloakInit();

router.post('/registerEmployee', UserRestaurants);

// router.post('/register', async (req, res) => uc.RegisterUser(req, res));
// router.get('/find', async (req, res) => uc.FindUser(req, res));
// router.get('/count', async (req, res) => uc.GetUsersCount(req, res));

router.use(keycloak.middleware());

// router.patch('/update', keycloak.protect(), async (req, res) => uc.UpdateUser(req, res));
// router.patch('/resetPassword/currentPassword', keycloak.protect(), async (req, res) => uc.ResetPasswordWithCurrentPassword(req, res));
// router.patch('/resetPassword/email', keycloak.protect(), async (req, res) => uc.ResetPasswordWithEmail(req, res));

export default router;