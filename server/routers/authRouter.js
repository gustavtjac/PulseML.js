import { Router } from 'express';
import crypto from 'crypto';

import db from '../database/connection.js';
import {
    sendRegisterMail,
    sendPasswordResetMail,
    sendPasswordChangedMail,
} from '../utils/emailUtil/emailUtil.js';
import {
    compareHashedPasswords,
    hashPassword,
} from '../utils/passwordHashing.js';
import { isLoggedIn } from '../middleWare/authMiddleWare.js';
const router = Router();

router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({
            data: { errorMessage: 'Please fill out Username & Password' },
        });
    }

    const foundUserFromDatabase = db
        .prepare('SELECT * FROM users WHERE username = ?')
        .get(username.toLowerCase());

    if (!foundUserFromDatabase) {
        return res.status(401).send({
            data: { errorMessage: 'Wrong login information' },
        });
    }

    const passwordIsEqual = await compareHashedPasswords(
        password,
        foundUserFromDatabase.password,
    );

    if (!passwordIsEqual) {
        return res.status(401).send({
            data: { errorMessage: 'Wrong login information' },
        });
    }

    const { password: _password, ...safeUser } = foundUserFromDatabase;
    req.session.user = safeUser;

    res.status(200).send({
        data: { successMessage: 'Login succesfull' },
    });
});

router.post('/auth/register', async (req, res) => {
    const {
        username,
        name,
        password1,
        password2,
        email,
        countryId,
        birthday,
        weight,
        gender,
    } = req.body;

    if (
        !username ||
        !name ||
        !countryId ||
        !password1 ||
        !password2 ||
        !email ||
        !birthday ||
        !weight ||
        gender == null ||
        gender === ''
    ) {
        return res.status(400).send({
            data: { errorMessage: 'Please fill out all information fields' },
        });
    }

    if (password1 !== password2) {
        return res.status(400).send({
            data: { errorMessage: 'Passwords do not match' },
        });
    }

    try {
        const existingUser = db
            .prepare('SELECT username FROM users WHERE username = ?')
            .get(username);

        if (existingUser) {
            return res.status(409).send({
                data: { errorMessage: 'Username already exists' },
            });
        }

        const hashedPassword = await hashPassword(password1);

        db.prepare(
            'INSERT INTO users (username, name, password, email, country_id, birthday, weight, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ).run(
            username.toLowerCase(),
            name,
            hashedPassword,
            email,
            countryId,
            birthday,
            weight,
            gender,
        );

        sendRegisterMail(email, username).catch((error) => {
            console.error(error);
        });

        return res.status(201).send({
            data: { successMessage: 'Account registered' },
        });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).send({
                data: { errorMessage: 'Email or username is already taken' },
            });
        }
        return res.status(500).send({
            data: { errorMessage: 'Something went wrong, please try again' },
        });
    }
});

router.post('/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res
            .status(400)
            .send({ data: { errorMessage: 'Email must be filled out' } });
    }

    const foundUserFromDatabase = db
        .prepare('SELECT id, username FROM users WHERE email = ?')
        .get(email.toLowerCase());

    if (!foundUserFromDatabase) {
        return res.status(200).send({
            data: {
                successMessage:
                    'If that email exists, a reset link has been sent',
            },
        });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 900000;

    db.prepare(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
    ).run(token, expires, foundUserFromDatabase.id);

    try {
        await sendPasswordResetMail(
            email,
            foundUserFromDatabase.username,
            token,
        );
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({ data: { errorMessage: 'Failed to send reset email' } });
    }

    res.status(200).send({
        data: {
            successMessage: 'If that email exists, a reset link has been sent',
        },
    });
});

router.post('/auth/reset-password', async (req, res) => {
    const { email, password, confirmPassword, resetToken } = req.body;

    if (!email || !password || !confirmPassword || !resetToken) {
        return res
            .status(400)
            .send({ data: { errorMessage: 'All fields are required' } });
    }

    if (password !== confirmPassword) {
        return res
            .status(400)
            .send({ data: { errorMessage: 'Passwords do not match' } });
    }

    const user = db
        .prepare(
            'SELECT id, username, email, reset_token, reset_token_expires FROM users WHERE email = ?',
        )
        .get(email.toLowerCase());

    if (
        !user ||
        user.reset_token !== resetToken ||
        Date.now() > user.reset_token_expires
    ) {
        return res
            .status(400)
            .send({ data: { errorMessage: 'Invalid or expired reset link' } });
    }

    const hashedPassword = await hashPassword(password);

    db.prepare(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
    ).run(hashedPassword, user.id);

    await sendPasswordChangedMail(user.email, user.username).catch(() => {});

    res.status(200).send({
        data: { successMessage: 'Password reset successfully' },
    });
});

router.get('/auth/me', isLoggedIn, (req, res) => {
    res.status(200).send({ data: { user: { ...req.session.user } } });
});

router.post('/auth/logout', isLoggedIn, (req, res) => {
    req.session.destroy();
    res.status(200).send({ data: { successMessage: 'Logged out' } });
});

export default router;
