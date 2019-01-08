/**
 * GET    /departments    - List all departments
 * GET    /departments/ID - List one department
 * POST   /departments/ID - Add a new department
 * PATCH  /departments/ID - Partially update a department
 * DELETE /departments/ID - Delete a department
*/

function listAllDepartments(req, res) {
  const knex = req.app.locals.knex;
  knex.select('id', 'name', 'location').from('departments').then(data => {
    return res.status(200).json(data);
  }).catch(error => res.status(500).json(error));
}

function listOneDepartment(req, res) {
  const id = +req.params.id;
  const knex = req.app.locals.knex;
  knex.select('id', 'name', 'location').from('departments').where({ id: `${id}` }).then(data => {
    if (data.length > 0) {
      return res.status(200).json(data)
    } else {
      return res.status(404).json(`Department with ID ${id} cannot be found.`);
    }
  }).catch(error => res.status(500).json(error));
}

function createDepartment(req, res) {
  const knex = req.app.locals.knex;
  const payload = req.body;
  const mandatoryColumns = ['name', 'location'];
  const payloadKeys = Object.keys(payload);
  const mandatoryColumnsExists = mandatoryColumns.every(mc => payloadKeys.includes(mc));
  if (mandatoryColumnsExists) {
    knex('departments').insert(payload).then(response => {
      return res.status(201).json('Department created');
    }).catch(error => res.status(500).json(error));
  }
}

function updateDepartment(req, res) {
  const knex = req.app.locals.knex;
  const id = +req.params.id;
  const payload = req.body;
  const keys = Object.keys(payload).map(p => `${p} = ?`);
  // const values = [`${connection.escape(...Object.values(payload))}`, `${connection.escape(id)}`];
  knex('departments').where('id', id).update(payload).then(response => {
    return res.status(204).json();
  }).catch(error => res.status(500).json(error));
}

function deleteDepartment(req, res) {
  const knex = req.app.locals.knex;
  const id = +req.params.id;
  knex('departments').where('id', id).del().then(response => {
    return res.status(200).json(`Department with id ${id} deleted`);
  }).catch(error => res.status(500).json(error));
}

module.exports = {
  listAllDepartments,
  listOneDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
};