/* 
This is a file with common localization strings that can be re-used in the application as needed. 

However, generally, when amending or adding new strings, it is recommended to add them to the specific file that they are used in -- and to create a new localization string in every instance. 
We shouldn't be editing the messages directly too much, as it can lead to unexpected changes if we don't remember to check every single reference to that message.

*/

import * as m from '$lib/paraglide/messages';
export const errors = [m.teary_dizzy_earthworm_urge()];
