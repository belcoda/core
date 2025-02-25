<script lang="ts">
	import { createPopover } from '@melt-ui/svelte';
	import { CalendarDate, getLocalTimeZone, toZoned } from '@internationalized/date';
	import { cn } from '$lib/utils/shadcn.js';
	import { Calendar } from '$lib/comps/ui/calendar';
	import * as Popover from '$lib/comps/ui/popover';

	// Props
	let {
		class: className = '',
		date = $bindable(null),
		time = $bindable(null),
		includeTime = $bindable(false),
		format = $bindable('yyyy-MM-dd'),
		placeholder = $bindable('Select date'),
		disabled = $bindable(false),
		required = $bindable(false),
		name = $bindable(''),
		calendarProps = {}
	} = $props();

	// Store the combined date and time
	const dateTime = $derived(() => {
		if (!date) return null;

		// If time is included, combine date with time
		if (includeTime && time) {
			const [hours, minutes] = time.split(':').map(Number);
			const zonedDate = toZoned(date, getLocalTimeZone());
			return zonedDate.set({
				hour: hours,
				minute: minutes
			});
		}

		return date;
	});

	// Format date for display
	const formattedDate = $derived(() => {
		if (!date) return '';

		const formatter = new Intl.DateTimeFormat(undefined, {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			...(includeTime && time
				? {
						hour: '2-digit',
						minute: '2-digit'
					}
				: {})
		});

		if (includeTime && time) {
			const [hours, minutes] = time.split(':').map(Number);
			const dateObj = new Date(date.year, date.month - 1, date.day, hours || 0, minutes || 0);
			return formatter.format(dateObj);
		}

		const dateObj = new Date(date.year, date.month - 1, date.day);
		return formatter.format(dateObj);
	});

	// Popover for the datepicker
	const {
		elements: { trigger, content },
		states: { open }
	} = createPopover({
		closeOnOutsideClick: true
	});

	// Handle date selection
	function handleSelectDate(event) {
		date = event.detail;
		if (!includeTime) {
			open.set(false);
		}
	}
</script>

<div class={cn('w-full', className)}>
	<input
		type="hidden"
		{name}
		value={dateTime ? JSON.stringify(dateTime) : ''}
		{disabled}
		{required}
	/>

	<Popover.Root bind:open={$open}>
		<div class="relative">
			<slot name="trigger" {formattedDate} {placeholder} {disabled}>
				<Popover.Trigger
					bind:element={$trigger}
					class={cn(
						'w-full flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
						className
					)}
					{disabled}
				>
					<span class="truncate">{formattedDate || placeholder}</span>
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
						class="lucide lucide-calendar"
					>
						<path d="M8 2v4" />
						<path d="M16 2v4" />
						<rect width="18" height="18" x="3" y="4" rx="2" />
						<path d="M3 10h18" />
					</svg>
				</Popover.Trigger>
			</slot>

			<Popover.Content bind:element={$content} class="p-0" align="start">
				<div class="flex flex-col space-y-3 p-3">
					<Calendar value={date} onSelectedChange={handleSelectDate} {...calendarProps} />

					{#if includeTime}
						<div class="px-2 pt-2 pb-1 border-t border-border flex flex-col gap-2">
							<label class="text-sm font-medium">Time</label>
							<input
								type="time"
								bind:value={time}
								class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
							/>

							<div class="flex justify-end gap-2 mt-2">
								<button
									type="button"
									class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-3"
									onclick={() => open.set(false)}
								>
									Done
								</button>
							</div>
						</div>
					{/if}
				</div>
			</Popover.Content>
		</div>
	</Popover.Root>
</div>
