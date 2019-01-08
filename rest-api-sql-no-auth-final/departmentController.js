function listAllDepartments(req, res) {
  const { knex } = req.app.locals;
  knex
    .select('name', 'location')
    .from('departments')
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json(error));
}

function listOneDepartment(req, res) {
  const { knex } = req.app.locals;
  const { id } = req.params;
  knex
    .select('name', 'location')
    .from('departments')
    .where({ id: `${id}` })
    .then(data => {
      if (data.length > 0) {
        return res.status(200).json(data[0]);
      } else {
        return res.status(404).json(`Department with ID ${id} not found`);
      }
    })
    .catch(error => res.status(500).json(error));
}

function createDepartment(req, res) {
  const { knex } = req.app.locals;
  const payload = req.body;
  knex('departments')
    .insert(payload)
    .then(response => res.status(201).json('Department created'))
    .catch(error => res.status(500).json(error));
}

function updateDepartment(req, res) {
  const { knex } = req.app.locals;
  const { id } = req.params;
  const payload = req.body;
  knex('departments')
    .where('id', id)
    .update(payload)
    .then(response => {
      if (response) {
        return res.status(204).json();
      } 
      return res.status(404).json(`Department with id ${id} not found.`);
    })
    .catch(error => res.status(500).json(error));
}

function deleteDepartment(req, res) {
  const { knex } = req.app.locals;
  const { id } = req.params;
  knex('departments')
    .where('id', id)
    .del()
    .then(response => {
      if (response) {
        return res.status(200).json(`Department with id ${id} deleted.`)
      }
      return res.status(404).json(`Department with id ${id} not found.`);
    })
    .catch(error => res.status(500).json(error));
}

function getDepartmentEmployees(req, res) {
  const { knex } = req.app.locals;
  let { id } = req.params;
  id = +id;
  knex
    .select('e.name', 'e.address', 'e.email', 'e.hired', 'e.dob', 'e.salary', 'e.bonus', 'e.photo')
    .from('employees AS e')
    .innerJoin('departments AS d', function() {
      this.on('e.department', '=', 'd.id').andOn('d.id', '=', id)
    })
    .then(data => {
      if (data.length > 0) {
        return res.status(200).json(data)
      }
      return res.status(404).json(`Department with id ${id} cannot be found.`)
    })
    .catch(error => res.status(500).json(error));
}

module.exports = {
  listAllDepartments,
  listOneDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentEmployees
};