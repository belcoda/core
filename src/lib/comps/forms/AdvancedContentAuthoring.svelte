<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { page } from '$app/stores';
	import H2 from '$lib/comps/typography/H2.svelte';
	import H3 from '$lib/comps/typography/H3.svelte';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import Collapsible from '$lib/comps/ui/custom/collapsible/collapsible.svelte';

	import {
		superForm,
		valibotClient,
		Grid,
		Input,
		Textarea,
		Checkbox,
		Code,
		Switch,
		Error,
		Debug,
		Button
	} from '$lib/comps/ui/forms';
	import { update as updateEvent } from '$lib/schema/events/events';
	import { update as updatePetition } from '$lib/schema/petitions/petitions';
	import { update as updateContent } from '$lib/schema/website/content';
	const { type, actionUrl }: { type: 'petition' | 'event' | 'content'; actionUrl: string } =
		$props();
	const schema = {
		petition: updatePetition,
		event: updateEvent,
		content: updateContent
	};
	const form = superForm($page.data.form, {
		validators: valibotClient(schema[type]),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
</script>

<form method="post" action={actionUrl} use:enhance>
	<Grid cols={1}>
		<Error error={$message} />
		{#if type === 'petition' || type === 'event'}
			<Collapsible class="mb-4">
				{#snippet trigger()}
					<div class="text-xl">
						{$page.data.t.forms.fields.events.user_information_settings.label()}
					</div>
				{/snippet}
				<Grid cols={1}>
					<Grid cols={2} class="border rounded p-4">
						<Checkbox
							{form}
							name="ask_email"
							label={$page.data.t.forms.fields.events.user_information_settings.fields.ask_email.label()}
							bind:checked={$formData.ask_email}
						/>
						<Checkbox
							{form}
							name="require_email"
							label={$page.data.t.forms.fields.events.user_information_settings.fields.require_email.label()}
							bind:checked={$formData.require_email}
						/>
					</Grid>
					<Grid cols={2} class="border rounded p-4">
						<Checkbox
							{form}
							name="ask_phone_number"
							label={$page.data.t.forms.fields.events.user_information_settings.fields.ask_phone_number.label()}
							bind:checked={$formData.ask_phone_number}
						/>
						<Checkbox
							{form}
							name="require_phone_number"
							label={$page.data.t.forms.fields.events.user_information_settings.fields.require_phone_number.label()}
							bind:checked={$formData.require_phone_number}
						/>
					</Grid>
					<Grid cols={2} class="border rounded p-4">
						<Checkbox
							{form}
							name="ask_address"
							label={$page.data.t.forms.fields.events.user_information_settings.fields.ask_full_address.label()}
							bind:checked={$formData.ask_address}
						/>
						<Checkbox
							{form}
							name="require_address"
							label={$page.data.t.forms.fields.events.user_information_settings.fields.require_full_address.label()}
							bind:checked={$formData.require_address}
						/>
					</Grid>
					<Grid cols={2} class="border rounded p-4">
						<Checkbox
							{form}
							name="ask_postcode"
							label={$page.data.t.forms.fields.events.user_information_settings.fields.ask_postcode.label()}
							bind:checked={$formData.ask_postcode}
						/>
						<Checkbox
							{form}
							name="require_postcode"
							label={$page.data.t.forms.fields.events.user_information_settings.fields.require_postcode.label()}
							bind:checked={$formData.require_postcode}
						/>
					</Grid>
				</Grid>
			</Collapsible>
		{/if}
		<Collapsible class="mb-4">
			{#snippet trigger()}
				<div class="text-xl">{$page.data.t.forms.fields.metatags.header()}</div>
			{/snippet}
			<Grid cols={1}>
				<div class="justify-end">
					<Switch
						{form}
						name="html_metatags.isManuallySet"
						label={$page.data.t.forms.fields.metatags.manually_generate.label()}
						description={$page.data.t.forms.fields.metatags.manually_generate.description()}
						bind:checked={$formData.html_metatags.isManuallySet}
					/>
				</div>
				<Input
					{form}
					name="html_metatags.title"
					label={$page.data.t.forms.fields.metatags.title.label()}
					description={$page.data.t.forms.fields.metatags.title.description()}
					bind:value={$formData.html_metatags.title as string}
				/>
				<Textarea
					{form}
					name="html_metatags.description"
					label={$page.data.t.forms.fields.metatags.description.label()}
					description={$page.data.t.forms.fields.metatags.description.description()}
					bind:value={$formData.html_metatags.description as string}
				/>
				<Input
					{form}
					name="html_metatags.subject"
					label={$page.data.t.forms.fields.metatags.subject.label()}
					description={$page.data.t.forms.fields.metatags.subject.description()}
					bind:value={$formData.html_metatags.subject as string}
				/>
				<Input
					{form}
					name="html_metatags.keywords"
					label={$page.data.t.forms.fields.metatags.keywords.label()}
					description={$page.data.t.forms.fields.metatags.keywords.description()}
					bind:value={$formData.html_metatags.keywords as string}
				/>
				<Input
					{form}
					name="html_metatags.openGraph.title"
					label={$page.data.t.forms.fields.metatags.open_graph.title.label()}
					description={$page.data.t.forms.fields.metatags.open_graph.title.description()}
					bind:value={$formData.html_metatags.openGraph.title as string}
				/>
				<Input
					{form}
					name="html_metatags.openGraph.description"
					label={$page.data.t.forms.fields.metatags.open_graph.description.label()}
					description={$page.data.t.forms.fields.metatags.open_graph.description.description()}
					bind:value={$formData.html_metatags.openGraph.description as string}
				/>
				<Input
					{form}
					name="html_metatags.openGraph.description"
					label={$page.data.t.forms.fields.metatags.open_graph.description.label()}
					description={$page.data.t.forms.fields.metatags.open_graph.description.description()}
					bind:value={$formData.html_metatags.openGraph.description as string}
				/>
				<Input
					{form}
					name="html_metatags.openGraph.image"
					label={$page.data.t.forms.fields.metatags.open_graph.image.label()}
					description={$page.data.t.forms.fields.metatags.open_graph.image.description()}
					bind:value={$formData.html_metatags.openGraph.image as string}
				/>
				<Input
					{form}
					name="html_metatags.openGraph.image_alt"
					label={$page.data.t.forms.fields.metatags.open_graph.image_alt.label()}
					description={$page.data.t.forms.fields.metatags.open_graph.image_alt.description()}
					bind:value={$formData.html_metatags.openGraph.image_alt as string}
				/>
			</Grid>
		</Collapsible>
		<Collapsible class="mb-4">
			{#snippet trigger()}
				<div class="text-xl">{$page.data.t.forms.fields.custom_code.header()}</div>
			{/snippet}
			<Grid cols={1}>
				<Code
					{form}
					name="custom_code.custom_css"
					label={$page.data.t.forms.fields.custom_code.custom_css.label()}
					options={{
						language: 'css',
						lineNumbers: true,
						value: $formData.custom_code.custom_css as string
					}}
					bind:value={$formData.custom_code.custom_css as string}
				/>
				<Code
					{form}
					name="custom_code.custom_js"
					label={$page.data.t.forms.fields.custom_code.custom_js.label()}
					options={{
						language: 'js',
						lineNumbers: true,
						value: $formData.custom_code.custom_js as string
					}}
					bind:value={$formData.custom_code.custom_js as string}
				/>
				<Code
					{form}
					name="custom_code.custom_html_head"
					label={$page.data.t.forms.fields.custom_code.custom_html_head.label()}
					bind:value={$formData.custom_code.custom_html_head as string}
				/>
				<Code
					{form}
					name="custom_code.custom_html_body"
					label={$page.data.t.forms.fields.custom_code.custom_html_body.label()}
					bind:value={$formData.custom_code.custom_html_body as string}
				/>
			</Grid>
		</Collapsible>

		<Button>{$page.data.t.forms.buttons.submit()}</Button>
		<Debug data={$formData} />
	</Grid>
</form>
