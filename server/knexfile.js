var knex = require('knex')({client: 'pg'});
var path = require('path');

knex('table').insert({a: 'b'}).returning('*').toString();
// "insert into "table" ("a") values ('b') returning *"



module.exports = knex

knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('users', function (table) {
      table.increments('id').primary();
      table.string('url', 255);
      table.string('base_url', 255);
      table.string('code', 100);
      table.string('title', 255);
      table.integer('visits');
      table.timestamps();
    }).then(function (table) {
      console.log('Created users table.');
    });
  }
});


// knex.schema.hasTable('links').then(function(exists) {
//   if (!exists) {
//     knex.schema.createTable('links', function (table) {
//       table.increments('id').primary();
//       table.string('url', 255);
//       table.string('base_url', 255);
//       table.string('code', 100);
//       table.string('title', 255);
//       table.integer('visits');
//       table.timestamps();
//     }).then(function (table) {
//       console.log('Created links table.');
//     });
//   }
// });

// knex.schema.hasTable('clicks').then(function(exists) {
//   if (!exists) {
//     knex.schema.createTable('clicks', function (table) {
//       table.increments('id').primary();
//       table.integer('link_id');
//       table.timestamps();
//     }).then(function (table) {
//       console.log('Created clicks table.');
//     });
//   }
// });


// knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     knex.schema.createTable('users', function (table) {
//       table.increments('id').primary();
//      // table.integer('sessionId');
//       table.string('username', 25);
//       table.string('password', 25);
//       table.timestamps();
//       table.string('username', 255);
//       table.string('password', 255);
//     }).then(function (table) {
//       console.log('Created users table.');
//     });
//   }
// });

// knex.schema.hasTable('sessions').then(function(exists) {
//   if (!exists) {
//     knex.schema.createTable('sessions', function (table) {
//       table.string('id',150);
//       table.string('user_id', 25);
//       table.timestamps();
// knex.schema.hasTable('sessions').then(function(exists) {
//   if (!exists) {
//     knex.schema.createTable('links', function (table) {
//       table.increments('id').primary();
//       table.string('user_id', 255);
//       table.string('session', 255);
//     }).then(function (table) {
//       console.log('Created sessions table.');
//     });
//   }
// });