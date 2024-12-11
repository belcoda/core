import { PUBLIC_HOST } from '$env/static/public';
import render from '$lib/server/utils/handlebars/render';
export default async function ({
	messageTemplate,
	templateTemplate,
	context,
	emailUnsubscribeToken,
	previewTextTemplate,
	instanceId,
	t
}: {
	messageTemplate: string;
	templateTemplate: string;
	context: { [key: string]: unknown };
	previewTextTemplate?: string;
	emailUnsubscribeToken?: `${string}-${string}-${string}-${string}`;
	instanceId: number;
	t: App.Localization;
}): Promise<string> {
	const combinedString = templateTemplate.replace('{{{body}}}', messageTemplate);
	const contextWithGenericInfo = {
		...context,
		t: { ...buildLocalizedGenericEmailInfo(t) }
	};
	const renderedPreviewText = await render({
		template: previewTextTemplate || '',
		context: contextWithGenericInfo,
		instanceId: instanceId,
		t
	});

	const renderContext = emailUnsubscribeToken
		? {
				...contextWithGenericInfo,
				preview_text: renderedPreviewText,
				unsubscribe_url: `${PUBLIC_HOST}/unsubscribe/${emailUnsubscribeToken}`
			}
		: context;
	const renderedString = await render({
		template: combinedString,
		context: renderContext,
		instanceId: instanceId,
		t
	});
	return renderedString;
}

function buildLocalizedGenericEmailInfo(t: App.Localization) {
	return {
		unsubscribe: t.email.unsubscribe(),
		unsubscribe_description: t.email.unsubscribe_description()
	};
}
