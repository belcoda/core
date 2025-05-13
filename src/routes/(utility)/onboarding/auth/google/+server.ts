import * as jose from 'jose';
import { JWT_SIGNING_SECRET, JWT_NAME } from '$env/static/private';
import { verify } from '../../../auth/google/verifyIdToken';
import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

import { _unsafeGetAdminByEmail } from '$lib/server/api/core/admins';

export async function POST(event) {
	try {
		const tokenCookie = event.cookies.get('g_csrf_token');
		const body = await event.request.formData();
		const tokenBody = body.get('g_csrf_token');
		const credential = body.get('credential');
		if (!tokenCookie) throw new Error('CSRF token not found in request headers');
		if (!tokenBody) throw new Error('CSRF token not found in request body');
		if (tokenCookie !== tokenBody) throw new Error('Token mismatch. Unable to authenticate.');
		if (typeof credential !== 'string') throw new Error('Invalid credential');
		const jwt = await createJwt(credential);
		// Set the session cookie to expire in 2 weeks
		const today = new Date();
		const expires = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
		event.cookies.set(JWT_NAME, jwt, {
			path: '/',
			expires: expires,
			httpOnly: true,
			secure: dev ? false : true,
			sameSite: 'strict'
		});

		return redirect(302, '/onboarding/survey');
	} catch (error) {
		console.error('Error during authentication:', error);
		return redirect(302, '/onboarding?error=true');
	}
}

async function createJwt(token: string) {
	const secret = new TextEncoder().encode(must(JWT_SIGNING_SECRET));
	const signInDetails = await verify(token);
	if (!signInDetails || !signInDetails.email) {
		throw new Error('Invalid sign-in details');
	}

	// Check if the email address is already in use
	const existingUser = await _unsafeGetAdminByEmail({ email: signInDetails.email }).catch((err) => {
		// No need to handle the error here, just return null, we're happy with no user existing, that means we continue
		return null;
	});

	if (existingUser) {
		throw new Error('Email address already in use');
	}

	const jwt = await new jose.SignJWT({
		roles: signInDetails.full_name,
		typ: signInDetails.google_token_type,
		exp: Number(signInDetails.google_expires_in),
		aud: signInDetails.google_id,
		ueid: signInDetails.full_name,
		email: signInDetails.email,
		sub_id: signInDetails.profile_picture_url
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setIssuer('urn:example:issuer')
		.setSubject(signInDetails.google_access_token)
		.setAudience('urn:example:audience')
		.setExpirationTime('30days')
		.sign(secret);

	return jwt;
}
function must<T>(val: T) {
	if (!val) {
		throw new Error('Expected value to be defined');
	}
	return val;
}
