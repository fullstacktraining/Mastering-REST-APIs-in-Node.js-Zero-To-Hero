const { gql } = require('apollo-server-express');

const employeeSchema = require('./employee');
const departmentSchema = require('./department');

const linkSchema = gql`
  type Query {
    _: Boolean
  }
`;

module.exports = [linkSchema, employeeSchema, departmentSchema];