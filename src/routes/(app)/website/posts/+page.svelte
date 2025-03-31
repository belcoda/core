<script lang="ts">
	export let data;
	import * as m from '$lib/paraglide/messages';
	import DataGrid from '$lib/comps/ui/custom/table/DataGrid.svelte';
	import Button from '$lib/comps/ui/button/button.svelte';
</script>

<DataGrid
	title={m.lazy_sad_impala_learn()}
	items={data.posts.items}
	count={data.posts.count}
	newItemHref="/website/posts/new"
	options={{ nothingFoundMessage: m.ideal_tired_elephant_reside() }}
>
	{#snippet headerButton()}
		<Button href="/website/posts/new">{m.close_swift_goose_lend()}</Button>
	{/snippet}
	{#snippet content(content: (typeof data.posts.items)[0])}
		<div class="flex items-center justify-between gap-4">
			<div>{content.name}</div>
			<div class="flex items-center gap-2">
				<Button variant="outline" href={`/website/posts/${content.id}/preview`} target="_blank"
					>{m.alive_silly_antelope_build()}</Button
				>
				<Button href={`/website/posts/${content.id}`}>{m.giant_misty_shrimp_stop()}</Button>
			</div>
		</div>
	{/snippet}
</DataGrid>
