<script lang="ts">
	import * as Select from '$lib/comps/ui/select';
	import { changeSignature } from '$lib/comps/forms/email/signatures';
	import { type List as ListSignatures } from '$lib/schema/communications/email/from_signatures';
	let {
		fromSignatures,
		fromSignatureId = $bindable()
	}: { fromSignatures: ListSignatures['items']; fromSignatureId: number | null | undefined } =
		$props();

	const selectedSignature = $derived(() =>
		fromSignatures.find((signature) => signature.id === fromSignatureId)
	);
</script>

<Select.Root type="single" onValueChange={(val) => (fromSignatureId = Number(val))}>
	<Select.Trigger class="w-full">
		{#if selectedSignature()}
			<div>{selectedSignature()?.name} {`<${selectedSignature()?.email}>`}</div>
		{:else}
			<!-- TODO: English text-->
			<div>Select a signature</div>
		{/if}
	</Select.Trigger>
	<Select.Content>
		{#each fromSignatures as signature}
			<Select.Item value={`${signature.id}`}>{signature.name} {`<${signature.email}>`}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
