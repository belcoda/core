<script lang="ts">
	import createForm from './form.svelte';
	import TextInput from './TextInput.svelte';
	import CountrySelect from './CountrySelect.svelte';
	import SuperDebug from 'sveltekit-superforms';
	import { PUBLIC_AWS_S3_SITE_UPLOADS_BUCKET_NAME } from '$env/static/public';
	import Loading from '$lib/comps/helpers/Loading.svelte';
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	let error = $state(false);
	const { form, data, warnBeforeDiscard, capture, restore } = createForm({
		onSubmit: async (formData) => {
			try {
				error = false;
				loading = true;
				const response = await fetch('/onboarding/survey/onboard', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(formData)
				});
				if (!response.ok) {
					throw new Error(await response.text());
				}
				await goto('/');
			} catch (error) {
				error = true;
				console.error('Error submitting form:', error);
			} finally {
				loading = false;
			}
		}
	});
	export const snapshot = { capture, restore }; // This will make sure that the form is saved and restored when using browser back/forward buttons
	import FileUpload from '$lib/comps/ui/form/controls/file_upload/simple_file_upload.svelte';
	let loading = $state(false);
</script>

{#if loading}
	<div class="flex justify-center items-center my-20">
		<div>
			<Loading />
			<div class="text-center font-medium">Setting up your organization...</div>
			<div class="text-sm mt-1 text-center text-gray-500">
				This can take a few seconds. Please don't close this page.
			</div>
		</div>
	</div>
{:else}
	{#if error}
		<div
			class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
			role="alert"
		>
			<strong class="font-bold">Error:</strong>
			<span class="block sm:inline">
				We weren't able to create an account. You can try again, but if this keeps happening, please
				get in touch with the support team.
			</span>
		</div>
	{/if}
	<form method="POST" use:form.enhance class="grid grid-cols-1 gap-3">
		{@render H1('Onboarding survey')}
		<p>
			Before we get started, I need to ask a few questions in order to set up your organization on
			the Belcoda platform.
		</p>
		<p>Please read the questions carefully and provide answers to all the ones you can.</p>
		{@render H2('A little bit about you')}
		<p>
			These questions are about you, the person who is setting up this organization on Belcoda. You
			will be the first user for your organization, but you can add other users later.
		</p>
		<TextInput
			superform={form}
			field="ownerName"
			label="Your full name"
			description="This is the name that will be displayed on your profile."
		/>
		<TextInput
			superform={form}
			field="whatsAppNumber"
			label="WhatsApp number"
			description="What's the best phone number to reach you on WhatsApp? Please use the full international format, including the country code. For example, +15551234567."
		/>

		{@render H2('About your organization')}
		<p>
			We need a bit of information about your organization in order to get you set up with the
			correct settings.
		</p>
		<TextInput
			class="mb-3"
			superform={form}
			type="text"
			field="instanceName"
			label="Your organization's name"
		/>
		<TextInput
			superform={form}
			type="text"
			field="instanceSlug"
			label="A short, URL-friendly version of your organization's name"
			description="This will be part of the domain name for your organization's event and other pages hosted on Belcoda. No spaces or special characters are allowed. Only lowercase letters from the English alphabet, numbers and underscores (_)"
		/>
		<div class="font-medium text-gray-800 text-sm -mb-2">Your organization's logo</div>
		<FileUpload
			description="Please upload a logo for your organization. This will be used on your event and other website pages. It must be under 5MB in size and in PNG or JPG format."
			bucketName={PUBLIC_AWS_S3_SITE_UPLOADS_BUCKET_NAME}
			siteUploadsUrl="/onboarding/survey/upload"
			fileTypes={['image/png', 'image/jpeg', 'image/jpg']}
			maxSize={5 * 1024 * 1024}
			onUpload={({ url }) => {
				console.log('Uploaded file URL:', url);
				$data.instanceLogoUrl = url;
			}}
		/>
		<CountrySelect
			superform={form}
			field="country"
			label="Country(*)"
			description="The country in which your organization is based. If you operate in multiple countries, then choose the country that you yourself reside in. This question is mandatory."
		/>
		{@render H2('A quick question about email')}
		<p>
			By default, email sent via Belcoda (for example, event invitations or reminder messages) will
			be appear from:
		</p>
		<p>
			<code
				>{$data.instanceName || 'Instance Name'}
				{`<${$data.instanceSlug || 'instance_slug'}@belcoda.com>`}</code
			>
		</p>
		<p>
			When someone replies to one of those emails, which email address do you want to receive the
			replies at? It should be an email address you check regularly.
		</p>
		<TextInput
			superform={form}
			type="email"
			field="replyToEmail"
			label="Default reply-to email"
			description="Which email address should we direct incoming email messages to? Don't worry, you can change all these settings later."
		/>
		{@render H2('Where else is your organization available online?')}
		<p>
			If you don't have an account on all these platforms, it's totally fine to leave these blank.
		</p>
		<TextInput
			superform={form}
			type="text"
			field="website"
			label="Website"
			description="The URL of your organization's website (leave blank if you don't have one)."
		/>
		<TextInput
			superform={form}
			type="text"
			field="facebook"
			label="Facebook"
			description="The URL of your organization's Facebook page"
		/>
		<TextInput
			superform={form}
			type="text"
			field="twitter"
			label="Twitter/X"
			description="Your organization's Twitter/X account"
		/>
		<TextInput
			superform={form}
			type="text"
			field="instagram"
			label="Instagram"
			description="Your organization's Instagram account"
		/>
		<div>
			<button
				type="submit"
				class="w-full mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Continue
			</button>
		</div>
		{#if dev}<SuperDebug data={$data} />{/if}
	</form>
{/if}

{#snippet H1(text: string)}
	<h1 class="text-3xl lg:text-4xl font-extrabold text-gray-800">{text}</h1>
{/snippet}

{#snippet H2(text: string)}
	<h2 class="text-2xl lg:text-3xl font-extrabold text-gray-800 mt-4">{text}</h2>
{/snippet}
