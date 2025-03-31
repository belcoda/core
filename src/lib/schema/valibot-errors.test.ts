import { expect, it, describe } from 'vitest';
import { parse, id, renderValiError } from '$lib/schema/valibot';
import * as m from '$lib/paraglide/messages';
describe('renderValiError', () => {
	it('should correctly identify Valibot validation errors', () => {
		try {
			renderValiError(parse(id, '123'));
		} catch (err) {
			expect(renderValiError(err).isValiError).toBe(true);
		}
	});

	it('should correctly identify non-Valibot validation errors', () => {
		expect(renderValiError('test').isValiError).toBe(false);
		expect(renderValiError({}).isValiError).toBe(false);
		expect(renderValiError(undefined).isValiError).toBe(false);
		expect(renderValiError(null).isValiError).toBe(false);
		expect(renderValiError(new Promise((resolve, reject) => {})).isValiError).toBe(false);
		try {
			throw new Error('This is not a Valibot error');
		} catch (err) {
			expect(renderValiError(err).isValiError).toBe(false);
		}
	});

	it('should return the correct error message', () => {
		try {
			renderValiError(parse(id, 123.5)); //needs to be a whole number
		} catch (err) {
			const renderedError = renderValiError(err);
			expect(renderedError.isValiError).toBe(true);
			if (renderedError.isValiError === false) throw new Error('This should not happen');
			expect(renderedError.message).toBe(m.salty_mad_polecat_pray());
		}
	});
});
