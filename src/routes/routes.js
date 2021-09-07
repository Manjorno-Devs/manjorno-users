import express from 'express';

import { LoginUser, RegisterUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/RegisterUser', (req, res) => {
    RegisterUser(req, res);
});

router.post('/LoginUser', (req, res) => {
    LoginUser(req, res);
})

router.get('/set-cookies', (req, res) => {
    res.cookie('kiro', "yes", { httpOnly: true, maxAge: 100000000});
    res.status(200).json({"message":"check cookies"});
});

router.get('/read-cookies', (req, res) => {
    const {kiro} = req.cookies;
    res.status(200).json(kiro);
});

export default router;