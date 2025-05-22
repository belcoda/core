<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	export let form: SuperForm<T>;
	export let name: FormPath<T>;
	import * as Form from '$lib/comps/ui/form';
	export let label: string | null;
	export let description: string | null = null;
	export let disabled: boolean = false;
	import { cn } from '$lib/utils';
	let className = '';
	export { className as class };
	// Everything above this can be copied

	import * as m from '$lib/paraglide/messages';

	import { page } from '$app/stores';
	import * as Select from '$lib/comps/ui/select';
	export let value: string;
	export let placeholder: string = m.front_solid_canary_arrive();

	export let options: { label: string; value: string }[] = [];
	$: currentOption = options.find((option) => option.value === value);

	$: selectedItem = value
		? {
				label: currentOption?.label,
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
				<Select.Root type="single" bind:value name={props.name} {disabled}>
					<Select.Trigger {...props} class={cn('focus-visible:border-2', className)}>
						{selectedItem ? selectedItem.label : placeholder}
					</Select.Trigger>
					<Select.Content>
						{#each options as option}
							<Select.Item value={option.value} label={option.label} />
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
