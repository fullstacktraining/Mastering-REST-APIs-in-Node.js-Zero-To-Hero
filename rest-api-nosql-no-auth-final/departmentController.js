function listAllDepartments(req, res) {
  const { collection } = req.app.locals;
  collection.distinct("department.name")
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json(error));
}

function getDepartmentEmployees(req, res) {
  const { collection } = req.app.locals;
  const { deptName } = req.params;
  collection.find({
    "department.name": new RegExp(deptName, 'i')
  }).toArray()
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json(error));
}

module.exports = {
  listAllDepartments,
  getDepartmentEmployees
};