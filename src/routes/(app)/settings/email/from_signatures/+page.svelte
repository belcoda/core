<script lang="ts">
	const { data } = $props();
	const dataGridOptions = {
		showHeader: false,
		fullWidthFilter: true,
		showFilter: false,
		showTopSeparator: false,
		showBottomSeparator: false
	};
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import H2 from '$lib/comps/typography/H2.svelte';
	import * as m from '$lib/paraglide/messages';
	import { Badge } from '$lib/comps/ui/badge';
	import Button from '$lib/comps/ui/button/button.svelte';
	import { invalidateAll } from '$app/navigation';
	import Loading from '$lib/comps/helpers/Loading.svelte';
	import Refresh from 'lucide-svelte/icons/refresh-ccw';
	let loading: false | number = $state(false);
	async function refreshVerificationStatus(signatureId: number) {
		loading = signatureId;
		// Call the API to refresh the verification status
		console.log('Refreshing verification status for signature ID:', signatureId);
		const response = await fetch(
			`/api/v1/communications/email/from_signatures/${signatureId}/verify`,
			{
				method: 'PUT'
			}
		);
		if (response.ok) {
			// Handle success
			console.log('Verification status refreshed successfully');
			const data = await response.json();
			console.log('New verification status:', data);
		} else {
			// Handle error
			console.error('Failed to refresh verification status');
		}
		await invalidateAll();
		loading = false;
	}

	async function deleteSignature(signatureId: number) {
		if (window.confirm('Are you sure you want to delete this signature?')) {
			const response = await fetch(`/api/v1/communications/email/from_signatures/${signatureId}`, {
				method: 'DELETE'
			});
			if (response.ok) {
				console.log('Signature deleted successfully');
				await invalidateAll();
			} else {
				console.error('Failed to delete signature');
			}
		}
	}
</script>

<DataGrid
	filterKey="search"
	items={data.from_signatures.items}
	count={data.from_signatures.count}
	title={'Email from signatures'}
	newItemHref="/settings/email/from_signatures/new"
	options={{ nothingFoundMessage: 'No from signatures found', showFilter: false }}
>
	{#snippet content(signature: (typeof data.from_signatures.items)[0])}
		<div class="flex items-center gap-2 justify-between">
			<div class="flex items-center gap-2">
				<div>{`${signature.name} <${signature.email}>`}</div>
				<div>
					{#if signature.verified}
						<Badge variant="success">Verified</Badge>
					{:else}
						<Badge variant="warning">Not verified</Badge>
					{/if}
				</div>
			</div>
			<div class="flex items-center gap-2">
				<Button
					onclick={() => {
						refreshVerificationStatus(signature.id);
					}}
					variant="outline"
					size="sm"
				>
					{#if loading === signature.id}
						<div><Loading /></div>
						<div>Loading...</div>
					{:else}
						<Refresh class="size-5" />
						Refresh verification status
					{/if}
				</Button>
				<Button
					onclick={() => {
						deleteSignature(signature.id);
					}}
					variant="destructive"
					size="sm"
				>
					Delete
				</Button>
			</div>
		</div>
	{/snippet}
	{#snippet headerButton()}
		<Button href="/settings/email/from_signatures/new" variant="default" size="sm">
			{'Create new email from address'}
		</Button>
	{/snippet}
</DataGrid>
