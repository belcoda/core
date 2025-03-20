import { default as pino_instance, transport as pino_transport } from 'pino';
import {
	LOG_LEVEL,
	GRAFANA_URL,
	GRAFANA_SERVICE_ACCOUNT_NAME,
	GRAFANA_SERVICE_ACCOUNT_TOKEN
} from '$env/static/private';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import type { LokiOptions } from 'pino-loki';

import { dev } from '$app/environment';

const lokiTransport = pino_transport<LokiOptions>({
	target: 'pino-loki',
	level: 'debug',
	options: {
		batching: true,
		interval: 5,
		host: GRAFANA_URL,
		basicAuth: {
			username: GRAFANA_SERVICE_ACCOUNT_NAME,
			password: GRAFANA_SERVICE_ACCOUNT_TOKEN
		}
	}
});

const defaultTransport = pino_transport({
	target: 'pino/file',
	level: LOG_LEVEL ?? 'debug',
	options: { destination: 1 } // this writes to STDOUT
});

const productionTransports = pino_transport({
	targets: [
		{
			target: 'pino-sentry-transport',
			options: {
				sentry: {
					dsn: PUBLIC_SENTRY_DSN, // sentry dsn
					environment: dev ? 'development' : 'production'
					// additional options for sentry
				},
				withLogRecord: true, // default false - send the entire log record to sentry as a context.(FYI if its more then 8Kb Sentry will throw an error)
				tags: ['level'], // sentry tags to add to the event, uses lodash.get to get the value from the log record
				context: ['hostname'], // sentry context to add to the event, uses lodash.get to get the value from the log record,
				minLevel: 40 // which level to send to sentry
			}
		},
		defaultTransport
	]
});

const developmentTransports = pino_transport({
	targets: [defaultTransport, lokiTransport]
});

const logger = dev
	? pino_instance(
			pino_transport({
				targets: [
					{
						target: 'pino/file',
						options: { destination: 1 } // this writes to STDOUT
					}
				]
			})
		)
	: pino_instance(
			pino_transport({
				targets: [
					{
						target: 'pino/file',
						options: { destination: 1 } // this writes to STDOUT
					},
					{
						target: 'pino-sentry-transport',
						options: {
							sentry: {
								dsn: PUBLIC_SENTRY_DSN, // sentry dsn
								environment: dev ? 'development' : 'production'
								// additional options for sentry
							},
							withLogRecord: true, // default false - send the entire log record to sentry as a context.(FYI if its more then 8Kb Sentry will throw an error)
							tags: ['level'], // sentry tags to add to the event, uses lodash.get to get the value from the log record
							context: ['hostname'], // sentry context to add to the event, uses lodash.get to get the value from the log record,
							minLevel: 40 // which level to send to sentry
						}
					},
					{
						target: 'pino-loki',
						level: 'debug',
						options: {
							batching: true,
							interval: 5,
							host: GRAFANA_URL,
							basicAuth: {
								username: GRAFANA_SERVICE_ACCOUNT_NAME,
								password: GRAFANA_SERVICE_ACCOUNT_TOKEN
							}
						}
					}
				]
			})
		);

export function pino(file: string) {
	const child = logger.child({ file });
	return child;
}
