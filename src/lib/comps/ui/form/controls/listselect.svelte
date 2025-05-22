<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	export let form: SuperForm<T>;
	export let name: FormPath<T>;
	export let buttonLabel: string | null = null;
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
	<Form.Control>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				{#if description}<Form.Description>{description}</Form.Description>{/if}
				<div class={cn(className)}>
					{#if buttonLabel}
						<ListDropdown label={buttonLabel} bind:value {onSelectList} />
					{:else}
						<ListDropdown bind:value {onSelectList} />
					{/if}
				</div>
				<input type="text" name={props.name} {value} hidden />
			</div>
		{/snippet}
	</Form.Control>

	<!-- End control block -->
	<Form.FieldErrors />
</Form.Field>
