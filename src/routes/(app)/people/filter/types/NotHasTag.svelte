<script lang="ts">
	import { type NotHasTag, defaultNotHasTag } from '$lib/schema/people/filters/defaults';
	let { item = $bindable(defaultNotHasTag) }: { item: NotHasTag } = $props();
	import TagsDropdown from '$lib/comps/widgets/tags/dropdown/TagsDropdown.svelte';
</script>

<div class="flex gap-4 items-center">
	<div class="flex-grow">
		<TagsDropdown bind:value={item.tag_id} onselect={(e) => (item.tag_id = e.id)} />
	</div>
</div>
