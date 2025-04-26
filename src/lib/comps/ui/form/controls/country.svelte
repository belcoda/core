<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	type Props = {
		name: FormPath<T>;
		form: SuperForm<T>;
		value: string;
		label?: string | null;
		description?: string | null;
		class?: string;
		placeholder?: string;
	};

	let {
		value = $bindable(),
		form,
		name,
		label,
		description,
		class: className,
		placeholder = m.gross_royal_nuthatch_rise()
	}: Props = $props();

	import * as Form from '$lib/comps/ui/form';
	import { cn } from '$lib/utils';
	import { renderLocalizedCountryName, countryList } from '$lib/i18n/countries';
	// Everything above this can be copied

	import * as m from '$lib/paraglide/messages';

	import * as Select from '$lib/comps/ui/select';
	import { SUPPORTED_COUNTRIES } from '$lib/i18n';

	import { getLocale } from '$lib/paraglide/runtime';
	import { tick } from 'svelte';

	import * as Popover from '$lib/comps/ui/popover';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import Check from 'lucide-svelte/icons/check';
	import * as Command from '$lib/comps/ui/command';
	import Button from '$lib/comps/ui/button/button.svelte';

	const locale = getLocale();

	const options = countryList.map((country) => ({
		value: country.code,
		label: `${country.flag} ${renderLocalizedCountryName(country.code, locale)}`
	}));

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(options.find((f) => f.value === value)?.label);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
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
								{selectedValue || 'Select a framework...'}
								<ChevronsUpDown class="opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-[200px] p-0">
						<Command.Root>
							<Command.Input {placeholder} />
							<Command.List>
								<Command.Empty>{m.tidy_cuddly_pelican_evoke()}</Command.Empty>
								<Command.Group>
									{#each countryList as country}
										<Command.Item
											keywords={[renderLocalizedCountryName(country.code, locale)]}
											value={country.code}
											onSelect={() => {
												value = country.code;
												closeAndFocusTrigger();
											}}
										>
											<Check class={cn(value !== country.code && 'text-transparent')} />
											{`${country.flag} ${renderLocalizedCountryName(country.code, locale)}`}
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
