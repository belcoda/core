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
				label={$page.data.t.forms.fields.settings.website.custom_domain.label()}
				description={$page.data.t.forms.fields.settings.website.custom_domain.description()}
				{form}
				bind:value={$formData.settings.website.custom_domain as string}
			/> -->
			<ImageUpload
				bind:value={$formData.settings.website.logo_url as string}
				label={$page.data.t.forms.fields.settings.website.logo.label()}
				description={$page.data.t.forms.fields.settings.website.logo.description()}
			/>
			<ImageUpload
				label={$page.data.t.forms.fields.settings.website.favicon.label()}
				description={$page.data.t.forms.fields.settings.website.favicon.description()}
				bind:value={$formData.settings.website.favicon as string}
			/>

			<Card.Root class="mt-4">
				<Card.Header>
					<Card.Title>{$page.data.t.forms.fields.settings.website.header_links.title()}</Card.Title>
					<p class="text-muted-foreground text-sm">
						{$page.data.t.forms.fields.settings.website.header_links.description()}
					</p>
				</Card.Header>
				<Card.Content>
					{#each $formData.settings.website.header_links as link, i}
						<div class="mb-4">{@render headerLinkRow(i)}</div>
					{/each}
					<div class="flex justify-end">
						<SimpleButton variant="outline" size="sm" onclick={addHeaderRow}
							>{$page.data.t.forms.fields.settings.website.add_link.label()}</SimpleButton
						>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="mt-4">
				<Card.Header>
					<Card.Title>{$page.data.t.forms.fields.settings.website.footer_links.title()}</Card.Title>
					<p class="text-muted-foreground text-sm">
						{$page.data.t.forms.fields.settings.website.footer_links.description()}
					</p>
				</Card.Header>
				<Card.Content>
					{#each $formData.settings.website.footer_links as link, i}
						<div class="mb-4">{@render footerLinkRow(i)}</div>
					{/each}
					<div class="flex justify-end">
						<SimpleButton variant="outline" size="sm" onclick={addFooterRow}
							>{$page.data.t.forms.fields.settings.website.add_link.label()}</SimpleButton
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
				<Label>{$page.data.t.forms.fields.generic.name.label()}</Label>
				<SimpleInput bind:value={$formData.settings.website.header_links[row].text} />
			</div>
			<div>
				<Label>{$page.data.t.forms.fields.generic.url.label()}</Label>
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
							{$page.data.t.forms.fields.settings.website.open_in_new_tab.label()}
						</Label>
						<p class="text-muted-foreground text-sm">
							{$page.data.t.forms.fields.settings.website.open_in_new_tab.description()}
						</p>
					</div>
				</div>
				<SimpleButton variant="destructive" size="sm" onclick={() => removeHeaderRow(row)}
					>{$page.data.t.forms.buttons.remove()}</SimpleButton
				>
			</div>
		{/if}
	</Grid>
{/snippet}

{#snippet footerLinkRow(row: number)}
	<Grid cols={3}>
		{#if $formData.settings}
			<div>
				<Label>{$page.data.t.forms.fields.generic.name.label()}</Label>
				<SimpleInput bind:value={$formData.settings.website.footer_links[row].text} />
			</div>
			<div>
				<Label>{$page.data.t.forms.fields.generic.url.label()}</Label>
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
							{$page.data.t.forms.fields.settings.website.open_in_new_tab.label()}
						</Label>
						<p class="text-muted-foreground text-sm">
							{$page.data.t.forms.fields.settings.website.open_in_new_tab.description()}
						</p>
					</div>
				</div>
				<SimpleButton variant="destructive" size="sm" onclick={() => removeFooterRow(row)}
					>{$page.data.t.forms.buttons.remove()}</SimpleButton
				>
			</div>
		{/if}
	</Grid>
{/snippet}
