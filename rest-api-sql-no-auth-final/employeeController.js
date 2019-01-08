function listAllEmployees(req, res) {
  const { knex } = req.app.locals;
  const { orderBy } = req.query;
  if (orderBy) {
    const regex = /(.*)(:)(ASC|DESC)/ig;
    if (regex.test(orderBy)) {
      const [ column, order ] = orderBy.split(':');
      knex
        .select('name', 'address', 'email', 'hired', 'dob', 'salary', 'bonus', 'photo', 'department')
        .from('employees')
        .orderBy(column, order)
        .then(data => res.status(200).json(data))
        .catch(error => res.status(500).json(error));
    } else {
      return res.status(400).json('If using a filter please use [field]:ASC|DESC');
    }
  } else {
    knex
      .select('name', 'address', 'email', 'hired', 'dob', 'salary', 'bonus', 'photo', 'department')
      .from('employees')
      .then(data => res.status(200).json(data))
      .catch(error => res.status(500).json(error));
  }
  
}

function listOneEmployee(req, res) {
  const { knex } = req.app.locals;
  const { id } = req.params;
  knex
    .select('name', 'address', 'email', 'hired', 'dob', 'salary', 'bonus', 'photo', 'department')
    .from('employees')
    .where({ id: `${id}` })
    .then(data => {
      if (data.length > 0) {
        return res.status(200).json(data[0]);
      } else {
        return res.status(404).json(`Employee with ID ${id} not found`);
      }
    })
    .catch(error => res.status(500).json(error));
}

function createEmployee(req, res) {
  const { knex } = req.app.locals;
  const payload = req.body;
  const mandatoryColumns = ['name', 'email', 'salary'];
  const payloadKeys = Object.keys(payload);
  const mandatoryColumnExists = mandatoryColumns.every(mc => payloadKeys.includes(mc));
  if (mandatoryColumnExists) {
    knex('employees')
      .insert(payload)
      .then(response => res.status(201).json('Employee created'))
      .catch(error => res.status(500).json(error));
  } else {
    return res.status(400).json(`Mandatory columns are required: ${mandatoryColumns}`);
  }
}

function updateEmployee(req, res) {
  const { knex } = req.app.locals;
  const { id } = req.params;
  const payload = req.body;
  knex('employees')
    .where('id', id)
    .update(payload)
    .then(response => {
      if (response) {
        return res.status(204).json();
      } 
      return res.status(404).json(`Employee with id ${id} not found.`);
    })
    .catch(error => res.status(500).json(error));
}

function deleteEmployee(req, res) {
  const { knex } = req.app.locals;
  const { id } = req.params;
  knex('employees')
    .where('id', id)
    .del()
    .then(response => {
      if (response) {
        return res.status(200).json(`Employee with id ${id} deleted.`)
      }
      return res.status(404).json(`Employee with id ${id} not found.`);
    })
    .catch(error => res.status(500).json(error));
}

module.exports = {
  listAllEmployees,
  listOneEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};