<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPath } from 'sveltekit-superforms';
	export let form: SuperForm<T>;
	export let name: FormPath<T>;
	import * as Form from '$lib/comps/ui/form';
	export let label: string | null = null;
	export let description: string | null = null;
	import { cn } from '$lib/utils';
	let className = '';
	export { className as class };

	import Input from '$lib/comps/ui/input/input.svelte';
	import { Eye, EyeOff } from 'lucide-svelte';
	import Button from '$lib/comps/ui/button/button.svelte';

	export let value = '';
	let showPassword = false;
	let type = 'password';

	function togglePassword() {
		showPassword = !showPassword;
		type = showPassword ? 'text' : 'password';
	}
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<div class="flex flex-col gap-2">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
				<div class="relative">
					<Input
						{type}
						{...props}
						bind:value
						class={cn('focus-visible:ring-blue-600 pr-10', className)}
						{...$$restProps}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
						onclick={togglePassword}
					>
						{#if showPassword}
							<EyeOff class="h-4 w-4" />
						{:else}
							<Eye class="h-4 w-4" />
						{/if}
					</Button>
				</div>
			</div>
		{/snippet}
	</Form.Control>
	{#if description}<Form.Description>{description}</Form.Description>{/if}
	<Form.FieldErrors />
</Form.Field>
