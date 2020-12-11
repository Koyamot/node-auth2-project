exports.up = function (knex) {
    return knex.schema
      .createTable("users", tbl => {
        tbl.increments();
  
        tbl.string("username", 50).notNullable().unique().index();
        tbl.string("password", 32).notNullable();
        tbl.string("department", 128).notNullable();
      });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("users");
  };