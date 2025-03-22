<script lang="ts">
	export let data;
	import { update } from '$lib/schema/communications/email/sends';
	import {
		Debug,
		Input,
		Button,
		superForm,
		Grid,
		SelectList,
		valibotClient,
		Error
	} from '$lib/comps/ui/forms';
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	const form = superForm(data.form, {
		validators: valibotClient(update)
	});
	const { form: formData, enhance, message } = form;
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	//superseeded by the send function at /communications/email/[send_id]/send/+page.svelte
	/* async function send() {
		try {
			if (confirm("Actually send email?") === false) return;
			const response = await fetch(
				`/api/v1/communications/email/sends/${$page.params.send_id}/send`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ list_id: $formData.list_id })
				}
			);
			if (!response.ok) {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
			$flash = { type: 'success', message: "Success" };
			await goto(`/communications/email/${$page.params.send_id}`);
		} catch (err) {
			if (err instanceof Error) {
				$flash = { type: 'error', message: err };
			} else {
				$flash = { type: 'error', message: m.teary_dizzy_earthworm_urge() };
			}
		}
	} */
</script>

<PageHeader title={m.dirty_broad_penguin_pave()}>
	{#snippet button()}
		<Button href={`/communications/email/${$page.params.send_id}`} variant="default" size="sm">
			{m.super_broad_gopher_hurl()}
		</Button>
	{/snippet}
</PageHeader>

<form use:enhance method="post">
	<Grid cols={1} class="mt-6">
		<Error error={$message} />
		<Input
			label={m.extra_wild_earthworm_commend()}
			{form}
			name="name"
			bind:value={$formData.name as string}
		/>
		<Button type="submit">{m.empty_warm_squirrel_chop()}</Button>
		<Debug data={formData} />
	</Grid>
</form>
