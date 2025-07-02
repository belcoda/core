<script lang="ts">
	const { data, children } = $props();
</script>

<svelte:head><title>Belcoda - New organization onboarding</title></svelte:head>
<div class="min-h-screen w-full bg-gradient-to-br from-slate-300 to-stone-300 text-gray-600">
	<div class="mx-auto max-w-lg p-6 rounded-lg bg-gray-50 shadow-lg my-12">
		{@render children()}
	</div>
</div>
