import { Router } from "express";
const router = Router();

import db from "../database/connection.js";
import { isLoggedIn, isAccessingOwnUser } from "../middleWare/authMiddleWare.js";
import { compareHashedPasswords, hashPassword } from "../utils/passwordHashing.js";

const ALLOWED_FIELDS = new Set(["profile_picture","name"]);

router.patch("/users/:id", isLoggedIn, isAccessingOwnUser, async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmNewPassword, ...otherFields } = req.body;

    const updates = Object.keys(otherFields).filter(key => ALLOWED_FIELDS.has(key));

    if (updates.length === 0 && !newPassword) {
        return res.status(400).send({ data: { errorMessage: "No valid fields provided" } });
    }

    if (newPassword) {
        if (!currentPassword) {
            return res.status(400).send({ data: { errorMessage: "Current password is required" } });
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).send({ data: { errorMessage: "Passwords do not match" } });
        }

        const dbUser = db.prepare("SELECT password FROM users WHERE id = ?").get(id);
        if (!dbUser) {
            return res.status(404).send({ data: { errorMessage: "User not found" } });
        }

        const passwordMatch = await compareHashedPasswords(currentPassword, dbUser.password);
        if (!passwordMatch) {
            return res.status(401).send({ data: { errorMessage: "Current password is incorrect" } });
        }

        updates.push("password");
        otherFields.password = await hashPassword(newPassword);
    }

    const fields = updates.map(key => `${key} = ?`).join(", ");
    const values = updates.map(key => otherFields[key]);

    db.prepare(`UPDATE users SET ${fields} WHERE id = ?`).run(...values, id);

    updates.filter(k => k !== "password").forEach(key => {
        req.session.user[key] = otherFields[key];
    });

    return res.status(200).send({ data: { successMessage: "User updated" } });
});

export default router;