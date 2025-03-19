import { default as pino_instance, transport as pino_transport } from 'pino';
import { LOG_LEVEL } from '$env/static/private';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { dev } from '$app/environment';

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
		{ target: 'pino/file', options: { destination: 1 }, level: LOG_LEVEL ?? 'debug' } //writes to STDOUT
	]
});

const logger = dev
	? pino_instance({ level: LOG_LEVEL ?? 'debug' })
	: pino_instance(productionTransports);

export function pino(file: string) {
	const child = logger.child({ file });
	return child;
}
