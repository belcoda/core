<script lang="ts">
	import { Button } from '$lib/comps/ui/button';
	import * as Dialog from '$lib/comps/ui/dialog';
	import { type Snippet } from 'svelte';
	let {
		open = $bindable(false),
		children,
		title,
		description
	}: { open: boolean; children: Snippet; title: string; description?: string } = $props();

	function closeDialog() {
		open = false;
	}

	import X from 'lucide-svelte/icons/x';
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			{#if description}
				<Dialog.Description>
					{@html description}
				</Dialog.Description>
			{/if}
		</Dialog.Header>
		{@render children()}
	</Dialog.Content>
</Dialog.Root>
