<script lang="ts">
	const { data } = $props();
	import Button from '$lib/comps/ui/button/button.svelte';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import RenderInboundWhatsapp from '$lib/comps/widgets/interactions/RenderInboundWhatsapp.svelte';
	import { list } from '$lib/schema/communications/whatsapp/received_whatsapp_group_messages';
	import { parse } from '$lib/schema/valibot';

	import { onMount, onDestroy } from 'svelte';
	let messages = $state(data.messages);
	let timer: null | ReturnType<typeof setInterval> = $state(null);
	async function fetchLatestInteractions() {
		const result = await fetch(`/api/v1/people/groups/${data.group.id}/whatsapp/messages`);
		if (result.ok) {
			const body = await result.json();
			const parsed = parse(list, body);
			messages = parsed;
		}
	}
	import * as m from '$lib/paraglide/messages';

	onMount(() => {
		timer = setInterval(async () => await fetchLatestInteractions(), 30000);
	});
	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<DataGrid
	options={{
		showFilter: false,
		showBottomSeparator: false,
		showTopSeparator: false,
		contentHighlightHover: false,
		showDivider: false
	}}
	items={messages.items}
	count={messages.count}
	title={`${data.group.name}`}
>
	{#snippet content(message: (typeof data.messages.items)[0], i)}
		<RenderInboundWhatsapp
			messageId={message.id}
			timeAgo={message.received_at}
			message={message.message}
			person={message.person}
		/>
	{/snippet}

	{#snippet headerButton()}
		<div class="flex items-center justify-end w-full lg:w-auto gap-4">
			<Button href="/people/groups/{data.group.id}/members" variant="outline"
				>{m.smart_light_lynx_nudge()}</Button
			>
			<Button href="/people/groups/{data.group.id}/edit">{m.giant_misty_shrimp_stop()}</Button>
		</div>
	{/snippet}
</DataGrid>
