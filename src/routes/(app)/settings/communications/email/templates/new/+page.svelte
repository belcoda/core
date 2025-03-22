<script lang="ts">
	export let data;
	import H1 from '$lib/comps/typography/H1.svelte';
	import Label from '$lib/comps/ui/label/label.svelte';
	import Switch from '$lib/comps/ui/switch/switch.svelte';
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
	import { create } from '$lib/schema/communications/email/templates';
	const form = superForm(data.form, {
		validators: valibotClient(create),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;
	let editHTML = true;
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
</script>

<form method="post" use:enhance>
	<Grid cols={1}>
		<H1>{m.fancy_factual_samuel_surge()}</H1>
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
				label={m.gross_chunky_leopard_glow()}
				bind:value={$formData.from as string}
			/>
			<Input
				{form}
				name="reply_to"
				label={m.dark_real_jay_fear()}
				bind:value={$formData.reply_to as string}
			/>
		</Grid>
		<Input
			{form}
			name="subject"
			label={m.sweet_busy_gull_lock()}
			bind:value={$formData.subject as string}
		/>
		<Textarea
			{form}
			name="preview_text"
			label={m.bad_tired_buzzard_skip()}
			bind:value={$formData.preview_text as string}
		/>
		<div>
			<div class="flex justify-between items-baseline mb-2">
				<Label>{m.these_sharp_felix_jump()}</Label>
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
			label={m.extra_upper_badger_zip()}
			bind:checked={$formData.active as boolean}
		/>
		<Button type="submit">{m.empty_warm_squirrel_chop()}</Button>
		<Debug data={$formData} />
	</Grid>
</form>
