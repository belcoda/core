<script lang="ts">
	import { type SuperForm } from 'sveltekit-superforms';
	type Props = {
		name: string;
		form: SuperForm<any>;
		value: string;
		label?: string | null;
		description?: string | null;
		class?: string;
		placeholder?: string;
		onTimezoneChange?: (timezone: string) => void;
		country?: string | null;
	};

	let {
		value = $bindable(),
		form,
		name,
		label,
		description,
		class: className,
		placeholder = 'Select a timezone',
		onTimezoneChange = () => {},
		country = null
	}: Props = $props();

	import * as Form from '$lib/comps/ui/form';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import * as Popover from '$lib/comps/ui/popover';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import Check from 'lucide-svelte/icons/check';
	import * as Command from '$lib/comps/ui/command';
	import Button from '$lib/comps/ui/button/button.svelte';

	import { getCountryTimezones } from '$lib/i18n/countries';

	const timezones = $derived(() => {
		if (typeof Intl.supportedValuesOf !== 'function') {
			console.error('Intl.supportedValuesOf is not supported in this environment.');
			return [];
		}
		return country
			? [...getCountryTimezones(country)]
			: Array.from(Intl.supportedValuesOf('timeZone'));
	});

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(timezones().find((f: string) => f === value));

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<div class={cn('flex flex-col gap-2', className)}>
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				<Popover.Root bind:open>
					<Popover.Trigger bind:ref={triggerRef}>
						{#snippet child({ props })}
							<Button
								variant="outline"
								class="w-[200px] justify-between"
								{...props}
								role="combobox"
								aria-expanded={open}
							>
								{selectedValue || 'Select a timezone'}
								<ChevronsUpDown class="opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-[200px] p-0">
						<Command.Root>
							<Command.Input {placeholder} />
							<Command.List>
								<Command.Empty>Select a timezone</Command.Empty>
								<Command.Group>
									{#each timezones() as timezone}
										<Command.Item
											keywords={[timezone]}
											value={timezone}
											onSelect={() => {
												value = timezone;
												closeAndFocusTrigger();
												onTimezoneChange(timezone);
											}}
										>
											<Check class={cn(value !== timezone && 'text-transparent')} />
											{timezone}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
				{#if description}<Form.Description>{description}</Form.Description>{/if}
				<input hidden bind:value name={props.name} />
			</div>
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
