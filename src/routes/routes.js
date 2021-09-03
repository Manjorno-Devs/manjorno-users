import express from 'express';

import { RegisterUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/RegisterUser', (req, res) => {
    RegisterUser(req, res);
});

export default router;