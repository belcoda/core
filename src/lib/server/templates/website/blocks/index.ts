import actionHeader from '$lib/server/templates/website/blocks/headers/action_header.hbs?raw';
import defaultHeader from '$lib/server/templates/website/blocks/headers/default_header.hbs?raw';
import footer from '$lib/server/templates/website/blocks/footers/footer.hbs?raw';

//events
import eventSuccess from '$lib/server/templates/website/blocks/events/success.hbs?raw';
import eventPageContent from '$lib/server/templates/website/blocks/events/page_content.hbs?raw';
import eventSidebar from '$lib/server/templates/website/blocks/events/sidebar.hbs?raw';
import eventInfo from '$lib/server/templates/website/blocks/events/event_info.hbs?raw';
import eventForm from '$lib/server/templates/website/blocks/events/event_form.hbs?raw';

//petitions
import petitionSuccess from '$lib/server/templates/website/blocks/petitions/success.hbs?raw';
import petitionPageContent from '$lib/server/templates/website/blocks/petitions/page_content.hbs?raw';
import petitionSidebar from '$lib/server/templates/website/blocks/petitions/sidebar.hbs?raw';
import petitionInfo from '$lib/server/templates/website/blocks/petitions/petition_info.hbs?raw';
import petitionForm from '$lib/server/templates/website/blocks/petitions/petition_form.hbs?raw';

//content
import contentPageContent from '$lib/server/templates/website/blocks/content/page_content.hbs?raw';

//utils
import utilsError from '$lib/server/templates/website/blocks/utils/error.hbs?raw';

const blocks = [
	{
		name: 'action_header',
		template: actionHeader
	},
	{
		name: 'default_header',
		template: defaultHeader
	},
	{
		name: 'footer',
		template: footer
	},

	//events
	{
		name: 'event_success',
		template: eventSuccess
	},
	{
		name: 'event_page_content',
		template: eventPageContent
	},
	{
		name: 'event_sidebar',
		template: eventSidebar
	},
	{
		name: 'event_info',
		template: eventInfo
	},
	{
		name: 'event_form',
		template: eventForm
	},

	// petitions
	{
		name: 'petition_success',
		template: petitionSuccess
	},
	{
		name: 'petition_page_content',
		template: petitionPageContent
	},
	{
		name: 'petition_sidebar',
		template: petitionSidebar
	},
	{
		name: 'petition_info',
		template: petitionInfo
	},
	{
		name: 'petition_form',
		template: petitionForm
	},

	//content
	{
		name: 'content_page_content',
		template: contentPageContent
	},

	//utils
	{
		name: 'error',
		template: utilsError
	}
];

export default blocks;
