import { Router } from "express";
const router = Router();

import db from "../database/connection.js";
import { sendRegisterMail } from "../utils/emailUtil/emailUtil.js";
import {compareHashedPasswords, hashPassword,} from "../utils/passwordHashing.js";
import { isLoggedIn } from "../middleWare/authMiddleWare.js";

router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({
      data: { errorMessage: "Please fill out Username & Password" },
    });
  }

  const foundUserFromDatabase = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username.toLowerCase());

  if (!foundUserFromDatabase) {
    return res.status(401).send({
      data: { errorMessage: "Wrong login information" },
    });
  }

  const passwordIsEqual = await compareHashedPasswords(
    password,
    foundUserFromDatabase.password,
  );

  if (!passwordIsEqual) {
    return res.status(401).send({
      data: { errorMessage: "Wrong login information" },
    });
  }

  const { password: _password, ...safeUser } = foundUserFromDatabase;
  req.session.user = safeUser;
  console.log(safeUser)

  res.status(200).send({
    data: { successMessage: "Login succesfull" },
  });
});

router.post("/auth/register", async (req, res) => {
  const { username, name, password1, password2, email, countryId, birthday, weight, gender } =
    req.body;

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
    gender === ""
  ) {
    return res.status(400).send({
      data: { errorMessage: "Please fill out all information fields" },
    });
  }

  if (password1 !== password2) {
    return res.status(400).send({
      data: { errorMessage: "Passwords do not match" },
    });
  }

  try {
    const existingUser = db
      .prepare("SELECT username FROM users WHERE username = ?")
      .get(username);

    if (existingUser) {
      return res.status(409).send({
        data: { errorMessage: "Username already exists" },
      });
    }

    const hashedPassword = await hashPassword(password1);

    db.prepare(
      "INSERT INTO users (username, name, password, email, country_id, birthday, weight, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    ).run(username.toLowerCase(), name, hashedPassword, email, countryId, birthday, weight, gender);

    sendRegisterMail(email, username).catch((error) => {
    console.log(error);
     /*  logger.error({ error }, "Register email failed"); */
    });

    return res.status(201).send({
      data: { successMessage: "Account registered" },
    });
  } catch (error) {
    console.log(error);
    /* logger.error({ error }, "Error while registering user"); */
    return res.status(500).send({
      data: { errorMessage: "Something went wrong, please try again" },
    });
  }
});

router.get("/auth/me", isLoggedIn, (req, res) => {
  res.status(200).send({ data: { user: { ...req.session.user } } });
});

router.post("/auth/logout", isLoggedIn, (req, res) => {
  req.session.destroy();
  res.status(200).send({ data: { successMessage: "Logged out" } });
});

export default router;
