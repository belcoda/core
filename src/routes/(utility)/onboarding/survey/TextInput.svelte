<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		superform: SuperForm<T>;
		class?: string;
		label?: string;
		type?: string;
		description?: string;
		field: FormPathLeaves<T>;
	};

	let {
		superform,
		type = 'text',
		field,
		description,
		class: className,
		label,
		...rest
	}: Props = $props();

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<div>
	<label>
		{#if label}<div
				class:text-red-700={$errors}
				class="ms-1 mb-1 text-sm font-medium text-gray-800"
			>
				{label}
			</div>{/if}
		<input
			name={field}
			{type}
			class={cn(
				'block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm font-normal text-gray-800  focus:border-gray-400 focus:ring-0',
				className
			)}
			class:border-red-700={$errors}
			class:focus:border-red-700={$errors}
			aria-invalid={$errors ? 'true' : undefined}
			bind:value={$value}
			{...$constraints}
			{...rest}
		/>
	</label>
	{#if description}<div class="ms-1 mt-1 text-sm text-gray-500">{description}</div>{/if}
	{#if $errors}<span class="mx-1 text-sm text-red-700">{$errors}</span>{/if}
</div>
