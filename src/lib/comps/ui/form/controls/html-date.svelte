<script lang="ts" context="module">
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

	import DateInput from '$lib/comps/ui/custom/date/date.svelte';
	export let value: string;
	export let type: string = 'text';
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				<DateInput
					{type}
					{...props}
					bind:value
					class={cn('focus-visible:ring-blue-600', className)}
					{...$$restProps}
				/>
			</div>
		{/snippet}
	</Form.Control>
	{#if description}<Form.Description>{description}</Form.Description>{/if}
	<!-- End control block -->
	<Form.FieldErrors />
</Form.Field>
