import express from 'express';

import UserController from './controllers/UserController.js';

import KeycloakInit from './helpers/InitKeycloak.js';

const router = express.Router();

const uc = new UserController();

const keycloak = KeycloakInit();

router.post('/register', async (req, res) => uc.RegisterUser(req, res));
router.get('/find', async (req, res) => uc.FindUser(req, res));
router.get('/count', async (req, res) => uc.GetUsersCount(req, res));

router.use(keycloak.middleware());

router.put('/update', keycloak.protect(), async (req, res) => uc.UpdateUser(req, res));
router.patch('/resetPassword/currentPassword', keycloak.protect(), async (req, res) => uc.ResetPasswordWithCurrentPassword(req, res));
router.patch('/resetPassword/email', keycloak.protect(), async (req, res) => uc.ResetPasswordWithEmail(req, res));
router.delete('/delete', keycloak.protect(), async(req, res) => uc.DeleteUser(req, res));

export default router;