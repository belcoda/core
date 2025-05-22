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
	// Everything above this can be copied

	import Checkbox from '$lib/comps/ui/checkbox/checkbox.svelte';
	export let checked: boolean;
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<div class={cn('flex flex-row items-start space-x-3 space-y-0', className)}>
				<Checkbox {...props} bind:checked {...$$restProps} />
				<label class="block space-y-1 leading-none" for={props.id}>
					{#if label}<Form.Label>{label}</Form.Label>{/if}
					{#if description}
						<Form.Description>{description}</Form.Description>
					{/if}
					<input name={props.name} value={checked} hidden />
				</label>
				<Form.FieldErrors />
			</div>
			<!-- End control block -->
		{/snippet}
	</Form.Control>
</Form.Field>
