<script lang="ts">
	import { type InList, defaultInList } from '$lib/schema/people/filters/defaults';
	let { item = $bindable(defaultInList) }: { item: InList } = $props();
	import ListDropdown from '$lib/comps/widgets/lists/ListDropdown.svelte';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<ListDropdown bind:value={item.list_id} onSelectList={(e) => (item.list_id = e.id)} />
	</div>
</div>
