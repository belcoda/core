<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	import * as Form from '$lib/comps/ui/form';
	import { cn } from '$lib/utils';

	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import ClockIcon from 'lucide-svelte/icons/clock';
	import { DateFormatter, getLocalTimeZone, parseAbsoluteToLocal } from '@internationalized/date';
	import { ZonedDateTime } from '@internationalized/date';

	import { buttonVariants } from '$lib/comps/ui/button/index.js';
	import { Calendar } from '$lib/comps/ui/calendar/index.js';
	import { page } from '$app/stores';
	import * as Popover from '$lib/comps/ui/popover/index.js';
	import Input from '$lib/comps/ui/input/input.svelte';
	import { onMount } from 'svelte';

	// Format for displaying date
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// Format for displaying time
	const tf = new DateFormatter('en-US', {
		timeStyle: 'short'
	});

	type Props = {
		value: Date | string | undefined | null;
		minuteSteps?: number;
		form: SuperForm<T>;
		name: FormPath<T>;
		label: string | null;
		description?: string | null;
		class?: string;
		dateOnly?: boolean;
		use24HourTime?: boolean;
		placeholder?: string;
		dateFormat?: string;
	};

	let {
		value = $bindable(),
		minuteSteps = 5,
		form,
		name,
		label,
		class: className,
		description = null,
		dateOnly = false,
		use24HourTime = false,
		placeholder = '',
		dateFormat = 'yyyy-MM-dd'
	}: Props = $props();

	function isValidDate(value: Date | string | undefined | null): value is Date {
		if (!value) return false;
		const date = new Date(value);
		return !isNaN(date.getTime());
	}

	// Initialize with current date/time if no value provided
	let zonedValue: ZonedDateTime = $derived(
		value && isValidDate(value)
			? parseAbsoluteToLocal(value.toISOString())
			: parseAbsoluteToLocal(new Date().toISOString())
	);

	// For time selection
	let minuteValue: number = $state(isValidDate(value) ? new Date(value).getMinutes() : 0);
	let hourValue: number = $state(isValidDate(value) ? new Date(value).getHours() : 12);
	let amPm: string = $state(hourValue >= 12 ? 'PM' : 'AM');

	// For direct input
	let dateInputValue: string = $state('');
	let timeInputValue: string = $state('');
	let isPopoverOpen: boolean = $state(false);

	// Generate minute options based on minuteSteps
	const minuteOptions = Array.from({ length: 60 / minuteSteps }, (_, i) => ({
		value: i * minuteSteps,
		label: i * minuteSteps < 10 ? `0${i * minuteSteps}` : `${i * minuteSteps}`
	}));

	// Generate hour options (12 or 24 hour format)
	const hourOptions = use24HourTime
		? Array.from({ length: 24 }, (_, i) => ({
				value: i,
				label: i < 10 ? `0${i}` : `${i}`
			}))
		: Array.from({ length: 12 }, (_, i) => ({
				value: i === 0 ? 12 : i,
				label: `${i === 0 ? 12 : i}`
			}));

	// Update hour and minute values when zonedValue changes
	$effect(() => {
		if (zonedValue) {
			// Use a JavaScript Date object instead of calling toDate()
			const jsDate = new Date(value || new Date());

			// Update hour and minute values for selects
			hourValue = jsDate.getHours();
			minuteValue = jsDate.getMinutes();
			amPm = hourValue >= 12 ? 'PM' : 'AM';
		}
	});

	// Format date for the input field (YYYY-MM-DD)
	function formatDateForInput(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// Format time for the input field (HH:MM)
	function formatTimeForInput(date: Date): string {
		let hours = date.getHours();
		if (!use24HourTime) {
			hours = hours % 12;
			hours = hours ? hours : 12; // Convert 0 to 12 for 12-hour format
		}
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${String(hours).padStart(2, '0')}:${minutes}`;
	}

	// Parse date input and update value
	function handleDateInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const inputValue = target.value;

		if (!inputValue) return;

		try {
			// Create a new date from the input
			const [year, month, day] = inputValue.split('-').map(Number);

			// Update the zonedValue with the new date components
			const newValue = zonedValue.set({
				year,
				month: month,
				day
			});

			// Update the value
			value = newValue.toDate();
		} catch (error) {
			console.error('Invalid date input:', error);
		}
	}

	// Parse time input and update value
	function handleTimeInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const inputValue = target.value;

		if (!inputValue) return;

		try {
			// Parse hours and minutes from the input
			const [hoursStr, minutesStr] = inputValue.split(':');
			let hours = parseInt(hoursStr, 10);
			const minutes = parseInt(minutesStr, 10);

			// Convert to 24-hour format if using 12-hour time
			if (!use24HourTime && amPm === 'PM' && hours < 12) {
				hours += 12;
			} else if (!use24HourTime && amPm === 'AM' && hours === 12) {
				hours = 0;
			}

			// Update the zonedValue with the new time components
			const newValue = zonedValue.set({
				hour: hours,
				minute: minutes,
				second: 0
			});

			// Update the value
			value = newValue.toDate();
		} catch (error) {
			console.error('Invalid time input:', error);
		}
	}

	// Handle AM/PM toggle
	function handleAmPmChange(newAmPm: string) {
		amPm = newAmPm;

		// Convert the hour value based on AM/PM selection
		let hours = hourValue;
		if (newAmPm === 'PM' && hours < 12) {
			hours += 12;
		} else if (newAmPm === 'AM' && hours >= 12) {
			hours -= 12;
		}

		// Create a new Date object with the updated hour
		const jsDate = new Date(value || new Date());
		jsDate.setHours(hours);
		value = jsDate;
	}

	// Format the display value for the button
	function getDisplayValue(): string {
		if (!value) {
			return placeholder || $page.data.t.forms.generic.date.placeholder();
		}

		// Use a JavaScript Date object for formatting
		const jsDate = new Date(value);

		if (dateOnly) {
			return df.format(jsDate);
		}

		return `${tf.format(jsDate)} ${df.format(jsDate)}`;
	}

	// Handle hour select change
	function handleHourChange(event: Event) {
		if (!event.target) return;
		const target = event.target as HTMLSelectElement;
		const v = target.value;
		if (!v) return;

		let newHour = parseInt(v);

		// Convert to 24-hour format if using 12-hour time
		if (!use24HourTime) {
			if (amPm === 'PM' && newHour < 12) {
				newHour += 12;
			} else if (amPm === 'AM' && newHour === 12) {
				newHour = 0;
			}
		}

		// Create a new Date object with the updated hour
		const jsDate = new Date(value || new Date());
		jsDate.setHours(newHour);
		value = jsDate;
	}

	// Handle minute select change
	function handleMinuteChange(event: Event) {
		if (!event.target) return;
		const target = event.target as HTMLSelectElement;
		const v = target.value;
		if (!v) return;

		// Create a new Date object with the updated minute
		const jsDate = new Date(value || new Date());
		jsDate.setMinutes(parseInt(v));
		value = jsDate;
	}

	// Handle outside click for popover
	function handlePopoverClose() {
		isPopoverOpen = false;
	}

	// Handle focus events
	function handleFocus() {
		// This is a placeholder for focus handling
	}

	function handleBlur() {
		// This is a placeholder for blur handling
	}

	onMount(() => {
		// Initialize with current date/time if no value provided
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
					<Popover.Content class="flex w-auto flex-col space-y-4 p-3 md:min-w-[350px]">
						<!-- Time selector with dropdowns -->
						{#if !dateOnly}
							<div class="flex items-center gap-2">
								<ClockIcon class="h-4 w-4 text-muted-foreground" />
								<div class="flex items-center gap-1">
									<select
										bind:value={hourValue}
										class="flex h-9 w-16 items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
										on:change={handleHourChange}
									>
										{#each hourOptions as item}
											<option
												value={item.value}
												selected={use24HourTime
													? hourValue === item.value
													: hourValue % 12 === item.value % 12}>{item.label}</option
											>
										{/each}
									</select>
									<span class="text-sm">:</span>
									<select
										bind:value={minuteValue}
										class="flex h-9 w-16 items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
										on:change={handleMinuteChange}
									>
										{#each minuteOptions as item}
											<option value={item.value} selected={minuteValue === item.value}
												>{item.label}</option
											>
										{/each}
									</select>
									{#if !use24HourTime}
										<div class="flex">
											<button
												type="button"
												class={cn(
													buttonVariants({ variant: 'outline', size: 'sm' }),
													amPm === 'AM' ? 'bg-primary text-primary-foreground' : ''
												)}
												on:click={() => handleAmPmChange('AM')}
											>
												AM
											</button>
											<button
												type="button"
												class={cn(
													buttonVariants({ variant: 'outline', size: 'sm' }),
													amPm === 'PM' ? 'bg-primary text-primary-foreground' : ''
												)}
												on:click={() => handleAmPmChange('PM')}
											>
												PM
											</button>
										</div>
									{/if}
								</div>
							</div>
						{/if}

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
