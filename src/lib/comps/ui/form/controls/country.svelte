<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { page } from '$app/stores';
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	export let form: SuperForm<T>;
	export let name: FormPath<T>;
	import * as Form from '$lib/comps/ui/form';
	export let label: string | null;
	export let description: string | null = null;
	import { cn } from '$lib/utils';
	let className = '';
	import { renderLocalizedCountryName, renderFlags } from '$lib/i18n/countries';
	export { className as class };
	// Everything above this can be copied

	import * as m from '$lib/paraglide/messages';

	import * as Select from '$lib/comps/ui/select';
	export let value: string;
	export let placeholder: string = m.gross_royal_nuthatch_rise();
	import { SUPPORTED_COUNTRIES, type SupportedCountry } from '$lib/i18n';

	const options = SUPPORTED_COUNTRIES.map((country) => ({
		value: country,
		label: renderLocalizedCountryName(country)
	}));

	$: selectedItem = SUPPORTED_COUNTRIES.includes(value as (typeof SUPPORTED_COUNTRIES)[number])
		? {
				label: renderLocalizedCountryName(value as (typeof SUPPORTED_COUNTRIES)[number]), //this is fine, because we're already checking...
				value: value
			}
		: undefined;
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				<Select.Root type="single" bind:value name={props.name}>
					<Select.Trigger {...props} class={cn('focus-visible:border-2 ', className)}>
						{#if selectedItem}
							<div class="flex items-center gap-2 justify-start">
								{renderFlags(value as (typeof SUPPORTED_COUNTRIES)[number])}
								{selectedItem.label}
							</div>
						{:else}
							{placeholder}
						{/if}
					</Select.Trigger>
					<Select.Content>
						{#each options as option}
							<Select.Item
								value={option.value}
								label={option.label}
								class="flex items-center gap-1"
							>
								<div>
									{renderFlags(option.value as (typeof SUPPORTED_COUNTRIES)[number])}
								</div>
								<div>{option.label}</div>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value name={props.name} />
			</div>
			{#if description}<Form.Description>{description}</Form.Description>{/if}
			<!-- End control block -->
			<Form.FieldErrors />
		{/snippet}
	</Form.Control>
</Form.Field>
