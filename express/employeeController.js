/**
 * GET    /employees    - List all employees
 * GET    /employees/ID - List one employee
 * POST   /employees/ID - Add a new employee
 * PATCH  /employees/ID - Partially update an employee
 * DELETE /employees/ID - Delete an employee (should also delete corresponding salary information)
*/

function listAllEmployees(req, res) {
  const connection = req.app.locals.connection;
  connection.query('SELECT e.id, e.name, e.address, e.email, e.hired, e.dob, e.salary, e.bonus, e.photo, d.name as "Department", d.location FROM employees e JOIN departments d ON e.department = d.id', (error, results) => {
    if (error) {
      return res.status(500).json(error);
    };
    return res.status(200).json(results);
  });
}

function listOneEmployee(req, res) {
  const connection = req.app.locals.connection;
  const id = +req.params.id;
  connection.query(`SELECT e.id, e.name, e.address, e.email, e.hired, e.dob, e.salary, e.bonus, e.photo, d.name as "Department", d.location FROM employees e INNER JOIN departments d ON e.department = d.id WHERE e.id = ${connection.escape(id)}`, (error, result) => {
    if (error) {
      return res.status(500).json(error);
    };
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(`Employee with ID ${id} cannot be found.`);
    }
  });
}

function createEmployee(req, res) {
  const connection = req.app.locals.connection;
  const payload = req.body
  const mandatoryColumns = ['name', 'address'];
  const payloadKeys = Object.keys(payload);
  const mandatoryColumnsExists = mandatoryColumns.every(mc => payloadKeys.includes(mc));
  if (mandatoryColumnsExists) {
    connection.query(`INSERT INTO employees SET ?`, payload, (error, results) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(201).json(`Created employee with ID: ${results.insertId}`);
    });
  } else {
    return res.status(400).json(`The following columns are mandatory: ${mandatoryColumns.toString()}`);
  }
}

function patchEmployee(req, res) {
  const connection = req.app.locals.connection;
  const id = +req.params.id;
  const payload = req.body;
  const keys = Object.keys(payload).map(p => `${p} = ?`);
  const values = [`${connection.escape(...Object.values(payload))}`, `${connection.escape(id)}`];

  connection.query(`UPDATE employees SET ${keys} WHERE id = ?`, values, function (error, results) {
    if (error) {
      return res.status(500).json(error);
    }
    if (+results.affectedRows === 1) {
      return res.status(204).json();
    } else {
      return res.status(400).json('Error occured');
    }
  });
}

function deleteEmployee(req, res) {
  const connection = req.app.locals.connection;
  const id = +req.params.id;
  // With table alias: `DELETE e FROM employees e WHERE e.id = ${connection.escape(id)}`
  // DELETE FROM employees WHERE e.id = ${connection.escape(id)}
  // INNER JOIN DELETE: DELETE employees, salaries FROM employees INNER JOIN salaries WHERE employees.salary = salaries.id AND employees.id = ${connection.escape(id)}`
  connection.query(`DELETE FROM employees WHERE e.id = ${connection.escape(id)}`, (error, results) => {
    if (error) {
      return res.status(500).json(error);
    }
    if (+results.affectedRows === 2) {
      return res.status(204).json();
    } else {
      return res.status(400).json('Error occured');
    }
  });
}

// DELETE messages , usersmessages  FROM messages  INNER JOIN usersmessages  
// WHERE messages.messageid= usersmessages.messageid and messages.messageid = '1'

function test(req, res) {
  const connection = req.app.locals.connection;
  connection.query('SELECT e.name, e.dob FROM employees e LIMIT 10', (error, results) => {
    if (error) throw error;
    return res.status(200).json(results);
  });
}

module.exports = {
  listAllEmployees,
  listOneEmployee,
  createEmployee,
  patchEmployee,
  deleteEmployee,
  test
};