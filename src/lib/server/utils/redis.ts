import { createClient } from 'redis';

import { REDIS_URL } from '$env/static/private';
const DEFAULT_CACHE_TIME: number = 5000;
const CACHE_PREFIX: string = 'bc:';

import { error } from '$lib/server/utils/error/index.js';
import { pino } from '$lib/server/utils/logs/pino.js';
import { building, dev } from '$app/environment';

const log = pino(import.meta.url);

const client = dev
	? createClient({ url: REDIS_URL })
	: createClient({ socket: { host: 'cache', port: 6379 } });
client.on('error', (err) => log.error('Redis Client Error', err));
client.on('connect', () => log.info(`Redis client connected at ${REDIS_URL}`));
client.on('ready', () => log.info(`Redis client ready at ${REDIS_URL}`));

if (
	!building && //this causes build errors
	process.env.CI !== 'true' && //this pollutes the logs with connection errors and can cause parse errors in our JUnit output
	process.env.MODE !== 'test' //pollutes the logs with connection info and can cause issues
) {
	await client.connect();
}
function safe_stringify(value: any) {
	try {
		const value_string: string = JSON.stringify(value);
		return value_string;
	} catch (err) {
		throw error(400, 'SAFESTRING01', 'Unexpected error in cache handler', err);
	}
}

function safe_parse(value: string) {
	try {
		const return_string: any = JSON.parse(value);
		return return_string;
	} catch (err) {
		throw error(400, 'SAFESTRING02', 'Unexpected error in cache handler', err);
	}
}

export async function search(
	pattern: string,
	per_search: number = 200
): Promise<{ key: string; value: any }[]> {
	let results = [];
	for await (const key of client.scanIterator({
		MATCH: CACHE_PREFIX + pattern,
		COUNT: per_search
	})) {
		const value = await client.get(key);
		try {
			if (value === null) throw new Error('Response is null');
			results.push({ key, value: JSON.parse(value) });
		} catch (err) {
			results.push({ key, value });
		}
	}
	log.trace(`🎈 REDIS SCAN "${CACHE_PREFIX + pattern}" RETURNED ${results.length} RESULTS`);
	return results;
}

export async function scan_delete(pattern: string): Promise<{ success: number; fail: number }> {
	let success = 0;
	let fail = 0;
	const results = await search(pattern);
	for (const result of results) {
		try {
			await del(result.key);
			success++;
		} catch (err) {
			console.debug(err);
			fail++;
		}
	}
	log.trace(
		`🎈 REDIS SCAN_DELETE "${CACHE_PREFIX + pattern}" - DELETED ${success}, FAILED TO DELETE ${fail}`
	);
	return { success, fail };
}

async function set(key: string, value: any, timeout: number | false = DEFAULT_CACHE_TIME) {
	const value_as_string = safe_stringify(value);
	if (value_as_string === undefined)
		throw error(400, 'CACHE01', 'Unexpected error in cache handler');
	if (timeout === false) {
		await client.set(CACHE_PREFIX + key, value_as_string);
		log.trace(`🎈 REDIS SET "${CACHE_PREFIX + key}" NO EXPIRY: ${value_as_string}`);
	} else {
		await client.set(CACHE_PREFIX + key, value_as_string, {
			EX: timeout
		});
		log.trace(`🎈 REDIS SET "${CACHE_PREFIX + key}" EXPIRES ${timeout}s: ${value_as_string}`);
	}
}

export async function del(key: string): Promise<null> {
	log.trace(`🎈 REDIS DEL "${CACHE_PREFIX + key}" RETURNED NULL`);
	await client.del(CACHE_PREFIX + key);
	return null;
}

async function get(key: string): Promise<unknown | null> {
	const value = await client.get(CACHE_PREFIX + key);

	if (value === null) {
		log.trace(`🎈 REDIS GET "${CACHE_PREFIX + key}" RETURNED NULL`);
		return null;
	}
	const value_any: unknown | null = safe_parse(value);
	log.trace(`🎈 REDIS GET "${CACHE_PREFIX + key}": ${value}`);
	return value_any;
}

export { client, set, get };
