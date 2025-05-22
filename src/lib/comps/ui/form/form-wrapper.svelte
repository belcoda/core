<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPathLeaves, type FormPath } from 'sveltekit-superforms';

	export let form: SuperForm<T>;
	export let name: FormPath<T>; //unfortunately, I would like to use FormPathLeaves<T> as the type here, but <Form.Field> throws a type error on the name field if I do...

	export let label: string | null;
	export let description: string | null = null;

	let class_string: string | null = null;
	export { class_string as class };
	import * as Form from '$lib/comps/ui/form';
	export let noStyle: boolean = false;
</script>

<Form.Field {form} {name} class={class_string}>
	<Form.Control let:attrs {...$$restProps}>
		{#if noStyle}
			<slot {attrs} {label} {description} />
		{:else}
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				<slot {attrs} />
			</div>
			{#if description}<Form.Description>{description}</Form.Description>{/if}
			<Form.FieldErrors />
		{/if}
	</Form.Control>
</Form.Field>
