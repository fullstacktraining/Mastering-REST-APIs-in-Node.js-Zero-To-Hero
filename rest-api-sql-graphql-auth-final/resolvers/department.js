const fetch = require('node-fetch');
const base = `http://localhost:3000/api`;
module.exports = {
  Query: {
    departments: async () => {
      return await fetch(`${base}/departments`).then(response => response.json());
    },
    department: async (parent, { id }) => {
      return await fetch(`${base}/departments/${id}`).then(response => response.json());
    },
  },
  Department: {
    employees: async parent => {
      const { id } = parent;
      return await fetch(`${base}/departments/${id}/employees`).then(response => response.json());
    }
  }
};