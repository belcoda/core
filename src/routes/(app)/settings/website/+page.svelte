<script lang="ts">
	import PageHeader from '$lib/comps/layout/PageHeader.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/comps/ui/card';
	import Button from '$lib/comps/ui/button/button.svelte';
	import Grid from '$lib/comps/ui/custom/grid.svelte';
	import WebsiteConfigForm from './WebsiteConfigForm.svelte';
	const { data } = $props();
</script>

<PageHeader title={$page.data.t.pages.config.settings.website.index()} />
<div class="mt-6"><WebsiteConfigForm superform={data.form} /></div>

<Grid cols={1}>
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>{$page.data.t.pages.config.settings.website.blocks.index()}</Card.Title>
		</Card.Header>
		<Card.Content>
			<Grid>
				<Button variant="outline" href="/settings/website/blocks"
					>{$page.data.t.pages.config.settings.website.blocks.index()}</Button
				>
				<Button variant="outline" href="/settings/website/blocks/new"
					>{$page.data.t.pages.config.settings.website.blocks.new()}</Button
				>
			</Grid>
		</Card.Content>
	</Card.Root>
</Grid>
