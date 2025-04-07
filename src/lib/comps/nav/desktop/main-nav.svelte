<script lang="ts">
	import * as Menubar from '$lib/comps/ui/menubar';

	import menu_items_constructor from '$lib/comps/nav/menu_items';
	import { page } from '$app/stores';
	const menu_items = menu_items_constructor($page.data.t);
	const keys = Object.keys(menu_items);
</script>

{#each keys as key}
	{#if key !== 'settings' && key !== 'top' && key !== 'tasks'}
		<Menubar.Menu>
			<Menubar.Trigger>{menu_items[key].title()}</Menubar.Trigger>
			<Menubar.Content>
				{#each menu_items[key].children as item}
					<a href={item.href({ ...$page.params })}>
						<Menubar.Item class="flex items-center gap-2 cursor-pointer">
							<svelte:component this={item.icon} class="h-4" strokeWidth={2} />
							{item.title()}
						</Menubar.Item>
					</a>
				{/each}
			</Menubar.Content>
		</Menubar.Menu>
	{/if}
{/each}
