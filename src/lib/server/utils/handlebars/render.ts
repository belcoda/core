import Handlebars from 'handlebars';
import register_helpers from '$lib/server/hooks/website/register_helpers';
import { form, input } from '$lib/server/hooks/website/partials';
import { listAllForInstance } from '$lib/server/api/website/blocks';
import { read as readInstance } from '$lib/server/api/core/instances';
export default async function ({
	template,
	context,
	instanceId,
	t
}: {
	template: string;
	context: { [key: string]: unknown };
	instanceId: number;
	t: App.Localization;
}): Promise<string> {
	const blocks = await listAllForInstance({ instanceId: instanceId });
	const instance = await readInstance({ instance_id: instanceId });

	//load helpers
	const hb = register_helpers(Handlebars, blocks, t, instance);
	//load partials
	hb.registerHelper('input', function (value: unknown) {
		return new Handlebars.SafeString(input(value, Handlebars.escapeExpression));
	});
	hb.registerHelper('form', function (value: unknown) {
		const { display, pre, post } = form(value, hb);
		//@ts-expect-error - Because this is any in the context, but this is what the HBS docs say to do
		if (display) return new Handlebars.SafeString(pre + value.fn(this) + post);
		return '';
	});
	const compiled_template = Handlebars.compile(template);

	const output = compiled_template(context);
	return output;
}
