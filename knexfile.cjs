// Update with your config settings.
require('dotenv').config();
const fs = require('fs');
const path = require('node:path');
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	development: {
		client: 'postgresql',
		connection: process.env.DATABASE_URL || {
			user: process.env.PGUSER,
			password: process.env.PGPASSWORD,
			database: process.env.PGDATABASE,
			host: process.env.PGHOST,
			port: process.env.PGPORT
		},
		migrations: {
			directory: './db/migrations'
		}
	},

	staging: {
		client: 'postgresql',
		connection: {
			connectionString: process.env.STAGING_DATABASE_URL,
			ssl: {
				ca: fs.readFileSync(path.join(__dirname, './ca-certificate.crt')) //needed for SSL in some database providers
			}
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './db/migrations'
		}
	},

	production: {
		client: 'postgresql',
		connection: {
			connectionString: process.env.PRODUCTION_DATABASE_URL,
			ssl: {
				ca: fs.readFileSync(path.join(__dirname, './ca-certificate.crt')) //needed for SSL in some database providers
			}
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './db/migrations'
		}
	}
};
