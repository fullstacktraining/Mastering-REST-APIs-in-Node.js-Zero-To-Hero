const express = require('express');
const app = express();
const router = express.Router();
const settings = require('./settings');
const routes = require('./routes');
const middlewares = require('./middlewares');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const resolvers = require('./resolvers');
const cluster = require('cluster');
const os = require('os');
const cors = require('cors');
app.use(cors());

if (cluster.isMaster) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  const jsonParser = bodyParser.json();

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    context: ({ req }) => {
      return { authHeader: req.headers.authorization }
    }
  });
  server.applyMiddleware({ app });

  const knex = require('knex')({
    client: 'mysql',
    connection: settings.database
  });
  app.locals.knex = knex;

  router.get('/employees', routes.employees.listAllEmployees);
  // router.get('/employees/:id', middlewares.getIDAsInteger,routes.employees.listOneEmployee);
  router.get('/employees/:id', middlewares.authenticate, middlewares.getIDAsInteger,routes.employees.listOneEmployee);
  router.post('/employees', jsonParser, routes.employees.createEmployee);
  router.patch('/employees/:id', jsonParser, middlewares.getIDAsInteger, routes.employees.updateEmployee);
  router.delete('/employees/:id', middlewares.getIDAsInteger, routes.employees.deleteEmployee);

  router.get('/departments', routes.departments.listAllDepartments);
  router.get('/departments/:id', middlewares.getIDAsInteger, routes.departments.listOneDepartment);
  router.get('/departments/:id/employees', middlewares.getIDAsInteger, routes.departments.getDepartmentEmployees);
  router.post('/departments', jsonParser, routes.departments.createDepartment);
  router.patch('/departments/:id', jsonParser, middlewares.getIDAsInteger, routes.departments.updateDepartment);
  router.delete('/departments/:id', middlewares.getIDAsInteger, routes.departments.deleteDepartment);

  app.use('/api', router);

  app.listen(settings.APIServerPort, () => console.info(`Server is listening on ${settings.APIServerPort}.`));
}

cluster.on('exit', worker => {
  console.log(`Worker with ${worker.id} is gone.`);
  cluster.fork();
});
