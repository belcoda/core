import { type NumericRange } from '@sveltejs/kit';
export class BelcodaError extends Error {
	public code: NumericRange<400, 599>;
	public error?: Error | unknown;
	constructor(
		code: NumericRange<400, 599>,
		name: string,
		message: string,
		error?: Error | unknown
	) {
		super(message);
		this.code = code;
		this.name = name;
		this.error = error;
	}
}
