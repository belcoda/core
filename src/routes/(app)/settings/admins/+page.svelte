<script lang="ts">
	import { goto } from '$app/navigation';
	export let data;
	import Button from '$lib/comps/ui/button/button.svelte';
	import Avatar from '$lib/comps/ui/custom/avatar/avatar.svelte';
	import { Badge } from '$lib/comps/ui/badge';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';

	async function deleteAdmin(adminId: number) {
		try {
			console.log('Deleting admin: ', adminId);
			const response = await fetch(`/api/v1/admins/${adminId}`, {
				method: 'DELETE'
			});
			if (!response.ok) throw new Error('Failed to delete admin');
			goto('/settings/admins', { invalidateAll: true });
		} catch (error) {
			console.error('Error deleting admin: ', error);
			alert(data.t.forms.actions.failed());
		}
	}
</script>

<DataGrid
	title={data.t.pages.config.settings.admins.index()}
	items={data.admins.items}
	count={data.admins.count}
	newItemHref="/settings/admins/new"
>
	{#snippet headerButton()}
		<Button href="/settings/admins/new">{data.t.pages.config.settings.admins.new()}</Button>
	{/snippet}

	{#snippet content(admin)}
		<div class="flex justify-between items-center gap-4">
			<div class="flex items-center gap-2">
				<div>
					<Avatar full_name={admin.full_name} profile_picture_url={admin.profile_picture_url} />
				</div>
				<div>
					<div class="font-medium">{admin.full_name}</div>
					<div class="font-light text-muted-foreground text-sm">{admin.email}</div>
				</div>
				<div class="hidden lg:block">
					{#if admin.has_signed_in}
						{#if admin.active}
							<Badge class="ml-3" variant="success">{data.t.common.status.active()}</Badge>
						{:else}
							<Badge class="ml-3" variant="danger">{data.t.common.status.inactive()}</Badge>
						{/if}
					{:else}
						<Badge class="ml-3" variant="warning">{data.t.common.status.pending()}</Badge>
					{/if}
				</div>
			</div>
			<div class="flex gap-2">
				<Button href="/settings/admins/{admin.id}" variant="outline" size="sm">
					{data.t.forms.buttons.edit()}
				</Button>
				<Button
					size="sm"
					variant="destructive"
					on:click={() => {
						if (window.confirm(data.t.forms.messages.confirm_delete())) {
							deleteAdmin(admin.id);
						}
					}}
				>
					{data.t.forms.buttons.delete()}
				</Button>
			</div>
		</div>
	{/snippet}
</DataGrid>
