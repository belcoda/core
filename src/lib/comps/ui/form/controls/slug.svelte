<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	import * as Form from '$lib/comps/ui/form';

	export let form: SuperForm<T>;
	export let name: FormPath<T>;

	export let label: string | null;
	export let description: string | null = null;
	import { cn } from '$lib/utils';
	let className = '';
	export { className as class };
	// Everything above this can be copied

	import Input from '$lib/comps/ui/input/input.svelte';
	import { slugify } from '$lib/utils/text/string';
	export let value: string | number;
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				<Input
					type="text"
					oninput={(e) => {
						if (e.target instanceof HTMLInputElement) {
							e.target.value = slugify(e.target.value);
						}
					}}
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
