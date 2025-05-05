<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import ListDropdown from '$lib/comps/widgets/lists/ListDropdown.svelte';
	import { type Update } from '$lib/schema/communications/email/messages';
	const { message, messageId }: { message: Update; messageId: number } = $props();

	let listId: number | undefined = $state();
	let open = $state(false);
	let listName: string | undefined = $state();

	let loading = $state(false);
	let error: string | null = $state(null);

	import { page } from '$app/state';
	import { getFlash } from 'sveltekit-flash-message';
	const flash = getFlash(page);

	import Dialog from '$lib/comps/ui/custom/dialog/dialog.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import sendEmail from '$lib/comps/forms/email/sendEmail';
	import Loading from '$lib/comps/helpers/Loading.svelte';
	import * as Alert from '$lib/comps/ui/alert';

	import { invalidateAll } from '$app/navigation';

	async function send() {
		try {
			loading = true;
			error = null;
			await sendEmail({ message, messageId, listId });
			$flash = {
				type: 'success',
				message: m.round_big_herring_sail({ listName: listName || '<list>' })
			};
			await invalidateAll();
		} catch (err) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = m.male_lucky_panther_promise();
			}
		} finally {
			loading = false;
			open = false;
		}
	}
</script>

<div class="space-y-4 w-full">
	<ListDropdown
		bind:value={listId}
		onSelectList={(list) => {
			listName = list.name;
		}}
	/>
	<Button
		disabled={!listId}
		type="button"
		variant="default"
		class="w-full"
		onclick={() => (open = true)}>Send</Button
	>
</div>

<Dialog
	bind:open
	title="Send email"
	description={`Are you sure you want to send this email to ${listName ? listName : 'this list'}?`}
>
	{#if loading}
		<div class="flex items-center justify-center">
			<Loading />
		</div>
	{:else}
		{#if error}
			<div class="flex items-center justify-center">
				<Alert.Root variant="destructive" class="w-full">
					<Alert.Title>{m.deft_warm_mink_accept()}</Alert.Title>
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			</div>
		{/if}
		<div class="flex w-full justify-end">
			<Button disabled={!listId} onclick={send}>Send</Button>
		</div>
	{/if}
</Dialog>
