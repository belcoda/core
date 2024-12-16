import { defaults } from '$lib/schema/people/filters/defaults';
import { type FilterTypesOptions } from '$lib/schema/people/filters/filters';
export function generateDefaultFilterValue(filterType: FilterTypesOptions) {
	switch (filterType) {
		case 'email':
			return defaults.defaultEmail;
		//full name is the default case
		/* case 'full_name':
			return defaults.defaultFullName; */
		case 'postcode':
			return defaults.defaultPostcode;
		case 'locality':
			return defaults.defaultLocality;
		case 'state':
			return defaults.defaultState;
		case 'address':
			return defaults.defaultAddress;
		case 'phone_number':
			return defaults.defaultPhoneNumber;
		case 'in_list':
			return defaults.defaultInList;
		case 'not_in_list':
			return defaults.defaultNotInList;
		case 'has_tag':
			return defaults.defaultHasTag;
		case 'not_has_tag':
			return defaults.defaultNotHasTag;
		case 'registered_event':
			return defaults.defaultRegisteredEvent;
		case 'not_registered_event':
			return defaults.defaultNotRegisteredEvent;
		default:
			return defaults.defaultFullName;
	}
}
