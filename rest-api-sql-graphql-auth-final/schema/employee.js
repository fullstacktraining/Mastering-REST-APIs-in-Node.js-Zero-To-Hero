const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    employees: [Employee]
    employee(id: Int!): Employee
  }

  type Employee {
    id: Int
    name: String
    address: String
    email: String
    hired: String
    dob: String
    salary: String
    bonus: Int
    photo: String
    department: Department
  }
`;