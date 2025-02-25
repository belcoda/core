<script lang="ts">
	import { cn } from '$lib/utils/shadcn.js';

	let {
		class: className = '',
		value = $bindable(''),
		disabled = $bindable(false),
		required = $bindable(false),
		size = $bindable('default'), // "default", "sm"
		label = $bindable('Time')
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

<div class="space-y-2">
	{#if label}
		<label class="text-sm font-medium">{label}</label>
	{/if}
	<input
		type="time"
		bind:value
		{disabled}
		{required}
		class={cn(
			'flex w-full rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
			sizeClass,
			className
		)}
	/>
</div>
