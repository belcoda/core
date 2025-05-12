import { error, pino } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { validationSchema } from '../form.svelte.js';
import { parse } from '$lib/schema/valibot';
import { type InstallOptions } from '$lib/server/utils/install/index.js';
import * as jose from 'jose';
import { JWT_SIGNING_SECRET, JWT_NAME, COOKIE_SESSION_NAME } from '$env/static/private';
import { PUBLIC_HOST } from '$env/static/public';
import type { RequestEvent } from './$types.js';
import install from '$lib/server/utils/install/index.js';
import { signIn } from '$lib/server/api/core/admins.js';
const log = pino(import.meta.url);
export async function POST(event) {
	//build the installation options
	const parsedBody = parse(validationSchema, await event.request.json());
	const signInDetails = await buildSignInObjectFromJwt(event);
	const newInstanceOptions: InstallOptions = {
		instanceName: parsedBody.instanceName,
		instanceSlug: parsedBody.instanceSlug,
		ownerEmail: signInDetails.email as string,
		ownerProfilePictureUrl: signInDetails.profile_picture_url as string | undefined,
		ownerName: parsedBody.ownerName,
		logoUrl: parsedBody.instanceLogoUrl,
		country: parsedBody.country,
		language: 'en',
		homePageUrl: parsedBody.website || undefined,
		options: {
			testData: false
		}
	};

	await install(newInstanceOptions, event.locals.t, event.locals.queue);

	log.debug('creating session...');
	const { session } = await signIn({
		body: {
			email: signInDetails.email as string,
			full_name: parsedBody.ownerName,
			profile_picture_url: signInDetails.profile_picture_url as string | null,
			google_token_type: signInDetails.google_token_type as string | null,
			google_expires_in: null, // Not currently needed or used
			google_refresh_token: null,
			google_id: signInDetails.google_id as string | null,
			google_access_token: signInDetails.google_access_token as string | null
		}
	});

	log.debug(session, 'session created:');

	// Set the session cookie to expire in 2 weeks
	const today = new Date();
	const expires = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

	event.cookies.set(COOKIE_SESSION_NAME, session, {
		path: '/',
		expires: expires,
		httpOnly: true,
		secure: dev ? false : true,
		sameSite: 'strict'
	});

	log.debug('authenticated.. now redirecting to the dashboard...');
	return redirect(302, PUBLIC_HOST);
}

async function buildSignInObjectFromJwt(event: RequestEvent) {
	//parse the JWT and reject if not valid
	const jwt = event.cookies.get(JWT_NAME);
	if (!jwt) {
		return error(401, 'API:/api/v1/events/[event_id]:GET', 'JWT not found');
	}
	const validated = await jose.jwtVerify(jwt, new TextEncoder().encode(JWT_SIGNING_SECRET));

	if (!validated) {
		return error(401, 'API:/api/v1/events/[event_id]:GET', 'JWT not valid');
	}

	const signInDetails = {
		full_name: validated.payload.roles,
		google_token_type: validated.payload.typ,
		google_expires_in: validated.payload.exp,
		google_id: validated.payload.aud,
		email: validated.payload.email,
		profile_picture_url: validated.payload.sub_id,
		google_access_token: validated.payload.sub
	};
	return signInDetails;
}
