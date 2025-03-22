<script>
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages';
	export let data;
	import Button from '$lib/comps/ui/button/button.svelte';
	import Avatar from '$lib/comps/ui/custom/avatar/avatar.svelte';
	import { Badge } from '$lib/comps/ui/badge';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
</script>

<DataGrid
	title={m.top_stock_seahorse_feast()}
	items={data.admins.items}
	count={data.admins.count}
	newItemHref="/settings/admins/new"
>
	{#snippet headerButton()}
		<Button href="/settings/admins/new">{m.blue_yummy_hare_love()}</Button>
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
							<Badge class="ml-3" variant="success">{m.fair_nice_piranha_work()}</Badge>
						{:else}
							<Badge class="ml-3" variant="danger">{m.these_safe_mantis_kick()}</Badge>
						{/if}
					{:else}
						<Badge class="ml-3" variant="warning">{m.sunny_noble_kudu_bask()}</Badge>
					{/if}
				</div>
			</div>
			<div>
				<Button href="/settings/admins/{admin.id}" variant="outline" size="sm">
					{m.giant_misty_shrimp_stop()}
				</Button>
			</div>
		</div>
	{/snippet}
</DataGrid>
