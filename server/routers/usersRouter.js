import { Router } from "express";
const router = Router();

import db from "../database/connection.js";
import {
    isLoggedIn,
    isAccessingOwnUser,
} from "../middleWare/authMiddleWare.js";
import {
    compareHashedPasswords,
    hashPassword,
} from "../utils/passwordHashing.js";
import { sendPasswordChangedMail } from "../utils/emailUtil/emailUtil.js";

const ALLOWED_FIELDS = [
    "profile_picture",
    "name",
    "birthday",
    "weight",
    "gender",
];

router.get("/api/users/profile/:username", isLoggedIn, (req, res) => {
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
            .send({ data: { errorMessage: "User not found" } });
    }

    return res.status(200).send({ data: { profile } });
});

router.patch(
    "/api/users/:id",
    isLoggedIn,
    isAccessingOwnUser,
    async (req, res) => {
        const { id } = req.params;
        const {
            currentPassword,
            newPassword,
            confirmNewPassword,
            ...otherFields
        } = req.body;

        const updates = Object.keys(otherFields).filter((key) =>
            ALLOWED_FIELDS.includes(key),
        );

        if (updates.length === 0 && !newPassword) {
            return res
                .status(400)
                .send({ data: { errorMessage: "No valid fields provided" } });
        }

        if (newPassword) {
            if (!currentPassword || !newPassword) {
                return res
                    .status(400)
                    .send({
                        data: {
                            errorMessage: "Current & new password is required",
                        },
                    });
            }
            if (newPassword !== confirmNewPassword) {
                return res
                    .status(400)
                    .send({ data: { errorMessage: "Passwords do not match" } });
            }

            const dbUser = db
                .prepare("SELECT password FROM users WHERE id = ?")
                .get(id);
            if (!dbUser) {
                return res
                    .status(404)
                    .send({ data: { errorMessage: "User not found" } });
            }

            const passwordMatch = await compareHashedPasswords(
                currentPassword,
                dbUser.password,
            );
            if (!passwordMatch) {
                return res
                    .status(401)
                    .send({
                        data: { errorMessage: "Current password is incorrect" },
                    });
            }

            updates.push("password");
            otherFields.password = await hashPassword(newPassword);
        }

        const fields = updates.map((field) => `${field} = ?`).join(", ");
        const values = updates.map((key) => otherFields[key]);

        db.prepare(`UPDATE users SET ${fields} WHERE id = ?`).run(
            ...values,
            id,
        );

        updates
            .filter((k) => k !== "password")
            .forEach((key) => {
                req.session.user[key] = otherFields[key];
            });

        if (updates.includes("password")) {
            sendPasswordChangedMail(
                req.session.user.email,
                req.session.user.username,
            ).catch((error) => {
                console.log(error);
            });
        }

        return res
            .status(200)
            .send({ data: { successMessage: "User updated" } });
    },
);

export default router;
