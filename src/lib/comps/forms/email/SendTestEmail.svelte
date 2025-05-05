<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	import * as Card from '$lib/comps/ui/card';
	import Loading from '$lib/comps/helpers/Loading.svelte';
	import Input from '$lib/comps/ui/input/input.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import * as Alert from '$lib/comps/ui/alert';

	import { type Update } from '$lib/schema/communications/email/messages';

	import { page } from '$app/state';
	import { getFlash } from 'sveltekit-flash-message';
	const flash = getFlash(page);

	let loading = $state(false);
	let error: string | null = $state(null);
	const { message, messageId }: { message: Update; messageId: number } = $props();
	let testEmail: string | undefined = $state();
	import sendTestEmail from '$lib/comps/forms/email/sendTest';

	async function send() {
		try {
			loading = true;
			error = null;
			await sendTestEmail({ message, messageId, email: testEmail });
			$flash = {
				type: 'success',
				message: m.wise_sleek_tern_thrive({ testEmail: testEmail || '<email>' })
			};
		} catch (err) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = m.deft_warm_mink_accept();
			}
		} finally {
			loading = false;
		}
	}
</script>

<Card.Root class="mb-6">
	<Card.Header>
		<Card.Title>{m.upper_giant_kitten_dart()}</Card.Title>
	</Card.Header>
	{#if loading}
		<div class="my-12"><Loading /></div>
	{:else}
		<Card.Content>
			{#if error}
				<Alert.Root variant="destructive" class="mb-4">
					<Alert.Title>{m.long_dizzy_skate_gulp()}</Alert.Title>
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{/if}
			<Input bind:value={testEmail} placeholder={m.lazy_bad_nuthatch_arise()} />
		</Card.Content>
		<Card.Footer>
			<Button type="button" onclick={send}>{m.level_tangy_grizzly_sway()}</Button>
		</Card.Footer>
	{/if}
</Card.Root>
