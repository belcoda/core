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
	import ListDropdown from '$lib/comps/widgets/lists/ListDropdown.svelte';
	export let value: number;

	import { type List } from '$lib/schema/people/lists';

	function onSelectList(list: List['items'][number]) {
		value = list.id;
	}
</script>

<Form.Field {form} {name}>
	<Form.Control let:attrs>
		<!-- Start form control block -->
		<div class="flex flex-col gap-2">
			{#if label}<Form.Label>{label}</Form.Label>{/if}
			{#if description}<Form.Description>{description}</Form.Description>{/if}
			<div class={cn(className)}>
				<ListDropdown bind:value {onSelectList} />
			</div>
			<input type="text" name={attrs.name} {value} hidden />
		</div>

		<!-- End control block -->
		<Form.FieldErrors />
	</Form.Control>
</Form.Field>
