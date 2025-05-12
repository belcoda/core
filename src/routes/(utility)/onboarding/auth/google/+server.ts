import * as jose from 'jose';
import { JWT_SIGNING_SECRET } from '$env/static/private';
import { verify } from '../../../auth/google/verifyIdToken';
import { json } from '@sveltejs/kit';
export async function POST(event) {
	const tokenCookie = event.cookies.get('g_csrf_token');
	const body = await event.request.formData();
	const tokenBody = body.get('g_csrf_token');
	const credential = body.get('credential');
	if (!tokenCookie) throw new Error('CSRF token not found in request headers');
	if (!tokenBody) throw new Error('CSRF token not found in request body');
	if (tokenCookie !== tokenBody) throw new Error('Token mismatch. Unable to authenticate.');
	if (typeof credential !== 'string') throw new Error('Invalid credential');
	const jwt = await createJwt(credential);
	return json(jwt);
}

async function createJwt(token: string) {
	const secret = new TextEncoder().encode(must(JWT_SIGNING_SECRET));
	const signInDetails = await verify(token);
	if (!signInDetails || !signInDetails.email) {
		throw new Error('Invalid sign-in details');
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

	const parsed = await jose
		.jwtVerify(jwt, secret, {
			issuer: 'urn:example:issuer',
			audience: 'urn:example:audience'
		})
		.catch((err) => {
			console.error('Error verifying JWT', err);
			throw new Error('Unable to verify JWT. ' + err.message);
		});

	return jwt;
}
function must<T>(val: T) {
	if (!val) {
		throw new Error('Expected value to be defined');
	}
	return val;
}
