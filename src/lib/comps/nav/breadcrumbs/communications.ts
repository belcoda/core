import { type Localization } from '$lib/i18n';

export default function (t: Localization) {
	return {
		'/(app)/communications': [
			{
				title: () => t.pages.home.index(),
				href: () => '/'
			},
			{
				title: () => t.pages.communications.index(),
				href: () => '/communications'
			}
		],
		'/(app)/communications/whatsapp': [
			{
				title: () => t.pages.home.index(),
				href: () => '/'
			},
			{
				title: () => t.pages.communications.index(),
				href: () => '/communications'
			},
			{
				title: () => t.pages.communications.whatsapp.index(),
				href: () => '/communications/whatsapp'
			}
		],
		'/(app)/communications/whatsapp/new': [
			{
				title: () => t.pages.home.index(),
				href: () => '/'
			},
			{
				title: () => t.pages.communications.index(),
				href: () => '/communications'
			},
			{
				title: () => t.pages.communications.whatsapp.index(),
				href: () => '/communications/whatsapp'
			},
			{
				title: () => t.pages.communications.whatsapp.new(),
				href: () => '/communications/whatsapp/new'
			}
		],
		'/(app)/communications/whatsapp/[thread_id]': [
			{
				title: () => t.pages.home.index(),
				href: () => '/'
			},
			{
				title: () => t.pages.communications.index(),
				href: () => '/communications'
			},
			{
				title: () => t.pages.communications.whatsapp.index(),
				href: () => '/communications/whatsapp'
			},
			{
				title: () => t.pages.communications.whatsapp.edit(),
				href: (pageParams?: Record<string, unknown>) =>
					`/communications/whatsapp/${pageParams?.thread_id}`
			}
		],
		'/(app)/communications/whatsapp/[thread_id]/sends': [
			{
				title: () => t.pages.home.index(),
				href: () => '/'
			},
			{
				title: () => t.pages.communications.index(),
				href: () => '/communications'
			},
			{
				title: () => t.pages.communications.whatsapp.index(),
				href: () => '/communications/whatsapp'
			},
			{
				title: () => t.pages.communications.whatsapp.edit(),
				href: (pageParams?: Record<string, unknown>) =>
					`/communications/whatsapp/${pageParams?.thread_id}`
			},
			{
				title: () => t.pages.communications.whatsapp.sends.index(),
				href: (pageParams?: Record<string, unknown>) =>
					`/communications/whatsapp/${pageParams?.thread_id}/sends`
			}
		],
		'/(app)/communications/whatsapp/[thread_id]/sends/new': [
			{
				title: () => t.pages.home.index(),
				href: () => '/'
			},
			{
				title: () => t.pages.communications.index(),
				href: () => '/communications'
			},
			{
				title: () => t.pages.communications.whatsapp.index(),
				href: () => '/communications/whatsapp'
			},
			{
				title: () => t.pages.communications.whatsapp.edit(),
				href: (pageParams?: Record<string, unknown>) =>
					`/communications/whatsapp/${pageParams?.thread_id}`
			},
			{
				title: () => t.pages.communications.whatsapp.sends.index(),
				href: (pageParams?: Record<string, unknown>) =>
					`/communications/whatsapp/${pageParams?.thread_id}/sends`
			},
			{
				title: () => t.pages.communications.whatsapp.sends.new(),
				href: (pageParams?: Record<string, unknown>) =>
					`/communications/whatsapp/${pageParams?.thread_id}/sends/new`
			}
		],
		'/(app)/communications/email/messages': [
			{
				title: () => t.pages.home.index(),
				href: () => '/'
			},
			{
				title: () => t.pages.communications.index(),
				href: () => '/communications'
			},
			{
				title: () => t.pages.communications.email.index(),
				href: () => '/communications/email/messages'
			}
		],
		'/(app)/communications/email/messages/new': [
			{
				title: () => t.pages.home.index(),
				href: () => '/'
			},
			{
				title: () => t.pages.communications.index(),
				href: () => '/communications'
			},
			{
				title: () => t.pages.communications.email.index(),
				href: () => '/communications/email/messages'
			},
			{
				title: () => t.pages.communications.email.new(),
				href: () => '/communications/email/messages/new'
			}
		],
		'/(app)/communications/email/messages/[message_id]': [
			{
				title: () => t.pages.home.index(),
				href: () => '/'
			},
			{
				title: () => t.pages.communications.index(),
				href: () => '/communications'
			},
			{
				title: () => t.pages.communications.email.index(),
				href: () => '/communications/email/messages'
			},
			{
				title: () => t.pages.communications.email.view(),
				href: (params?: Record<string, unknown>) =>
					`/communications/email/messages/${params?.message_id}`
			}
		],

		'/(app)/communications/sms': [
			{
				title: () => t.pages.home.index(),
				href: () => '/'
			},
			{
				title: () => t.pages.communications.index(),
				href: () => '/communications'
			},
			{
				title: () => t.pages.communications.sms(),
				href: () => '/communications/sms'
			}
		]
	};
}
