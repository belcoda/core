<script lang="ts">
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Collapsible from '$lib/comps/ui/collapsible/index.js';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import { Button, buttonVariants } from '$lib/comps/ui/button/index.js';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	type Props = {
		class?: string;
		trigger: Snippet;
		children: Snippet;
	};
	const { trigger, children, class: className }: Props = $props();
</script>

<Collapsible.Root class={cn('space-y-2', className)}>
	<div class="flex items-center justify-between space-x-4">
		<h4 class="text-sm font-semibold">{@render trigger()}</h4>
		<Collapsible.Trigger class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-9 p-0')}>
			<ChevronsUpDown class="h-4 w-4" />
			<span class="sr-only">Toggle</span>
		</Collapsible.Trigger>
	</div>
	<Collapsible.Content class="space-y-2">
		<div class="mb-4">{@render children()}</div>
	</Collapsible.Content>
	<Separator />
</Collapsible.Root>
