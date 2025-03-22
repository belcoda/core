<script lang="ts">
	import { page } from '$app/stores';
	import { update, type Settings } from '$lib/schema/core/instance';
	import { type SuperValidated } from 'sveltekit-superforms';
	import ImageUpload from '$lib/comps/ui/form/controls/file_upload/simple_file_upload.svelte';
	import {
		Button,
		Error,
		Input,
		Grid,
		Debug,
		superForm,
		valibotClient,
		type Infer
	} from '$lib/comps/ui/forms';
	import SimpleInput from '$lib/comps/ui/input/input.svelte'; // without form logic
	import SimpleButton from '$lib/comps/ui/button/button.svelte'; // without form logic
	import Checkbox from '$lib/comps/ui/checkbox/checkbox.svelte';
	import * as Card from '$lib/comps/ui/card';
	import Label from '$lib/comps/ui/label/label.svelte';
	import * as m from '$lib/paraglide/messages';
	type Props = {
		superform: SuperValidated<Infer<typeof update>>;
	};
	const { superform }: Props = $props();

	const form = superForm(superform, {
		validators: valibotClient(update),
		dataType: 'json'
	});
	const { form: formData, enhance, message } = form;

	function removeHeaderRow(row: number) {
		if ($formData.settings) {
			$formData.settings.website.header_links.splice(row, 1);
			$formData.settings = $formData.settings;
		}
	}
	function addHeaderRow() {
		if ($formData.settings) {
			$formData.settings.website.header_links.push({ text: '', url: '', new_tab: false });
			$formData.settings = $formData.settings;
		}
	}

	function removeFooterRow(row: number) {
		if ($formData.settings) {
			$formData.settings.website.footer_links.splice(row, 1);
			$formData.settings = $formData.settings;
		}
	}
	function addFooterRow() {
		if ($formData.settings) {
			$formData.settings.website.footer_links.push({ text: '', url: '', new_tab: false });
			$formData.settings = $formData.settings;
		}
	}
</script>

<form method="post" use:enhance>
	<Grid cols={1}>
		<Error error={$message}></Error>
		{#if $formData.settings}
			<!-- We don't yet support custom domains, but we we will include this setting here once support is added -->
			<!-- <Input
				name="settings.website.custom_domain"
				label={"Custom domain"}
				description={"Custom domain for your instance"}
				{form}
				bind:value={$formData.settings.website.custom_domain as string}
			/> -->
			<ImageUpload
				bind:value={$formData.settings.website.logo_url as string}
				label={m.livid_less_boar_foster()}
				description={m.dry_deft_puma_endure()}
			/>
			<ImageUpload
				label={m.grand_cute_nils_swim()}
				description={m.key_free_rat_lend()}
				bind:value={$formData.settings.website.favicon as string}
			/>

			<Card.Root class="mt-4">
				<Card.Header>
					<Card.Title>{m.late_quiet_chipmunk_burn()}</Card.Title>
					<p class="text-muted-foreground text-sm">
						{m.happy_seemly_leopard_boost()}
					</p>
				</Card.Header>
				<Card.Content>
					{#each $formData.settings.website.header_links as link, i}
						<div class="mb-4">{@render headerLinkRow(i)}</div>
					{/each}
					<div class="flex justify-end">
						<SimpleButton variant="outline" size="sm" onclick={addHeaderRow}
							>{m.direct_trick_crocodile_agree()}</SimpleButton
						>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="mt-4">
				<Card.Header>
					<Card.Title>{m.next_white_cheetah_spur()}</Card.Title>
					<p class="text-muted-foreground text-sm">
						{m.nimble_teary_dingo_launch()}
					</p>
				</Card.Header>
				<Card.Content>
					{#each $formData.settings.website.footer_links as link, i}
						<div class="mb-4">{@render footerLinkRow(i)}</div>
					{/each}
					<div class="flex justify-end">
						<SimpleButton variant="outline" size="sm" onclick={addFooterRow}
							>{m.gross_small_worm_animate()}</SimpleButton
						>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}

		<Button type="submit" class="mt-3" />
		<Debug data={$formData}></Debug>
	</Grid>
</form>

{#snippet headerLinkRow(row: number)}
	<Grid cols={3}>
		{#if $formData.settings}
			<div>
				<Label>{m.extra_wild_earthworm_commend()}</Label>
				<SimpleInput bind:value={$formData.settings.website.header_links[row].text} />
			</div>
			<div>
				<Label>{m.flaky_nimble_nuthatch_borrow()}</Label>
				<SimpleInput bind:value={$formData.settings.website.header_links[row].url} />
			</div>
			<div class="flex items-center gap-1 justify-between">
				<div class="items-top flex space-x-2">
					<Checkbox bind:checked={$formData.settings.website.header_links[row].new_tab} />
					<div class="grid gap-1.5 leading-none">
						<Label
							for="terms1"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{m.super_antsy_flea_honor()}
						</Label>
						<p class="text-muted-foreground text-sm">
							{m.gaudy_low_baboon_pinch()}
						</p>
					</div>
				</div>
				<SimpleButton variant="destructive" size="sm" onclick={() => removeHeaderRow(row)}
					>{m.tame_late_hare_push()}</SimpleButton
				>
			</div>
		{/if}
	</Grid>
{/snippet}

{#snippet footerLinkRow(row: number)}
	<Grid cols={3}>
		{#if $formData.settings}
			<div>
				<Label>{m.extra_wild_earthworm_commend()}</Label>
				<SimpleInput bind:value={$formData.settings.website.footer_links[row].text} />
			</div>
			<div>
				<Label>{m.aqua_proud_oryx_gasp()}</Label>
				<SimpleInput bind:value={$formData.settings.website.footer_links[row].url} />
			</div>
			<div class="flex items-center gap-1 justify-between">
				<div class="items-top flex space-x-2">
					<Checkbox bind:checked={$formData.settings.website.footer_links[row].new_tab} />
					<div class="grid gap-1.5 leading-none">
						<Label
							for="terms1"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{m.any_quick_squirrel_leap()}
						</Label>
						<p class="text-muted-foreground text-sm">
							{m.dry_key_walrus_borrow()}
						</p>
					</div>
				</div>
				<SimpleButton variant="destructive" size="sm" onclick={() => removeFooterRow(row)}
					>{m.acidic_cuddly_rooster_roam()}</SimpleButton
				>
			</div>
		{/if}
	</Grid>
{/snippet}
