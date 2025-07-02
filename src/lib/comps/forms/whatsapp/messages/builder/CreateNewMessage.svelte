<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { type Message } from '$lib/schema/communications/whatsapp/elements/message';
	type Props = {
		oncreate: (message: Message) => void;
	};
	let { oncreate }: Props = $props();
	import Button from '$lib/comps/ui/button/button.svelte';
	import Input from '$lib/comps/ui/input/input.svelte';

	let message: Message = $state({
		type: 'text',
		text: {
			body: '',
			preview_url: true
		}
	});
</script>

<div class="flex gap-4 items-baseline">
	<div class="flex-grow">
		{#if message.type === 'text'}
			<Input type="text" bind:value={message.text.body} class="w-full" />
		{/if}
	</div>
	<div>
		<Button
			class="btn btn-primary"
			onclick={() => {
				oncreate(message);
				message.text.body = '';
			}}
		>
			{m.tidy_watery_ape_lift()}
		</Button>
	</div>
</div>
