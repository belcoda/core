import {
	shortStringNotEmpty,
	v,
	phoneNumber,
	slug,
	url,
	email,
	country,
	mediumString,
	domainOrUrl
} from '$lib/schema/valibot';
import { superForm, defaults, type SuperValidated } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const validationSchema = v.object({
	ownerName: shortStringNotEmpty,
	whatsAppNumber: phoneNumber,
	country: country,
	instanceName: shortStringNotEmpty,
	instanceSlug: slug,
	instanceLogoUrl: url,

	replyToEmail: email,

	website: v.optional(v.nullable(domainOrUrl)),
	facebook: v.optional(v.nullable(mediumString)),
	instagram: v.optional(v.nullable(mediumString)),
	twitter: v.optional(v.nullable(mediumString))
});

type Props<T extends Record<string, unknown>> = {
	initialData?: T;
	validateOnLoad?: boolean;
	hideDebugger?: boolean;
	onSubmit: (value: T, form: SuperValidated<T>) => Promise<void>;
	class?: string;
};

export default function Form<T extends Record<string, unknown>>({
	initialData,
	validateOnLoad = true,
	onSubmit
}: Props<T>) {
	const form = initialData
		? //@ts-ignore There seems to be a type issue with defaulting to the generic initialData, but it works fine
			superForm(defaults(initialData, valibot(validationSchema)), {
				SPA: true,
				dataType: 'json',
				validators: valibot(validationSchema),
				onUpdate({ form }) {
					if (form.valid) {
						// @ts-ignore Type error with generics? But also seems to work
						onSubmit(form.data, form);
					}
				}
			})
		: superForm(defaults(valibot(validationSchema)), {
				SPA: true,
				dataType: 'json',
				validators: valibot(validationSchema),
				onUpdate({ form }) {
					if (form.valid) {
						// @ts-ignore Type error with generics? But also seems to work
						onSubmit(form.data, form);
					}
				}
			});
	if (initialData && validateOnLoad) {
		form.validateForm({ update: true });
	}

	function warnBeforeDiscard(isTainted: typeof form.isTainted, callback?: () => void) {
		function callbackOrNavigateBack() {
			if (callback) {
				callback();
			} else {
				window.history.back();
			}
		}

		if (isTainted()) {
			if (confirm('You have unsaved changes. Are you sure you want to discard them?')) {
				callbackOrNavigateBack();
			}
		} else {
			callbackOrNavigateBack();
		}
	}

	return {
		warnBeforeDiscard,
		form,
		capture: form.capture,
		restore: form.restore,
		data: form.form,
		errors: form.errors,
		isTainted: form.isTainted
	};
}
