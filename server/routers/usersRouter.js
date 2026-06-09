import { Router } from 'express';

import db from '../database/connection.js';
import {
    isLoggedIn,
    isAccessingOwnUser,
} from '../middleWare/authMiddleWare.js';
import {
    compareHashedPasswords,
    hashPassword,
} from '../utils/passwordHashing.js';
import { sendPasswordChangedMail } from '../utils/emailUtil/emailUtil.js';
import { liveStreak } from '../utils/streakUtil.js';
const router = Router();

router.get('/api/users/:username', isLoggedIn, (req, res) => {
    const { username } = req.params;
    const profile = db
        .prepare(
            `
        SELECT u.id, u.username, u.name, u.profile_picture, u.created_at, u.birthday, u.weight, u.gender,
               c.name AS country_name, c.code AS country_code
        FROM users u
        LEFT JOIN countries c ON u.country_id = c.id
        WHERE u.username = ?
    `,
        )
        .get(username);

    if (!profile) {
        return res
            .status(404)
            .send({ data: { errorMessage: 'User not found' } });
    }

    profile.streak = liveStreak(profile.id);

    return res.status(200).send({ data: { profile } });
});

router.patch(
    '/api/users/:id',
    isLoggedIn,
    isAccessingOwnUser,
    async (req, res) => {
        const { id } = req.params;
        const {
            currentPassword,
            newPassword,
            confirmNewPassword,
            profile_picture: profilePicture,
            name,
            birthday,
            weight,
            gender,
        } = req.body;

        const otherFields = {
            profile_picture: profilePicture,
            name,
            birthday,
            weight,
            gender,
        };
        const updates = Object.keys(otherFields).filter(
            (key) => otherFields[key] !== undefined,
        );

        if (updates.length === 0 && !newPassword) {
            return res
                .status(400)
                .send({ data: { errorMessage: 'No valid fields provided' } });
        }

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).send({
                    data: {
                        errorMessage: 'Current & new password is required',
                    },
                });
            }
            if (newPassword !== confirmNewPassword) {
                return res
                    .status(400)
                    .send({ data: { errorMessage: 'Passwords do not match' } });
            }

            const dbUser = db
                .prepare('SELECT password FROM users WHERE id = ?')
                .get(id);
            if (!dbUser) {
                return res
                    .status(404)
                    .send({ data: { errorMessage: 'User not found' } });
            }

            const passwordMatch = await compareHashedPasswords(
                currentPassword,
                dbUser.password,
            );
            if (!passwordMatch) {
                return res.status(401).send({
                    data: { errorMessage: 'Current password is incorrect' },
                });
            }

            updates.push('password');
            otherFields.password = await hashPassword(newPassword);
        }

        const fields = updates.map((field) => `${field} = ?`).join(', ');
        const values = updates.map((key) => otherFields[key]);

        db.prepare(`UPDATE users SET ${fields} WHERE id = ?`).run(
            ...values,
            id,
        );

        updates
            .filter((k) => k !== 'password')
            .forEach((key) => {
                req.session.user[key] = otherFields[key];
            });

        if (updates.includes('password')) {
            sendPasswordChangedMail(
                req.session.user.email,
                req.session.user.username,
            ).catch((error) => {
                console.log(error);
            });
        }

        return res
            .status(200)
            .send({ data: { successMessage: 'User updated' } });
    },
);

router.delete('/api/users/:id', isLoggedIn, isAccessingOwnUser, (req, res) => {
    const userId = Number(req.params.id);

    try {
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);

        req.session.destroy();

        return res
            .status(200)
            .send({ data: { successMessage: 'User deleted' } });
    } catch (error) {
        return res
            .status(400)
            .send({ data: { errorMessage: 'Server failed to delete user' } });
    }
});

export default router;
