<script lang="ts">
	export let data;
	import { page } from '$app/stores';
	import { Switch, Debug, Error, Input, Grid, superForm, valibotClient } from '$lib/comps/ui/forms';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';

	import { update } from '$lib/schema/petitions/petitions';
	const form = superForm(data.form, {
		validators: valibotClient(update),
		dataType: 'json'
	});
	let { form: formData, enhance, message, allErrors } = form;
	import * as m from '$lib/paraglide/messages';
</script>

<PageHeader title={m.aloof_whole_beetle_value()}>
	{#snippet button()}
		<div class="flex items-center gap-2">
			<Button href="/petitions/{$page.params.petition_id}/edit"
				>{m.super_broad_gopher_hurl()}</Button
			>
		</div>
	{/snippet}
</PageHeader>

{#snippet editPreviewButtons(messageId: number, visible: boolean)}
	{#if visible}
		<div class="flex items-center gap-2">
			<Button href="/communications/email/messages/{messageId}" target="_blank">
				{m.giant_misty_shrimp_stop()}
			</Button>
			<Button
				variant="outline"
				href="/preview/email/{messageId}?petition_id={$page.params.petition_id}"
				target="_blank"
			>
				{m.alive_silly_antelope_build()}
			</Button>
		</div>
	{/if}
{/snippet}

<form method="post" use:enhance>
	<Grid cols={1} class="mt-4">
		<Error error={$message} />
		<Grid cols={1} class="border rounded-lg p-4">
			<Switch
				class="border-none p-0"
				{form}
				name="send_autoresponse_email"
				label={'Send autoresponse email?'}
				description={m.moving_bold_turtle_bend()}
				bind:checked={$formData.send_autoresponse_email as boolean}
			/>

			{@render editPreviewButtons(
				data.petition.autoresponse_email.id,
				$formData.send_autoresponse_email as boolean
			)}
		</Grid>

		<div class="flex justify-end">
			<Button type="submit">{m.just_away_horse_urge()}</Button>
		</div>
		<Debug data={$formData} />
	</Grid>
</form>
