<script lang="ts">
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/comps/ui/button';
	import { page } from '$app/stores';
	import menuItemsConstructor from '$lib/comps/nav/menu_items';
	const menuItems = menuItemsConstructor($page.data.t);
	const items = Object.keys(menuItems);
	export let open: boolean;
</script>

<nav>
	<ul class="flex flex-col gap-2 my-4">
		{#each items as itemKey}
			{#if itemKey !== 'settings' && itemKey !== 'top' && itemKey !== 'tasks'}
				<li>
					<span class="flex gap-2 text-lg font-bold">
						{menuItems[itemKey].title()}
					</span>
					<ul class="flex flex-col gap-0 pl-6 mt-2">
						{#each menuItems[itemKey].children as child}
							<a
								href={child.href({ ...$page.params })}
								onclick={() => (open = false)}
								class={cn(
									buttonVariants({ variant: 'ghost', size: 'sm' }),
									$page.url.pathname === child.href({ ...$page.params })
										? 'bg-muted hover:bg-muted'
										: 'hover:bg-muted'
								)}
							>
								<li class="justify-start w-full flex gap-2 items-center">
									<div>
										<svelte:component
											this={child.icon}
											size={18}
											class="text-slate-900"
											strokeWidth={2}
										/>
									</div>
									{child.title()}
								</li>
							</a>
						{/each}
					</ul>
				</li>
			{/if}
		{/each}
	</ul>
</nav>
