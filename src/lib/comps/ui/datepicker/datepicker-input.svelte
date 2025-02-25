<script lang="ts">
	import { cn } from '$lib/utils/shadcn.js';

	let {
		class: className = '',
		value = $bindable(''),
		placeholder = $bindable('Select date'),
		disabled = $bindable(false),
		size = $bindable('default') // "default", "sm"
	} = $props();

	// Determine size class
	const sizeClass = $derived(() => {
		switch (size) {
			case 'sm':
				return 'h-8 px-2 py-1 text-xs';
			case 'default':
			default:
				return 'h-10 px-3 py-2 text-sm';
		}
	});
</script>

<input
	type="text"
	bind:value
	readonly
	{placeholder}
	{disabled}
	class={cn(
		'flex w-full rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
		sizeClass,
		className
	)}
/>
