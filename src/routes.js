import express from 'express';

import UserController from './controllers/UserController.js';

import KeycloakInit from '../src/configurations/InitKeycloak.js';

const router = express.Router();

const uc = new UserController();

const keycloak = KeycloakInit();

router.post('/register', async (req, res) => uc.RegisterUser(req, res));
router.get('/find', async (req, res) => uc.FindUser(req, res));
router.get('/count', async (req, res) => uc.GetUsersCount(req, res));

router.use(keycloak.middleware());

router.patch('/update', keycloak.protect(), async (req, res) => uc.UpdateUser(req, res));
router.patch('/resetPassword', keycloak.protect(), async (req, res) => uc.ResetPassword(req, res));

export default router;