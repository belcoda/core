<script lang="ts">
	import { page } from '$app/state';
	import TriangleExclamation from 'lucide-svelte/icons/triangle-alert';
	import * as Alert from '$lib/comps/ui/alert/index.js';
	import * as m from '$lib/paraglide/messages';
</script>

<Alert.Root>
	<TriangleExclamation class="size-4" />
	<Alert.Title>{m.yummy_muddy_capybara_nail()}</Alert.Title>
	<Alert.Description class="text-muted-foreground">
		{@html m.spare_good_marmot_laugh({ emailAddress: `${page.data.instance.slug}@belcoda.com` })}
	</Alert.Description>
</Alert.Root>
