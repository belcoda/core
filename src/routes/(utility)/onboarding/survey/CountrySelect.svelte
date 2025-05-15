<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		superform: SuperForm<T>;
		class?: string;
		label?: string;
		description?: string;
		field: FormPathLeaves<T>;
	};

	let { superform, field, description, class: className, label, ...rest }: Props = $props();

	let { value, errors, constraints } = formFieldProxy(superform, field);
	($value as string | undefined) = undefined;
	import { renderLocalizedCountryName, countryList } from '$lib/i18n/countries';

	import * as m from '$lib/paraglide/messages';

	import { getLocale } from '$lib/paraglide/runtime';
	import { tick } from 'svelte';

	import * as Popover from '$lib/comps/ui/popover';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import Check from 'lucide-svelte/icons/check';
	import * as Command from '$lib/comps/ui/command';
	import Button from '$lib/comps/ui/button/button.svelte';

	const locale = getLocale();

	const options = countryList.map((country) => ({
		value: country.code,
		label: `${country.flag} ${renderLocalizedCountryName(country.code, locale)}`
	}));

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(options.find((f) => f.value === $value)?.label);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<div class={cn('flex flex-col gap-2', className)}>
	{#if label}<label for="countryList"
			><div class:text-red-700={$errors} class="ms-1 mb-1 text-sm font-medium text-gray-800">
				{label}
			</div></label
		>{/if}
	<Popover.Root bind:open>
		<Popover.Trigger bind:ref={triggerRef}>
			{#snippet child({ props })}
				<Button
					variant="outline"
					class="w-full justify-between"
					{...props}
					role="combobox"
					aria-expanded={open}
				>
					{selectedValue || 'Select a country...'}
					<ChevronsUpDown class="opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-full p-0">
			<Command.Root>
				<Command.Input placeholder="Select your country" id="countryList" />
				<Command.List>
					<Command.Empty>{m.tidy_cuddly_pelican_evoke()}</Command.Empty>
					<Command.Group>
						<Command.Item keywords={['Select a country']} value={undefined} disabled={true} />
						{#each countryList as country}
							<Command.Item
								keywords={[renderLocalizedCountryName(country.code, locale)]}
								value={country.code}
								onSelect={() => {
									($value as string) = country.code;
									closeAndFocusTrigger();
								}}
							>
								<Check class={cn($value !== country.code && 'text-transparent')} />
								{`${country.flag} ${renderLocalizedCountryName(country.code, locale)}`}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	{#if description}<div class="text-muted-foreground text-sm mt-1">
			{description}
		</div>{/if}
</div>
