const fetch = require('node-fetch');
const base = `http://localhost:3000/api`;
module.exports = {
  Query: {
    employees: async () => {
      return await fetch(`${base}/employees`).then(response => response.json());
    },
    employee: async (parent, { _id }, context) => {
      return await fetch(`${base}/employees/${_id}`, {
        method: 'GET',
        headers: {
          Authorization: context.authHeader
        }
      }).then(response => response.json());
    }
  }
};