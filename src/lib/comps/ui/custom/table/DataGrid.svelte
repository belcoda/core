<script lang="ts" generics="T">
	import Filter from '$lib/comps/ui/custom/filter/filter.svelte';
	import Separator from '$lib/comps/ui/separator/separator.svelte';
	import type { Snippet } from 'svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
	import H1 from '$lib/comps/typography/H1.svelte';

	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Pagination from '$lib/comps/ui/custom/pagination/pagination.svelte';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';

	type DataGridOptions = {
		showHeader?: boolean;
		whiteBackground?: boolean;
		fullWidthFilter?: boolean;
		showFilter?: boolean;
		filterKey?: string;
		showTopSeparator?: boolean;
		showBottomSeparator?: boolean;
		contentHighlightHover?: boolean;
		contentPadding?: boolean;
		showDivider?: boolean;
		contentGridClass?: string;
		filterPlaceholder?: string;
		nothingFoundMessage?: string;
		createNewButtonText?: string;
	};

	const DEFAULT_OPTIONS = {
		showHeader: true,
		whiteBackground: true,
		fullWidthFilter: false,
		showFilter: true,
		filterKey: 'name',
		showTopSeparator: true,
		showBottomSeparator: true,
		contentHighlightHover: true,
		showDivider: true,
		contentPadding: true,
		contentGridClass: 'grid grid-cols-1 relative',
		filterPlaceholder: $page.data.t.forms.fields.generic.filter.placeholder(),
		nothingFoundMessage: $page.data.t.common.data.no_items(),
		createNewButtonText: $page.data.t.forms.buttons.create()
	} as const;

	type Props = {
		items: T[];
		headerSnippet?: Snippet;
		headerButton?: Snippet;
		filterSnippet?: Snippet<[Snippet]>;
		class?: string;
		count: number;
		subtitle?: string | null;
		title?: string;
		newItemHref?: string | null;
		children?: Snippet;
		content: Snippet<[T, number]>;
		separator?: boolean;
		filterKey?: string;
		pagination?: boolean;
		loading?: boolean;
		options?: DataGridOptions;
	};

	let {
		items,
		count,
		loading = $bindable(false),
		children,
		content,
		title = 'Title',
		subtitle = null,
		newItemHref = null,
		class: className,
		filterKey,
		headerSnippet,
		headerButton,
		filterSnippet,

		pagination = true,
		options: propOptions
	}: Props = $props();

	const options = { ...DEFAULT_OPTIONS, ...propOptions };
</script>

{#snippet filter()}
	<Filter
		placeholder={options.filterPlaceholder}
		filterKey={filterKey || options.filterKey}
		bind:loading
	/>
{/snippet}

{#snippet header()}
	<div
		class={cn(
			'flex w-full flex-wrap lg:flex-nowrap gap-4 items-center justify-between mb-4 mt-6',
			className
		)}
	>
		<div>
			{#if headerSnippet}
				{@render headerSnippet()}
			{:else}
				<H1 class="border-b-0">{title}</H1>
				{#if subtitle}<h2 class="mt-2 font-medium text-slate-500">{subtitle}</h2>{/if}
			{/if}
		</div>
		{#if headerButton}
			<div class="flex items-center justify-end">
				{@render headerButton()}
			</div>
		{/if}
	</div>
{/snippet}

{#if options.showHeader}{@render header()}{/if}
{#if children}{@render children()}{/if}
<div class="bg-white rounded shadow-sm border px-4 py-4">
	{#if options.showFilter && count > 0}<div
			class={options.fullWidthFilter ? '' : 'flex justify-end'}
		>
			{#if filterSnippet}
				{@render filterSnippet(filter)}
			{:else}
				{@render filter()}
			{/if}
		</div>{/if}
	{#if options.showTopSeparator && count > 0}
		<Separator class="mt-4" />
	{/if}

	<div class={cn(options.contentGridClass, options.showDivider ? ' divide-y' : '')}>
		{#each items as item, i}
			<div
				class={cn(
					options.contentHighlightHover ? 'hover:bg-slate-100' : '',
					options.contentPadding ? 'p-2' : ''
				)}
			>
				{@render content(item, i)}
			</div>
		{:else}
			<div class="flex items-center justify-center h-48 col-span-full">
				<div>
					<p class="text-muted-foreground text-center text-lg lg:text-xl">
						{options.nothingFoundMessage}
					</p>
					{#if newItemHref}
						<div class="mt-4 flex justify-center">
							<Button href={newItemHref} variant="outline">
								{options.createNewButtonText}
							</Button>
						</div>
					{/if}
				</div>
			</div>
		{/each}
		{#if loading}
			<div class="bg-slate-50 bg-opacity-70 absolute inset-0 flex items-center justify-center z-50">
				<div class="animate-spin rounded-full text-muted-foreground">
					<LoaderCircle />
				</div>
			</div>
		{/if}
	</div>
	{#if options.showBottomSeparator && pagination && count > 0}
		<Separator class="mb-6" />
	{/if}
	{#if pagination && count > 0}
		<Pagination {count} bind:loading />
	{/if}
</div>
