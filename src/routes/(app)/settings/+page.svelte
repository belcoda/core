<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/comps/ui/card';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Grid from '$lib/comps/ui/custom/grid.svelte';
	export let data;
	import LanguageSelect from './LanguageSelect.svelte';
</script>

<PageHeader title={$page.data.t.pages.config.settings.index()} />

<Grid cols={1}>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{$page.data.t.pages.config.settings.index()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<LanguageSelect superform={data.form} />
		</Card.Content>
	</Card.Root>
</Grid>

<Grid cols={1}>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{$page.data.t.pages.config.settings.admins.index()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/admins"
					>{$page.data.t.pages.config.settings.admins.index()}</Button
				>
				<Button variant="outline" href="/settings/admins/new"
					>{$page.data.t.pages.config.settings.admins.new()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>

	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{$page.data.t.pages.config.settings.tags.index()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/tags"
					>{$page.data.t.pages.config.settings.tags.index()}</Button
				>
				<Button variant="outline" href="/settings/tags/new"
					>{$page.data.t.pages.config.settings.tags.new()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>

	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{$page.data.t.pages.config.settings.communications.index()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/communications/email/templates"
					>{$page.data.t.pages.config.settings.communications.email.templates.index()}</Button
				>
				<Button variant="outline" href="/settings/communications/email/templates/new"
					>{$page.data.t.pages.config.settings.communications.email.templates.new()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>

	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{$page.data.t.pages.config.settings.website.index()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/website"
					>{$page.data.t.pages.config.settings.website.index()}</Button
				>
				<Button variant="outline" href="/settings/website/blocks"
					>{$page.data.t.pages.config.settings.website.blocks.index()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>

	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{$page.data.t.pages.config.settings.people.index()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/people/imports"
					>{$page.data.t.pages.config.settings.people.imports.index()}</Button
				>
				<Button variant="outline" href="/settings/people/imports/new"
					>{$page.data.t.pages.config.settings.people.imports.new()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>
</Grid>
