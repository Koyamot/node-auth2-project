const knex = require('knex');

const knexfile = require('../knexfile.js');

const database = knex(knexfile.development);

module.exports = database;