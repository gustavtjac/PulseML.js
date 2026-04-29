export const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res
      .status(401)
      .send({ data: { errorMessage: "User is not logged in" } });
  }
  next();
};

export const isAccessingOwnUser = (req, res, next) => {
  if (req.session.user.id !== Number(req.params.id)) {
    return res.status(403).send({ data: { errorMessage: "Forbidden" } });
  }
  next();
};
