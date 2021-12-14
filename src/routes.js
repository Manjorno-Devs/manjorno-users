import express from 'express';
import axios from 'axios';

import UserController from './controllers/UserController.js';

const router = express.Router();

const uc = new UserController();

router.get('/createUser', async (req, res) => {
    uc.RegisterUser(req, res);
});

export default router;