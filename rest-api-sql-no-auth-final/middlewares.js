function getIDAsInteger(req, res, next) {
  const id = +req.params.id;
  if (Number.isInteger(id)) {
    next();
  } else {
    return res.status(400).json('ID must be an integer');
  }
}

module.exports = {
  getIDAsInteger
};