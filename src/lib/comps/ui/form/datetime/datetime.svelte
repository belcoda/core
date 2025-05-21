<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	import * as Form from '$lib/comps/ui/form';
	import { cn } from '$lib/utils';

	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import ClockIcon from 'lucide-svelte/icons/clock';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseAbsoluteToLocal,
		CalendarDate
	} from '@internationalized/date';
	import { ZonedDateTime } from '@internationalized/date';

	import { buttonVariants } from '$lib/comps/ui/button/index.js';
	import { Calendar } from '$lib/comps/ui/calendar/index.js';
	import { page } from '$app/stores';
	import * as Popover from '$lib/comps/ui/popover/index.js';
	import Input from '$lib/comps/ui/input/input.svelte';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';
	import Timezone from '../controls/timezone.svelte';

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
		/**
		 * Controls the granularity of minute selection.
		 * Lower values provide more precise minute selection.
		 * Examples: 1 = every minute, 5 = every 5 minutes, 15 = quarter hours
		 * Must be a divisor of 60 (1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60)
		 */
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
		timezone?: string;
		timezoneEditable?: boolean;
		onTimezoneChange?: (timezone: string) => void;
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
		dateFormat = 'yyyy-MM-dd',
		timezone = '',
		timezoneEditable = false,
		onTimezoneChange = () => {}
	}: Props = $props();

	// Validate minuteSteps to ensure it's a valid divisor of 60
	$effect(() => {
		const validSteps = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
		if (!validSteps.includes(minuteSteps)) {
			console.warn(`Invalid minuteSteps value: ${minuteSteps}. Using default of 5 instead.`);
			minuteSteps = 5;
		}
	});

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
	// Initialize displayHourValue without referencing other state variables
	let displayHourValue: number = $state(0); // Will be set in the effect below
	let amPm: string = $state(
		isValidDate(value) ? (new Date(value).getHours() >= 12 ? 'PM' : 'AM') : 'AM'
	);

	let isPopoverOpen: boolean = $state(false);
	let inputValue: string = $state(getDisplayValue());
	let dateInput = $state<HTMLElement>(null!);

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
			displayHourValue = use24HourTime ? hourValue : hourValue % 12 === 0 ? 12 : hourValue % 12;

			// Get the actual minutes from the date
			const actualMinutes = jsDate.getMinutes();

			// Round to the nearest step if not exactly on a step
			if (actualMinutes % minuteSteps !== 0) {
				// Find the closest minute step
				const roundedMinutes = Math.round(actualMinutes / minuteSteps) * minuteSteps;
				// Handle case where rounding goes to 60
				minuteValue = roundedMinutes === 60 ? 0 : roundedMinutes;

				// If we're displaying a rounded value, update the actual date
				if (minuteValue !== actualMinutes) {
					const newDate = new Date(jsDate);
					newDate.setMinutes(minuteValue);
					// Only update if this is an initial load, not user interaction
					if (!isPopoverOpen) {
						value = newDate;
					}
				}
			} else {
				minuteValue = actualMinutes;
			}

			amPm = hourValue >= 12 ? 'PM' : 'AM';

			// Update input value when the date changes
			inputValue = getDisplayValue();
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
			const [year, month, day] = inputValue.split('-').map(Number);
			const newValue = zonedValue.set({
				year,
				month: month,
				day
			});
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
			const [hoursStr, minutesStr] = inputValue.split(':');
			let hours = parseInt(hoursStr, 10);
			const minutes = parseInt(minutesStr, 10);

			// Convert to 24-hour format if using 12-hour time
			if (!use24HourTime && amPm === 'PM' && hours < 12) {
				hours += 12;
			} else if (!use24HourTime && amPm === 'AM' && hours === 12) {
				hours = 0;
			}

			const newValue = zonedValue.set({
				hour: hours,
				minute: minutes,
				second: 0
			});
			value = newValue.toDate();
		} catch (error) {
			console.error('Invalid time input:', error);
		}
	}

	function handleAmPmChange(newAmPm: string) {
		amPm = newAmPm;

		// Convert the hour value based on AM/PM selection
		let hours = hourValue;
		if (newAmPm === 'PM' && hours < 12) {
			hours += 12;
		} else if (newAmPm === 'AM' && hours >= 12) {
			hours -= 12;
		}

		const jsDate = new Date(value || new Date());
		jsDate.setHours(hours);
		value = jsDate;
	}

	function getDisplayValue(): string {
		if (!value) {
			return placeholder || $page.data.t.forms.generic.date.placeholder();
		}
		const jsDate = new Date(value);

		if (dateOnly) {
			return df.format(jsDate);
		}

		return `${tf.format(jsDate)} ${df.format(jsDate)}`;
	}

	function handleHourChange(event: Event) {
		if (!event.target) return;
		const target = event.target as HTMLSelectElement;
		const v = target.value;
		if (!v) return;

		let selectedHour = parseInt(v);
		let newHour = selectedHour;

		if (!use24HourTime) {
			if (amPm === 'PM' && selectedHour < 12) {
				newHour = selectedHour + 12;
			} else if (amPm === 'AM' && selectedHour === 12) {
				newHour = 0;
			}
		}
		hourValue = newHour;
		displayHourValue = selectedHour;

		const jsDate = new Date(value || new Date());
		jsDate.setHours(newHour);
		value = jsDate;
	}

	function handleMinuteChange(event: Event) {
		if (!event.target) return;
		const target = event.target as HTMLSelectElement;
		const v = target.value;
		if (!v) return;

		const jsDate = new Date(value || new Date());
		jsDate.setMinutes(parseInt(v));
		value = jsDate;
	}

	function handlePopoverClose() {
		isPopoverOpen = false;
	}

	function handleFocus() {
		isPopoverOpen = true;
	}

	function handleInputChange(event: Event) {
		// Don't automatically update the value while user is typing
		// Let the blur event handle the finalization
	}

	function handleInputBlur(event: Event) {
		// Only update date on blur if the input is valid
		const parsedDate = new Date(inputValue);
		if (!isNaN(parsedDate.getTime())) {
			value = parsedDate;
		} else {
			// If input is invalid, revert to the previous valid value
			inputValue = getDisplayValue();
		}
	}

	function handleTimezoneChange(_timezone: string) {
		timezone = _timezone;
		onTimezoneChange(timezone);
	}

	onMount(() => {
		// Initialize with current date/time if no value provided
		if (!value) {
			const now = new Date();
			value = now;
		}
		if (!timezone) {
			timezone = getLocalTimeZone();
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
					<div class="relative w-full">
						<CalendarIcon
							class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
						/>
						<input
							bind:this={dateInput}
							bind:value={inputValue}
							type="text"
							class={cn(
								'w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-1 focus:border-blue-600',
								!value && 'text-muted-foreground'
							)}
							{placeholder}
							onfocus={handleFocus}
							oninput={handleInputChange}
							onblur={handleInputBlur}
						/>
					</div>
					<Popover.Content
						onOpenAutoFocus={(e) => {
							e.preventDefault();
							dateInput?.focus();
						}}
						customAnchor={dateInput}
						class="flex w-auto flex-col space-y-4 p-3 md:min-w-[350px]"
						onInteractOutside={() => {
							isPopoverOpen = false;
						}}
					>
						<!-- Time selector with dropdowns -->
						{#if !dateOnly}
							<div class="flex items-center gap-2">
								<ClockIcon class="h-4 w-4 text-muted-foreground" />
								<div class="flex items-center gap-1">
									<select
										bind:value={displayHourValue}
										class="flex h-9 w-16 items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
										onchange={handleHourChange}
									>
										{#each hourOptions as item}
											<option value={item.value}>{item.label}</option>
										{/each}
									</select>
									<span class="text-sm">:</span>
									<!-- 
										Minute dropdown with configurable steps.
										To change the granularity, set the minuteSteps prop:
										- minuteSteps={1} for every minute
										- minuteSteps={5} for 5-minute intervals (default)
										- minuteSteps={15} for quarter hours
										- etc.
									-->
									<select
										bind:value={minuteValue}
										class="flex h-9 w-16 items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:border-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
										onchange={handleMinuteChange}
									>
										{#each minuteOptions as item}
											<option value={item.value}>{item.label}</option>
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
												onclick={() => handleAmPmChange('AM')}
											>
												AM
											</button>
											<button
												type="button"
												class={cn(
													buttonVariants({ variant: 'outline', size: 'sm' }),
													amPm === 'PM' ? 'bg-primary text-primary-foreground' : ''
												)}
												onclick={() => handleAmPmChange('PM')}
											>
												PM
											</button>
										</div>
									{/if}
								</div>
							</div>
						{/if}

						<div class="rounded-md border">
							<Calendar
								type="single"
								value={value
									? new CalendarDate(
											new Date(value).getFullYear(),
											new Date(value).getMonth() + 1,
											new Date(value).getDate()
										)
									: undefined}
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

						{#if timezoneEditable}
							<Timezone
								{form}
								name="timezone"
								label="Timezone"
								bind:value={timezone}
								onTimezoneChange={handleTimezoneChange}
							/>
						{:else}
							<div
								class="text-xs px-4 py-0.5 flex items-center justify-center text-muted-foreground gap-1 opacity-60"
							>
								{timezone || getLocalTimeZone()}
							</div>
						{/if}
					</Popover.Content>
				</Popover.Root>
			</div>
			{#if description}<Form.Description>{description}</Form.Description>{/if}
			<!-- End control block -->
			<Form.FieldErrors />
		{/snippet}
	</Form.Control>
</Form.Field>
