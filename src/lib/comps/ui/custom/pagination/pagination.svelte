<script lang="ts">
	import * as Pagination from '$lib/comps/ui/pagination';

	let {
		onPageChange,
		count,
		showOnSinglePage = false,
		loading = $bindable(false)
	}: {
		onPageChange?: (newPage: number) => {};
		count: number;
		showOnSinglePage?: boolean;
		loading: boolean;
	} = $props();
	import { MediaQuery } from 'svelte/reactivity';
	const isDesktop = new MediaQuery('min-width: 768px');

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	const perPage = $state(Number($page.url.searchParams.get('perPage')) || 25);
	const initialPage = $state(Number($page.url.searchParams.get('page')) || 1);
	const siblingCount = $derived(isDesktop.current ? 1 : 0);
	async function handlePageChange(newPage: number) {
		//set the params... invalidate;
		if (browser) {
			loading = true;
			const params = new URLSearchParams(window.location.search);
			params.set('page', newPage.toString());
			await goto(`${window.location.pathname}?${params.toString()}`, { keepFocus: true });
			if (typeof onPageChange === 'function') onPageChange(newPage);
			loading = false;
		}
	}
	const show = $derived((showOnSinglePage && count > 0) || count > perPage);
</script>

{#if show}
	<Pagination.Root
		{count}
		{perPage}
		page={initialPage}
		{siblingCount}
		class="mt-4"
		onPageChange={handlePageChange}
	>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item class="hidden lg:block">
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item class={currentPage === page.value ? '' : 'hidden lg:block'}>
							<Pagination.Link {page} isActive={currentPage == page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
{/if}
