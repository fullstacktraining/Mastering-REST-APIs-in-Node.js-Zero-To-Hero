const ObjectID = require('mongodb').ObjectID;

function ConvertToObjectID(req, res, next) {
  const { id } = req.params;
  req.ObjectID = new ObjectID(id);
  next();
}

module.exports = {
  ConvertToObjectID
};