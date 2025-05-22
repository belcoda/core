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
	import { cn } from '$lib/utils';
	let className = '';
	export { className as class };
	export let disabled: boolean | undefined = false;
	// Everything above this can be copied

	import Switch from '$lib/comps/ui/switch/switch.svelte';
	export let checked: boolean;
</script>

<Form.Field {form} {name}>
	<Form.Control {...$$restProps}>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<label
				for={props.id}
				class={cn('flex flex-row items-center justify-between rounded-lg border p-4', className)}
			>
				<div class="space-y-0.5">
					{#if label}<Form.Label>{label}</Form.Label>{/if}
					{#if description}<Form.Description>{description}</Form.Description>{/if}
				</div>
				<Switch {...props} bind:checked {disabled} />
			</label>
			<Form.FieldErrors />
			<!-- End control block -->
		{/snippet}
	</Form.Control>
</Form.Field>
