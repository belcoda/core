<script lang="ts">
	import { cn } from '$lib/utils/shadcn.js';

	let {
		class: className = '',
		asChild = $bindable(false),
		value = $bindable(''),
		placeholder = $bindable('Select date'),
		disabled = $bindable(false),
		size = $bindable('default'), // "default", "sm"
		element
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

<button
	type="button"
	bind:this={element}
	{disabled}
	class={cn(
		'flex w-full items-center justify-between rounded-md border border-input bg-background text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
		sizeClass,
		className
	)}
>
	<span class="truncate">{value || placeholder}</span>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="ml-2 h-4 w-4 opacity-50"
	>
		<path d="M8 2v4" />
		<path d="M16 2v4" />
		<rect width="18" height="18" x="3" y="4" rx="2" />
		<path d="M3 10h18" />
	</svg>
</button>
