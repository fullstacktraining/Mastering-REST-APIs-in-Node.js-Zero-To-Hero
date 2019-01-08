const express = require('express');
const app = express();
const router = express.Router();
const settings = require('./settings');
const routes = require('./routes');
const middlewares = require('./middlewares');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
app.use(cors());

const mongo_uri = `mongodb://${settings.database.host}:${settings.database.port}`;

const jsonParser = bodyParser.json();

router.get('/employees', routes.employees.listAllEmployees);
router.get('/employees/:id', middlewares.ConvertToObjectID,routes.employees.listOneEmployee);
router.post('/employees', jsonParser, routes.employees.createEmployee);
router.patch('/employees/:id', jsonParser, middlewares.ConvertToObjectID, routes.employees.updateEmployee);
router.delete('/employees/:id', middlewares.ConvertToObjectID, routes.employees.deleteEmployee);

router.get('/departments', routes.departments.listAllDepartments);
router.get('/departments/:deptName/employees', routes.departments.getDepartmentEmployees);

app.use('/api', router);

MongoClient.connect(mongo_uri, { useNewUrlParser: true })
.then(client => {
  const db = client.db('project');
  const collection = db.collection('employees');
  app.locals.collection = collection;
  app.listen(settings.APIServerPort, () => console.info(`Server is listening on ${settings.APIServerPort}.`));
}).catch(error => console.error(error));