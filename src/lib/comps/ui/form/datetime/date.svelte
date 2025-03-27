<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	import * as Form from '$lib/comps/ui/form';
	import { cn } from '$lib/utils';
	// Everything above this can be copied

	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { ZonedDateTime, parseAbsoluteToLocal } from '@internationalized/date';
	import { Button, buttonVariants } from '$lib/comps/ui/button/index.js';
	import { Calendar } from '$lib/comps/ui/calendar/index.js';
	import * as Popover from '$lib/comps/ui/popover/index.js';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	type Props = {
		value: Date | undefined;
		form: SuperForm<T>;
		name: FormPath<T>;
		label: string | null;
		description?: string | null;
		class?: string;
	};
	let {
		value = $bindable(),
		form,
		name,
		label,
		class: className,
		description = null
	}: Props = $props();
	let zonedValue: DateValue = $derived(
		value
			? parseAbsoluteToLocal(value.toISOString())
			: parseAbsoluteToLocal(new Date().toISOString())
	);
	let contentRef = $state<HTMLElement | null>(null);
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
							'w-[280px] justify-start text-left font-normal',
							!zonedValue && 'text-muted-foreground'
						)}
					>
						<Button
							variant="outline"
							class={cn(
								'w-[280px] justify-start text-left font-normal',
								!zonedValue && 'text-muted-foreground'
							)}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{zonedValue ? df.format(zonedValue.toDate()) : m.home_arable_firefox_arrive()}
						</Button>
					</Popover.Trigger>
					<Popover.Content bind:ref={contentRef} class="flex w-auto flex-col space-y-2 p-2">
						<div class="rounded-md border">
							<Calendar
								type="single"
								onValueChange={(v) => {
									if (!v) return;
									const newValue = zonedValue.set({
										day: v.day,
										month: v.month,
										year: v.year,
										hour: 0,
										minute: 0,
										second: 0
									});
									value = newValue.toDate();
								}}
							/>
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
