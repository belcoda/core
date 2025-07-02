import { redirect } from '@sveltejs/kit';
import * as jose from 'jose';
import { JWT_SIGNING_SECRET, JWT_NAME, COOKIE_SESSION_NAME } from '$env/static/private';
export async function load(event) {
	try {
		const jwt = event.cookies.get(JWT_NAME);
		if (!jwt) throw new Error('JWT not found in cookies');
		const validatedJwt = await jose.jwtVerify(jwt, new TextEncoder().encode(JWT_SIGNING_SECRET));
		if (!validatedJwt) throw new Error('JWT not valid');
		return {};
	} catch (err) {
		console.error('Error validating JWT:', err);
		return redirect(302, '/onboarding');
	}
}
