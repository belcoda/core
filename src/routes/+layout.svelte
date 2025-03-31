<script lang="ts">
	import '../app.css';
	const { children } = $props();
	import type { SupportedLanguage } from '$lib/i18n';

	import ParaglideClientSide from '$lib/i18n/ParaglideClientSide.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	let locale: SupportedLanguage = $state(getLocale());
</script>

<ParaglideClientSide bind:locale />

{#key locale}
	<!-- Forces the layout to rerender when language is changed -->
	{@render children()}
{/key}
