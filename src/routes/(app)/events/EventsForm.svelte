<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { page } from '$app/stores';
	import Collapsible from '$lib/comps/ui/custom/collapsible/collapsible.svelte';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import {
		Input,
		Button,
		DateTime,
		Error,
		HTML,
		Checkbox,
		Textarea,
		Grid,
		Switch,
		Code,
		Debug,
		superForm,
		valibotClient
	} from '$lib/comps/ui/forms';
	export let isUpdate: boolean = false;

	import { create, update } from '$lib/schema/events/events';
	const form = superForm($page.data.form, {
		validators: valibotClient(isUpdate ? update : create),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
	import UploadWidget from '$lib/comps/widgets/uploads/UploadWidget.svelte';
</script>

<form use:enhance method="post">
	<Grid cols={1} class="mt-6">
		<Error error={$message} />
		<Input
			{form}
			name="name"
			label={$page.data.t.forms.fields.generic.name.label()}
			bind:value={$formData.name}
		/>
		<Input
			{form}
			name="slug"
			label={$page.data.t.forms.fields.generic.slug.label()}
			description={$page.data.t.forms.fields.generic.slug.description()}
			bind:value={$formData.slug}
		/>
		<Grid cols={2}>
			<DateTime {form} name="starts_at" label="Starts at" bind:value={$formData.starts_at} />
			<DateTime {form} name="ends_at" label="Ends at" bind:value={$formData.ends_at} />
		</Grid>

		<Grid cols={1} class="border p-4 rounded">
			<Switch
				class="border-none p-0"
				{form}
				name="online"
				label={$page.data.t.forms.fields.events.online.label()}
				description={$page.data.t.forms.fields.events.online.description()}
				bind:checked={$formData.online}
			/>
			<Separator />
			{#if $formData.online}
				<Input
					{form}
					name="online_url"
					label={$page.data.t.forms.fields.events.online_url.label()}
					bind:value={$formData.online_url as string}
				/>
				<Textarea
					{form}
					name="online_instructions"
					label={$page.data.t.forms.fields.events.online_instructions.label()}
					bind:value={$formData.online_instructions as string}
				/>
			{:else}
				<Input
					{form}
					name="address_line_1"
					label={$page.data.t.forms.fields.address.address_line_1.label()}
					bind:value={$formData.address_line_1 as string}
				/>
				<Input
					{form}
					name="address_line_2"
					label={$page.data.t.forms.fields.address.address_line_2.label()}
					bind:value={$formData.address_line_2 as string}
				/>
				<Grid cols={3}>
					<Input
						{form}
						name="locality"
						label={$page.data.t.forms.fields.address.locality.label()}
						bind:value={$formData.locality as string}
					/>
					<Input
						{form}
						name="state"
						label={$page.data.t.forms.fields.address.state.label()}
						bind:value={$formData.state as string}
					/>
					<Input
						{form}
						name="postcode"
						label={$page.data.t.forms.fields.address.postcode.label()}
						bind:value={$formData.postcode as string}
					/>
				</Grid>
			{/if}
		</Grid>

		<Input
			{form}
			name="heading"
			label={$page.data.t.forms.fields.generic.page_heading.label()}
			bind:value={$formData.heading}
		/>
		<HTML
			{form}
			name="html"
			label={$page.data.t.forms.fields.generic.content.label()}
			bind:value={$formData.html}
		/>
		<Collapsible class="mb-4">
			{#snippet trigger()}
				{$page.data.t.forms.fields.generic.feature_image.label()}
			{/snippet}
			<UploadWidget
				upload_id={$formData.feature_image_upload_id}
				onselected={(upload) => {
					if (upload?.id) $formData.feature_image_upload_id = upload.id;
					if (upload === null) $formData.feature_image_upload_id = null;
				}}
			/>
		</Collapsible>
		<Collapsible class="mb-4">
			{#snippet trigger()}
				{$page.data.t.forms.fields.metatags.header()}
			{/snippet}
			{#if $formData.html_metatags}
				<Grid cols={1}>
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
			{/if}
		</Collapsible>

		<Collapsible class="mb-4">
			{#snippet trigger()}
				{$page.data.t.forms.fields.custom_code.header()}
			{/snippet}
			{#if $formData.custom_code}
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
			{/if}
		</Collapsible>

		<Collapsible class="mb-4">
			{#snippet trigger()}
				{$page.data.t.forms.fields.events.user_information_settings.label()}
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

		<Button></Button>
		<Debug data={$formData} />
	</Grid>
</form>
