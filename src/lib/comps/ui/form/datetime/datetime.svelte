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
	import { ZonedDateTime, parseAbsoluteToLocal } from '@internationalized/date';

	import { buttonVariants } from '$lib/comps/ui/button/index.js';
	import { Calendar } from '$lib/comps/ui/calendar/index.js';
	import { page } from '$app/stores';
	import * as Popover from '$lib/comps/ui/popover/index.js';
	import Globe from 'lucide-svelte/icons/globe';
	import * as m from '$lib/paraglide/messages';
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
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
	};

	let {
		value = $bindable(),
		minuteSteps = 5,
		form,
		name,
		label,
		class: className,
		description = null
	}: Props = $props();

	function isValidDate(value: Date | string | undefined | null): value is Date {
		if (!value) return false;
		const date = new Date(value);
		return !isNaN(date.getTime());
	}

	let zonedValue: ZonedDateTime = $derived(
		value && isValidDate(value)
			? parseAbsoluteToLocal(value.toISOString())
			: parseAbsoluteToLocal(new Date().toISOString())
	);
	let minuteValue: number = $state(isValidDate(value) ? value?.getMinutes() : 0); //we want the starting default minute to be 0, otherwise let's get from the existing value
	let hourValue: number = $state(isValidDate(value) ? value?.getHours() : 16); //we want the starting default hour to be 16 (4pm), otherwise let's get from the existing value

	const minuteOptions = Array.from({ length: 60 / minuteSteps }, (_, i) => ({
		value: i * minuteSteps,
		label: (i * minuteSteps).toString().padStart(2, '0')
	}));

	const hourOptions = Array.from({ length: 24 }, (_, i) => ({
		value: i,
		label: i.toString()
	}));
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				<Popover.Root>
					<Popover.Trigger
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'w-full bg-background justify-start text-left font-normal',
							!value && 'text-muted-foreground'
						)}
					>
						<CalendarIcon class="mr-2 h-4 w-4" />
						{value
							? `${tf.format(zonedValue.toDate())} ${df.format(zonedValue.toDate())}`
							: m.home_arable_firefox_arrive()}
					</Popover.Trigger>
					<Popover.Content class="flex w-auto flex-col space-y-2 p-2">
						<div class="flex items-center gap-0.5">
							<select
								bind:value={hourValue}
								class={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm 
		ring-offset-background focus:outline-none focus:ring-1 focus:border-blue-600  
		disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-destructive [&>span]:line-clamp-1 data-[placeholder]:[&>span]:text-muted-foreground`}
								onchange={(ev) => {
									if (!ev.target) return;
									const target = ev.target as HTMLSelectElement;
									const v = target.value;
									if (!v) return;
									const newValue = zonedValue.set({
										hour: parseInt(v),
										minute: minuteValue,
										second: 0
									});
									value = newValue.toDate();
								}}
							>
								{#each hourOptions as item}
									<option value={item.value} selected={zonedValue.hour === item.value}
										>{item.label}</option
									>
								{/each}
							</select>
							<select
								bind:value={minuteValue}
								class={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm 

        ring-offset-background focus:outline-none focus:ring-1 focus:border-blue-600  
        disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-destructive [&>span]:line-clamp-1 data-[placeholder]:[&>span]:text-muted-foreground`}
								onchange={(ev) => {
									if (!ev.target) return;
									const target = ev.target as HTMLSelectElement;
									const v = target.value;
									if (!v) return;
									const newValue = zonedValue.set({ minute: parseInt(v), second: 0 });
									value = newValue.toDate();
								}}
							>
								{#each minuteOptions as item}
									<option value={item.value} selected={zonedValue.minute === item.value}
										>{item.label}</option
									>
								{/each}
							</select>
						</div>
						<div class="rounded-md border">
							<Calendar
								type="single"
								onValueChange={(v) => {
									if (!v) return;
									const newValue = zonedValue.set({
										day: v.day,
										month: v.month,
										year: v.year,
										hour: hourValue,
										minute: minuteValue,
										second: 0
									});
									value = newValue.toDate();
								}}
							/>
						</div>
						<div
							class="text-xs px-4 py-0.5 flex items-center justify-center text-muted-foreground gap-1"
						>
							<Globe size={12} />{getLocalTimeZone()}
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
