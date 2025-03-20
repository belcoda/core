import { PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT } from '$env/static/private';
import { dev } from '$app/environment';
import * as db from 'zapatos/db';

import type * as s from 'zapatos/schema';

import pg from 'pg';

import CERT from '$lib/server/utils/db/cert';

import { pino } from '$lib/server/utils/logs/pino';
const log = pino(import.meta.url);

const pool = dev
	? new pg.Pool({
			host: PGHOST,
			user: PGUSER,
			database: PGDATABASE
		})
	: new pg.Pool({
			host: PGHOST,
			user: PGUSER,
			password: PGPASSWORD,
			database: PGDATABASE,
			port: parseInt(PGPORT),
			ssl: { ca: CERT, rejectUnauthorized: false }
		});

pool.on('error', (err) => log.error(err, '❌ Error in the database pool')); // don't let a pg restart kill your app
pool.on('connect', () => log.trace('😇 Database connected'));
db.setConfig({ castArrayParamsToJson: true, castObjectParamsToJson: true });
export { pool, db, type s };
