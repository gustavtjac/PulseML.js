import { Router } from "express";
const router = Router();

import db from "../database/connection.js";

router.get("/countries", (req, res) => {

    console.log("Her")
    const countries = db.prepare("SELECT * FROM countries ORDER BY name ASC").all();

    return res.status(200).send({ data: { countries } });
});

router.get("/countries/:id", (req, res) => {
    const { id } = req.params;

    const country = db.prepare("SELECT * FROM countries WHERE id = ?").get(id);

    if (!country) {
        return res.status(404).send({
            data: { errorMessage: "Country not found" },
        });
    }

    return res.status(200).send({ data: { country } });
});

export default router;