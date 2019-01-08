const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    department(deptName: String!): Department
  }

  type Department {
    name: String
    location: String
    employees: [Employee]
  }
`;