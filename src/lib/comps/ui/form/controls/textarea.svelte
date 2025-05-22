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

	import Textarea from '$lib/comps/ui/textarea/textarea.svelte';
	export let value: string;
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				<Textarea
					{...props}
					bind:value
					class={cn('min-h-24 focus-visible:ring-blue-600', className)}
					{...$$restProps}
				/>
			</div>
			{#if description}<Form.Description>{description}</Form.Description>{/if}
			<!-- End control block -->
			<Form.FieldErrors />
		{/snippet}
	</Form.Control>
</Form.Field>
