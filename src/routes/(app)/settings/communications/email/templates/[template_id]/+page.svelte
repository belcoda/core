<script lang="ts">
	export let data;
	import H1 from '$lib/comps/typography/H1.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import Switch from '$lib/comps/ui/switch/switch.svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		superForm,
		valibotClient,
		Input,
		Button,
		Textarea,
		Grid,
		Checkbox,
		Debug,
		HTML,
		Error
	} from '$lib/comps/ui/forms';
	import { update } from '$lib/schema/communications/email/templates';
	const form = superForm(data.form, {
		validators: valibotClient(update),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
	let editHTML = true;
</script>

<form method="post" use:enhance>
	<Grid cols={1}>
		<H1>{data.template.name}</H1>
		<Error error={$message} />
		<Input
			{form}
			name="name"
			label={m.extra_wild_earthworm_commend()}
			bind:value={$formData.name as string}
		/>
		<Grid>
			<Input
				{form}
				name="from"
				label={m.plane_still_jaguar_rise()}
				bind:value={$formData.from as string}
			/>
			<Input
				{form}
				name="reply_to"
				label={m.wide_brief_capybara_build()}
				bind:value={$formData.reply_to as string}
			/>
		</Grid>
		<Input
			{form}
			name="subject"
			label={m.small_trite_okapi_catch()}
			bind:value={$formData.subject as string}
		/>
		<Textarea
			{form}
			name="preview_text"
			label={m.tiny_plane_flea_gleam()}
			bind:value={$formData.preview_text as string}
		/>
		<div>
			<div class="flex justify-between items-baseline mb-2">
				<Label>{m.keen_noble_peacock_compose()}</Label>
				<div class="flex gap-2 items-center">
					<Label class="text-muted-foreground"
						>{editHTML ? m.whole_sweet_slug_attend() : m.green_broad_porpoise_advise()}</Label
					>
					<Switch bind:checked={editHTML} />
				</div>
			</div>
			{#if editHTML}<HTML
					{form}
					name="html"
					label={null}
					description={null}
					bind:value={$formData.html as string}
				/>
			{:else}
				<Textarea {form} name="text" rows={16} label={null} bind:value={$formData.text as string} />
			{/if}
		</div>
		<Checkbox
			{form}
			name="active"
			label={m.arable_merry_insect_adapt()}
			bind:checked={$formData.active as boolean}
		/>
		<Button type="submit">{m.empty_warm_squirrel_chop()}</Button>
		<Debug data={$formData} />
	</Grid>
</form>
