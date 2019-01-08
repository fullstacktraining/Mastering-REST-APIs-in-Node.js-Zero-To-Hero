const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const settings = require('./settings');
const routes = require('./routes');

const middlewares = require('./middlewares');

// const connection = mysql.createConnection(settings.database);

const jsonParser = bodyParser.json();

app.get('/employees', middlewares.getConnection, routes.employees.listAllEmployees);
app.get('/employees/:id', middlewares.getConnection, middlewares.getIDAsInteger, routes.employees.listOneEmployee);
app.post('/employees', jsonParser, middlewares.getConnection, routes.employees.createEmployee);
app.patch('/employees/:id', jsonParser, middlewares.getConnection, middlewares.getIDAsInteger, routes.employees.patchEmployee);
app.delete('/employees/:id', jsonParser, middlewares.getConnection, middlewares.getIDAsInteger, routes.employees.deleteEmployee);
app.get('/test', routes.employees.test);

app.get('/departments', routes.departments.listAllDepartments);
app.get('/departments/:id', middlewares.getIDAsInteger, routes.departments.listOneDepartment);
app.post('/departments', jsonParser, routes.departments.createDepartment);
app.patch('/departments/:id', jsonParser, middlewares.getIDAsInteger, routes.departments.updateDepartment);
app.delete('/departments/:id', middlewares.getIDAsInteger, routes.departments.deleteDepartment);
 
// connection.connect(error => {
//   if (error) {
//     console.error(`Error connecting to database: ${error}`);
//     return process.exit();
//   }
//   app.locals.connection = connection;
//   app.listen(settings.APIServerPort , () => console.info(`API Server is running on ${settings.APIServerPort}`));
// });

const knex = require('knex')({
  client: 'mysql',
  connection: settings.database
});
app.locals.knex = knex;
app.listen(settings.APIServerPort , () => console.info(`API Server is running on ${settings.APIServerPort}`));