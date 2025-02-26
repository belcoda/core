<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	import * as Form from '$lib/comps/ui/form';
	import { cn } from '$lib/utils';
	// Everything above this can be copied

	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { parseAbsoluteToLocal } from '@internationalized/date';
	import { Button, buttonVariants } from '$lib/comps/ui/button/index.js';
	import { Calendar } from '$lib/comps/ui/calendar/index.js';
	import * as Popover from '$lib/comps/ui/popover/index.js';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	type Props = {
		value: Date | undefined | null;
		form: SuperForm<T>;
		name: FormPath<T>;
		label: string | null;
		description?: string | null;
		class?: string;
		placeholder?: string;
	};

	let {
		value = $bindable(),
		form,
		name,
		label,
		class: className,
		description = null,
		placeholder = ''
	}: Props = $props();

	function isValidDate(value: Date | undefined | null): value is Date {
		if (!value) return false;
		const date = new Date(value);
		return !isNaN(date.getTime());
	}

	let isPopoverOpen: boolean = $state(false);
	let contentRef = $state<HTMLElement | null>(null);
	let dateInputValue: string = $state('');
	let isDateInputFocused: boolean = $state(false);

	// Format date for the input field (YYYY-MM-DD)
	function formatDateForInput(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// Update the date input value when zonedValue changes
	$effect(() => {
		if (value) {
			const date = new Date(value);
			dateInputValue = formatDateForInput(date);
		}
	});

	// Parse date input and update value
	function handleDateInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const inputValue = target.value;

		if (!inputValue) return;

		try {
			// Create a new date from the input
			const [year, month, day] = inputValue.split('-').map(Number);

			// Update the value
			value = new Date(year, month - 1, day);
		} catch (error) {
			console.error('Invalid date input:', error);
		}
	}

	// Format the display value for the button
	function getDisplayValue(): string {
		if (!value) {
			return placeholder || $page.data.t.forms.generic.date.placeholder();
		}

		// Use JavaScript's built-in date formatting
		const date = new Date(value);
		const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
		return date.toLocaleDateString('en-US', options);
	}

	// Handle focus events
	function handleFocus() {
		// This is a placeholder for focus handling
	}

	function handleBlur() {
		// This is a placeholder for blur handling
	}

	onMount(() => {
		// Initialize with current date if no value provided
		if (!value) {
			const now = new Date();
			value = now;
		}
	});
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				<Popover.Root bind:open={isPopoverOpen}>
					<Popover.Trigger
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'w-full bg-background justify-start text-left font-normal',
							!value && 'text-muted-foreground'
						)}
					>
						<CalendarIcon class="mr-2 h-4 w-4" />
						{getDisplayValue()}
					</Popover.Trigger>
					<Popover.Content bind:ref={contentRef} class="flex w-auto flex-col space-y-4 p-3">
						<!-- Calendar for date selection -->
						<div class="rounded-md border">
							<Calendar
								type="single"
								onValueChange={(v) => {
									if (!v) return;

									// Create a new Date object with the selected date
									const jsDate = new Date(value || new Date());
									jsDate.setFullYear(v.year);
									jsDate.setMonth(v.month - 1); // JavaScript months are 0-indexed
									jsDate.setDate(v.day);
									jsDate.setHours(0, 0, 0, 0);

									value = jsDate;
								}}
							/>
						</div>

						<!-- Timezone indicator (hidden from user but shown for context) -->
						<div
							class="text-xs px-4 py-0.5 flex items-center justify-center text-muted-foreground gap-1 opacity-60"
						>
							{getLocalTimeZone()}
						</div>
					</Popover.Content>
				</Popover.Root>
			</div>
			{#if description}<Form.Description>{description}</Form.Description>{/if}
			<!-- End control block -->
			<Form.FieldErrors />
		{/snippet}
	</Form.Control>
</Form.Field>
