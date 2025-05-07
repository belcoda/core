<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	export let form: SuperForm<T>;
	export let name: FormPath<T>;
	import * as Form from '$lib/comps/ui/form';
	export let label: string | null;
	export let disabled: boolean = false;
	export let description: string | null = null;
	import { cn } from '$lib/utils';
	let className = '';
	export { className as class };
	// Everything above this can be copied

	import Editor from '@tinymce/tinymce-svelte';
	export let value: string;
	import { onMount } from 'svelte';
	let ready = false;
	onMount(() => {
		ready = true;
	});
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<!-- Start form control block -->
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				{#if description}<Form.Description>{description}</Form.Description>{/if}
				<Editor
					bind:value
					{disabled}
					{...props}
					scriptSrc="/vendor/tinymce/tinymce.min.js"
					apiKey="no-api"
					licenseKey="gpl"
					conf={{
						className: cn('focus-visible:ring-blue-600', className),
						menubar: false,
						promotion: false,
						plugins: ['code', 'importcss'],
						content_css: 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.4/utilities.css',
						toolbar:
							'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code'
					}}
				/>
				<input type="text" name={props.name} {value} hidden />
			</div>

			<!-- End control block -->
			<Form.FieldErrors />
		{/snippet}
	</Form.Control>
</Form.Field>
