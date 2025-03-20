<script lang="ts">
	export let data;
	import H1 from '$lib/comps/typography/H1.svelte';
	import Collapsible from '$lib/comps/ui/custom/collapsible/collapsible.svelte';

	import {
		superForm,
		valibotClient,
		Input,
		Button,
		Textarea,
		Grid,
		Checkbox,
		Debug,
		Code,
		HTML,
		Error
	} from '$lib/comps/ui/forms';
	import { create } from '$lib/schema/website/blocks';
	const form = superForm(data.form, {
		validators: valibotClient(create),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
	import * as m from '$lib/paraglide/messages';
</script>

<form method="post" use:enhance>
	<Grid cols={1}>
		<H1>{m.empty_pretty_falcon_amuse()}</H1>
		<Error error={$message} />

		<Input
			{form}
			name="name"
			label={m.extra_wild_earthworm_commend()}
			bind:value={$formData.name as string}
		/>

		<Input
			{form}
			name="slug"
			label={m.cool_heavy_lion_promise()}
			description={m.legal_dull_okapi_taste()}
			bind:value={$formData.slug as string}
		/>

		<Textarea
			{form}
			name="description"
			label={m.livid_spicy_felix_dance()}
			bind:value={$formData.description as string}
		/>
		<HTML
			{form}
			name="html"
			label={m.whole_sweet_slug_attend()}
			description={null}
			bind:value={$formData.html as string}
		/>

		<Collapsible class="mb-4">
			{#snippet trigger()}
				{'Custom code'}
			{/snippet}
			<Grid cols={1}>
				<Code
					{form}
					name="custom_css"
					label={m.teary_sharp_starfish_honor()}
					options={{ language: 'css', lineNumbers: true, value: $formData.custom_css as string }}
					bind:value={$formData.custom_css as string}
				/>
				<Code
					{form}
					name="custom_js"
					label={m.plain_real_clownfish_flow()}
					options={{ language: 'js', lineNumbers: true, value: $formData.custom_js as string }}
					bind:value={$formData.custom_js as string}
				/>
			</Grid>
		</Collapsible>

		<Button type="submit">{m.empty_warm_squirrel_chop()}</Button>
		<Debug data={$formData} />
	</Grid>
</form>
