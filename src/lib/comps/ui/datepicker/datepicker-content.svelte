<script lang="ts">
	import { cn } from '$lib/utils/shadcn.js';
	import { Calendar } from '$lib/comps/ui/calendar';
	import type { CalendarDate } from '@internationalized/date';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let {
		class: className = '',
		date = $bindable<CalendarDate | null>(null),
		time = $bindable<string | null>(null),
		includeTime = $bindable(false),
		align = $bindable('center'),
		side = $bindable('bottom'),
		sideOffset = $bindable(4),
		element,
		onSelectDate = (date: CalendarDate) => {},
		onSelectTime = (time: string) => {},
		onSubmit = () => {}
	} = $props();

	// Watch for date changes
	$effect(() => {
		if (date) {
			onSelectDate(date);
		}
	});

	// Handle time change
	function handleTimeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		time = target.value;
		onSelectTime(target.value);
	}

	// Handle submitting the form
	function handleSubmit() {
		onSubmit();
	}
</script>

<div
	bind:this={element}
	class={cn(
		'z-50 overflow-hidden rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
		className
	)}
>
	<div class="flex flex-col space-y-3 p-3">
		<Calendar bind:value={date} />

		{#if includeTime}
			<div class="px-2 pt-2 pb-1 border-t border-border flex flex-col gap-2">
				<label class="text-sm font-medium">Time</label>
				<input
					type="time"
					value={time || ''}
					oninput={handleTimeChange}
					class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
				/>

				<div class="flex justify-end gap-2 mt-2">
					<button
						type="button"
						class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-3"
						onclick={handleSubmit}
					>
						Done
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
