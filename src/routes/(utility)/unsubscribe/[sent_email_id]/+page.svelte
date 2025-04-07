<script lang="ts">
	export let data;
	import * as m from '$lib/paraglide/messages';
	import CircleCheck from 'lucide-svelte/icons/circle-check';
</script>

<div>
	<CircleCheck class="text-green-500 w-16 h-16 mx-auto mb-4" />
	<h2 class="text-center text-2xl font-bold">
		{m.zippy_honest_mole_amaze()}
	</h2>
	<p class="mt-4 text-muted-foreground">
		{@html m.new_empty_badger_spur({ email: data.person.email?.email })}
	</p>
</div>
