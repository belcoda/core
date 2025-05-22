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
	import CodeFlask from 'codeflask';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let id: string = `id${crypto.randomUUID()}`;

	export let value: null | undefined | string;
	const area_id = crypto.randomUUID();
	type CodeEditorOptions = {
		language: string;
		lineNumbers: boolean;
		value: string | null | undefined;
		areaId?: string;
	};
	export let options: CodeEditorOptions = {
		language: 'html',
		lineNumbers: true,
		value: value
	};

	//this needs to happen so that if options.value === null or undefined, but exported value is not, we can update the options.value
	options.value = value;
	options.areaId = area_id;

	let editor: any;
	onMount(() => {
		editor = new CodeFlask(`#${id}`, options);
		editor.onUpdate((code: string) => {
			value = code;
		});
		//otherwise the value is literally "null"
		if (!value) {
			editor.updateCode('');
		} else {
			editor.updateCode(value);
		}
		if (name && browser) {
			document.getElementById(area_id)?.setAttribute('name', name);
		}
	});
	onDestroy(() => {
		if (editor) {
			//editor.dispose();
			//TODO: Do need to find a way to dispose of the editor when it is dead
		}
	});
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				{#if description}<Form.Description>{description}</Form.Description>{/if}
				<div {id} class={cn('w-full h-60 relative block border rounded', className)}></div>
				<input type="text" name={props.name} {value} hidden />
				<!-- End control block -->
				<Form.FieldErrors />
			</div>
		{/snippet}
	</Form.Control>
</Form.Field>
