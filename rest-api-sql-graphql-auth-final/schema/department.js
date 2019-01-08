const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    departments: [Department]
    department(id: Int!): Department
  }

  type Department {
    id: Int
    name: String
    location: String
    employees: [Employee]
  }
`;