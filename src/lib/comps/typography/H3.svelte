<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	const { class: className = '', children }: { class?: string; children: Snippet } = $props();
</script>

<h3 class={cn('text-lg md:text-xl lg:text-xl xl:text-2xl font-bold', className)}>
	{@render children()}
</h3>
