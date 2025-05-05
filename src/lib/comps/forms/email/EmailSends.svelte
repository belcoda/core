<script lang="ts">
	import { page } from '$app/state';
	import { type List as ListSends } from '$lib/schema/communications/email/sends';
	import { type Read as ReadMessage } from '$lib/schema/communications/email/messages';
	type Props = {
		sends: ListSends;
		message: ReadMessage;
		loading: boolean;
	};
	const { sends, message, loading = $bindable() }: Props = $props();

	import * as Card from '$lib/comps/ui/card';
	import Loading from '$lib/comps/helpers/Loading.svelte';
	import SendEmail from '$lib/comps/forms/email/SendEmail.svelte';

	import * as m from '$lib/paraglide/messages';
</script>

<Card.Root class="mb-6">
	<Card.Header>
		<Card.Title>{sends.count > 0 ? 'Sent' : 'Send'}</Card.Title>
	</Card.Header>
	{#if loading}
		<div class="my-12"><Loading /></div>
	{:else}
		<Card.Content>
			{#if sends.count > 0}
				{#each sends.items as send}
					Sent to <a href="/people/lists/{send.list_id}">list</a>
					{page.data.timeAgo.format(send.created_at)}
				{/each}
			{:else}
				<div class="flex justify-end">
					<SendEmail messageId={message.id} {message} />
				</div>
			{/if}
		</Card.Content>
	{/if}
</Card.Root>
