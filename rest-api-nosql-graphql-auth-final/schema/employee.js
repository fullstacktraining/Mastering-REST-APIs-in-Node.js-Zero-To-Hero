const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    employees: [Employee]
    employee(_id: String!): Employee
  }

  type Employee {
    _id: String
    name: String
    address: String
    email: String
    hired: String
    dob: String
    salary: Int
    bonus: Int
    photo: String
    department: Department
  }
`;