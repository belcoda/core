import { type LanguageCode } from '$lib/i18n/languages';

export type CountryEntry = {
	code: string;
	flag: string;
	timezones: readonly string[];
	name?: string;
};

export const countryList: readonly CountryEntry[] = [
	{
		code: 'af',
		flag: '🇦🇫',
		timezones: ['Asia/Kabul']
	},
	{
		code: 'al',
		flag: '🇦🇱',
		timezones: ['Europe/Tirane']
	},
	{
		code: 'dz',
		flag: '🇩🇿',
		timezones: ['Africa/Algiers']
	},
	{
		code: 'as',
		flag: '🇦🇸',
		timezones: ['Pacific/Pago_Pago']
	},
	{
		code: 'ad',
		flag: '🇦🇩',
		timezones: ['Europe/Andorra']
	},
	{
		code: 'ao',
		flag: '🇦🇴',
		timezones: ['Africa/Luanda']
	},
	{
		code: 'ai',
		flag: '🇦🇮',
		timezones: ['America/Anguilla']
	},
	{
		code: 'aq',
		flag: '🇦🇶',
		timezones: [
			'Antarctica/McMurdo',
			'Antarctica/Casey',
			'Antarctica/Davis',
			'Antarctica/DumontDUrville',
			'Antarctica/Mawson',
			'Antarctica/Palmer',
			'Antarctica/Rothera',
			'Antarctica/Syowa',
			'Antarctica/Troll',
			'Antarctica/Vostok'
		]
	},
	{
		code: 'ag',
		flag: '🇦🇬',
		timezones: ['America/Antigua']
	},
	{
		code: 'ar',
		flag: '🇦🇷',
		timezones: [
			'America/Argentina/Buenos_Aires',
			'America/Argentina/Cordoba',
			'America/Argentina/Salta',
			'America/Argentina/Jujuy',
			'America/Argentina/Tucuman',
			'America/Argentina/Catamarca',
			'America/Argentina/La_Rioja',
			'America/Argentina/San_Juan',
			'America/Argentina/Mendoza',
			'America/Argentina/San_Luis',
			'America/Argentina/Rio_Gallegos',
			'America/Argentina/Ushuaia'
		]
	},
	{
		code: 'am',
		flag: '🇦🇲',
		timezones: ['Asia/Yerevan']
	},
	{
		code: 'aw',
		flag: '🇦🇼',
		timezones: ['America/Aruba']
	},
	{
		code: 'au',
		flag: '🇦🇺',
		timezones: [
			'Australia/Sydney',
			'Australia/Melbourne',
			'Australia/Brisbane',
			'Australia/Adelaide',
			'Australia/Perth',
			'Australia/Darwin',
			'Australia/Hobart',
			'Australia/Lord_Howe',
			'Antarctica/Macquarie',
			'Australia/Broken_Hill',
			'Australia/Lindeman',
			'Australia/Eucla'
		]
	},
	{
		code: 'at',
		flag: '🇦🇹',
		timezones: ['Europe/Vienna']
	},
	{
		code: 'az',
		flag: '🇦🇿',
		timezones: ['Asia/Baku']
	},
	{
		code: 'bs',
		flag: '🇧🇸',
		timezones: ['America/Nassau']
	},
	{
		code: 'bh',
		flag: '🇧🇭',
		timezones: ['Asia/Bahrain']
	},
	{
		code: 'bd',
		flag: '🇧🇩',
		timezones: ['Asia/Dhaka']
	},
	{
		code: 'bb',
		flag: '🇧🇧',
		timezones: ['America/Barbados']
	},
	{
		code: 'by',
		flag: '🇧🇾',
		timezones: ['Europe/Minsk']
	},
	{
		code: 'be',
		flag: '🇧🇪',
		timezones: ['Europe/Brussels']
	},
	{
		code: 'bz',
		flag: '🇧🇿',
		timezones: ['America/Belize']
	},
	{
		code: 'bj',
		flag: '🇧🇯',
		timezones: ['Africa/Porto-Novo']
	},
	{
		code: 'bm',
		flag: '🇧🇲',
		timezones: ['Atlantic/Bermuda']
	},
	{
		code: 'bt',
		flag: '🇧🇹',
		timezones: ['Asia/Thimphu']
	},
	{
		code: 'bo',
		flag: '🇧🇴',
		timezones: ['America/La_Paz']
	},
	{
		code: 'bq',
		flag: '🇧🇶',
		timezones: ['America/Kralendijk']
	},
	{
		code: 'ba',
		flag: '🇧🇦',
		timezones: ['Europe/Sarajevo']
	},
	{
		code: 'bw',
		flag: '🇧🇼',
		timezones: ['Africa/Gaborone']
	},
	{
		code: 'bv',
		flag: '🇧🇻',
		timezones: ['Europe/Oslo'] // Bouvet Island uses Norway's timezone
	},
	{
		code: 'br',
		flag: '🇧🇷',
		timezones: [
			'America/Sao_Paulo',
			'America/Noronha',
			'America/Belem',
			'America/Fortaleza',
			'America/Recife',
			'America/Araguaina',
			'America/Maceio',
			'America/Bahia',
			'America/Campo_Grande',
			'America/Cuiaba',
			'America/Santarem',
			'America/Porto_Velho',
			'America/Boa_Vista',
			'America/Manaus',
			'America/Eirunepe',
			'America/Rio_Branco'
		]
	},
	{
		code: 'io',
		flag: '🇮🇴',
		timezones: ['Indian/Chagos']
	},
	{
		code: 'bn',
		flag: '🇧🇳',
		timezones: ['Asia/Brunei']
	},
	{
		code: 'bg',
		flag: '🇧🇬',
		timezones: ['Europe/Sofia']
	},
	{
		code: 'bf',
		flag: '🇧🇫',
		timezones: ['Africa/Ouagadougou']
	},
	{
		code: 'bi',
		flag: '🇧🇮',
		timezones: ['Africa/Bujumbura']
	},
	{
		code: 'cv',
		flag: '🇨🇻',
		timezones: ['Atlantic/Cape_Verde']
	},
	{
		code: 'kh',
		flag: '🇰🇭',
		timezones: ['Asia/Phnom_Penh']
	},
	{
		code: 'cm',
		flag: '🇨🇲',
		timezones: ['Africa/Douala']
	},
	{
		code: 'ca',
		flag: '🇨🇦',
		timezones: [
			'America/Toronto',
			'America/Vancouver',
			'America/Edmonton',
			'America/Winnipeg',
			'America/Halifax',
			'America/St_Johns',
			'America/Regina',
			'America/Glace_Bay',
			'America/Moncton',
			'America/Goose_Bay',
			'America/Nipigon',
			'America/Thunder_Bay',
			'America/Iqaluit',
			'America/Pangnirtung',
			'America/Rainy_River',
			'America/Resolute',
			'America/Rankin_Inlet',
			'America/Swift_Current',
			'America/Cambridge_Bay',
			'America/Yellowknife',
			'America/Inuvik',
			'America/Dawson_Creek',
			'America/Fort_Nelson',
			'America/Whitehorse',
			'America/Dawson',
			'America/Creston'
		]
	},
	{
		code: 'ky',
		flag: '🇰🇾',
		timezones: ['America/Cayman']
	},
	{
		code: 'cf',
		flag: '🇨🇫',
		timezones: ['Africa/Bangui']
	},
	{
		code: 'td',
		flag: '🇹🇩',
		timezones: ['Africa/Ndjamena']
	},
	{
		code: 'cl',
		flag: '🇨🇱',
		timezones: ['America/Santiago', 'America/Punta_Arenas', 'Pacific/Easter']
	},
	{
		code: 'cn',
		flag: '🇨🇳',
		timezones: ['Asia/Shanghai', 'Asia/Urumqi']
	},
	{
		code: 'cx',
		flag: '🇨🇽',
		timezones: ['Indian/Christmas']
	},
	{
		code: 'cc',
		flag: '🇨🇨',
		timezones: ['Indian/Cocos']
	},
	{
		code: 'co',
		flag: '🇨🇴',
		timezones: ['America/Bogota']
	},
	{
		code: 'km',
		flag: '🇰🇲',
		timezones: ['Indian/Comoro']
	},
	{
		code: 'cd',
		flag: '🇨🇩',
		timezones: ['Africa/Kinshasa', 'Africa/Lubumbashi']
	},
	{
		code: 'cg',
		flag: '🇨🇬',
		timezones: ['Africa/Brazzaville']
	},
	{
		code: 'ck',
		flag: '🇨🇰',
		timezones: ['Pacific/Rarotonga']
	},
	{
		code: 'cr',
		flag: '🇨🇷',
		timezones: ['America/Costa_Rica']
	},
	{
		code: 'hr',
		flag: '🇭🇷',
		timezones: ['Europe/Zagreb']
	},
	{
		code: 'cu',
		flag: '🇨🇺',
		timezones: ['America/Havana']
	},
	{
		code: 'cw',
		flag: '🇨🇼',
		timezones: ['America/Curacao']
	},
	{
		code: 'cy',
		flag: '🇨🇾',
		timezones: ['Asia/Nicosia', 'Asia/Famagusta']
	},
	{
		code: 'cz',
		flag: '🇨🇿',
		timezones: ['Europe/Prague']
	},
	{
		code: 'ci',
		flag: '🇨🇮',
		timezones: ['Africa/Abidjan']
	},
	{
		code: 'dk',
		flag: '🇩🇰',
		timezones: ['Europe/Copenhagen']
	},
	{
		code: 'dj',
		flag: '🇩🇯',
		timezones: ['Africa/Djibouti']
	},
	{
		code: 'dm',
		flag: '🇩🇲',
		timezones: ['America/Dominica']
	},
	{
		code: 'do',
		flag: '🇩🇴',
		timezones: ['America/Santo_Domingo']
	},
	{
		code: 'ec',
		flag: '🇪🇨',
		timezones: ['America/Guayaquil', 'Pacific/Galapagos']
	},
	{
		code: 'eg',
		flag: '🇪🇬',
		timezones: ['Africa/Cairo']
	},
	{
		code: 'sv',
		flag: '🇸🇻',
		timezones: ['America/El_Salvador']
	},
	{
		code: 'gq',
		flag: '🇬🇶',
		timezones: ['Africa/Malabo']
	},
	{
		code: 'er',
		flag: '🇪🇷',
		timezones: ['Africa/Asmara']
	},
	{
		code: 'ee',
		flag: '🇪🇪',
		timezones: ['Europe/Tallinn']
	},
	{
		code: 'sz',
		flag: '🇸🇿',
		timezones: ['Africa/Mbabane']
	},
	{
		code: 'et',
		flag: '🇪🇹',
		timezones: ['Africa/Addis_Ababa']
	},
	{
		code: 'fk',
		flag: '🇫🇰',
		timezones: ['Atlantic/Stanley']
	},
	{
		code: 'fo',
		flag: '🇫🇴',
		timezones: ['Atlantic/Faroe']
	},
	{
		code: 'fj',
		flag: '🇫🇯',
		timezones: ['Pacific/Fiji']
	},
	{
		code: 'fi',
		flag: '🇫🇮',
		timezones: ['Europe/Helsinki']
	},
	{
		code: 'fr',
		flag: '🇫🇷',
		timezones: ['Europe/Paris']
	},
	{
		code: 'gf',
		flag: '🇬🇫',
		timezones: ['America/Cayenne']
	},
	{
		code: 'pf',
		flag: '🇵🇫',
		timezones: ['Pacific/Tahiti', 'Pacific/Marquesas', 'Pacific/Gambier']
	},
	{
		code: 'tf',
		flag: '🇹🇫',
		timezones: ['Indian/Kerguelen']
	},
	{
		code: 'ga',
		flag: '🇬🇦',
		timezones: ['Africa/Libreville']
	},
	{
		code: 'gm',
		flag: '🇬🇲',
		timezones: ['Africa/Banjul']
	},
	{
		code: 'ge',
		flag: '🇬🇪',
		timezones: ['Asia/Tbilisi']
	},
	{
		code: 'de',
		flag: '🇩🇪',
		timezones: ['Europe/Berlin', 'Europe/Busingen']
	},
	{
		code: 'gh',
		flag: '🇬🇭',
		timezones: ['Africa/Accra']
	},
	{
		code: 'gi',
		flag: '🇬🇮',
		timezones: ['Europe/Gibraltar']
	},
	{
		code: 'gr',
		flag: '🇬🇷',
		timezones: ['Europe/Athens']
	},
	{
		code: 'gl',
		flag: '🇬🇱',
		timezones: ['America/Godthab', 'America/Danmarkshavn', 'America/Scoresbysund', 'America/Thule']
	},
	{
		code: 'gd',
		flag: '🇬🇩',
		timezones: ['America/Grenada']
	},
	{
		code: 'gp',
		flag: '🇬🇵',
		timezones: ['America/Guadeloupe']
	},
	{
		code: 'gu',
		flag: '🇬🇺',
		timezones: ['Pacific/Guam']
	},
	{
		code: 'gt',
		flag: '🇬🇹',
		timezones: ['America/Guatemala']
	},
	{
		code: 'gg',
		flag: '🇬🇬',
		timezones: ['Europe/Guernsey']
	},
	{
		code: 'gn',
		flag: '🇬🇳',
		timezones: ['Africa/Conakry']
	},
	{
		code: 'gw',
		flag: '🇬🇼',
		timezones: ['Africa/Bissau']
	},
	{
		code: 'gy',
		flag: '🇬🇾',
		timezones: ['America/Guyana']
	},
	{
		code: 'ht',
		flag: '🇭🇹',
		timezones: ['America/Port-au-Prince']
	},
	{
		code: 'hm',
		flag: '🇭🇲',
		timezones: ['Indian/Kerguelen'] // Heard and McDonald Islands use same timezone as French Southern Territories
	},
	{
		code: 'va',
		flag: '🇻🇦',
		timezones: ['Europe/Vatican']
	},
	{
		code: 'hn',
		flag: '🇭🇳',
		timezones: ['America/Tegucigalpa']
	},
	{
		code: 'hk',
		flag: '🇭🇰',
		timezones: ['Asia/Hong_Kong']
	},
	{
		code: 'hu',
		flag: '🇭🇺',
		timezones: ['Europe/Budapest']
	},
	{
		code: 'is',
		flag: '🇮🇸',
		timezones: ['Atlantic/Reykjavik']
	},
	{
		code: 'in',
		flag: '🇮🇳',
		timezones: ['Asia/Kolkata']
	},
	{
		code: 'id',
		flag: '🇮🇩',
		timezones: ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Pontianak', 'Asia/Jayapura']
	},
	{
		code: 'ir',
		flag: '🇮🇷',
		timezones: ['Asia/Tehran']
	},
	{
		code: 'iq',
		flag: '🇮🇶',
		timezones: ['Asia/Baghdad']
	},
	{
		code: 'ie',
		flag: '🇮🇪',
		timezones: ['Europe/Dublin']
	},
	{
		code: 'im',
		flag: '🇮🇲',
		timezones: ['Europe/Isle_of_Man']
	},
	{
		code: 'il',
		flag: '🇮🇱',
		timezones: ['Asia/Jerusalem']
	},
	{
		code: 'it',
		flag: '🇮🇹',
		timezones: ['Europe/Rome']
	},
	{
		code: 'jm',
		flag: '🇯🇲',
		timezones: ['America/Jamaica']
	},
	{
		code: 'jp',
		flag: '🇯🇵',
		timezones: ['Asia/Tokyo']
	},
	{
		code: 'je',
		flag: '🇯🇪',
		timezones: ['Europe/Jersey']
	},
	{
		code: 'jo',
		flag: '🇯🇴',
		timezones: ['Asia/Amman']
	},
	{
		code: 'kz',
		flag: '🇰🇿',
		timezones: [
			'Asia/Almaty',
			'Asia/Qyzylorda',
			'Asia/Qostanay',
			'Asia/Aqtobe',
			'Asia/Aqtau',
			'Asia/Atyrau',
			'Asia/Oral'
		]
	},
	{
		code: 'ke',
		flag: '🇰🇪',
		timezones: ['Africa/Nairobi']
	},
	{
		code: 'ki',
		flag: '🇰🇮',
		timezones: ['Pacific/Tarawa', 'Pacific/Enderbury', 'Pacific/Kiritimati']
	},
	{
		name: "Korea, Democratic People's Repubkic of",
		code: 'kp',
		flag: '🇰🇵',
		timezones: ['Asia/Pyongyang']
	},
	{
		code: 'kr',
		flag: '🇰🇷',
		timezones: ['Asia/Seoul']
	},
	{
		code: 'kw',
		flag: '🇰🇼',
		timezones: ['Asia/Kuwait']
	},
	{
		code: 'kg',
		flag: '🇰🇬',
		timezones: ['Asia/Bishkek']
	},
	{
		name: "Lao People's Democratic Republic",
		code: 'la',
		flag: '🇱🇦',
		timezones: ['Asia/Vientiane']
	},
	{
		code: 'lv',
		flag: '🇱🇻',
		timezones: ['Europe/Riga']
	},
	{
		code: 'lb',
		flag: '🇱🇧',
		timezones: ['Asia/Beirut']
	},
	{
		code: 'ls',
		flag: '🇱🇸',
		timezones: ['Africa/Maseru']
	},
	{
		code: 'lr',
		flag: '🇱🇷',
		timezones: ['Africa/Monrovia']
	},
	{
		code: 'ly',
		flag: '🇱🇾',
		timezones: ['Africa/Tripoli']
	},
	{
		code: 'li',
		flag: '🇱🇮',
		timezones: ['Europe/Vaduz']
	},
	{
		code: 'lt',
		flag: '🇱🇹',
		timezones: ['Europe/Vilnius']
	},
	{
		code: 'lu',
		flag: '🇱🇺',
		timezones: ['Europe/Luxembourg']
	},
	{
		code: 'mo',
		flag: '🇲🇴',
		timezones: ['Asia/Macau']
	},
	{
		code: 'mg',
		flag: '🇲🇬',
		timezones: ['Indian/Antananarivo']
	},
	{
		code: 'mw',
		flag: '🇲🇼',
		timezones: ['Africa/Blantyre']
	},
	{
		code: 'my',
		flag: '🇲🇾',
		timezones: ['Asia/Kuala_Lumpur', 'Asia/Kuching']
	},
	{
		code: 'mv',
		flag: '🇲🇻',
		timezones: ['Indian/Maldives']
	},
	{
		code: 'ml',
		flag: '🇲🇱',
		timezones: ['Africa/Bamako']
	},
	{
		code: 'mt',
		flag: '🇲🇹',
		timezones: ['Europe/Malta']
	},
	{
		code: 'mh',
		flag: '🇲🇭',
		timezones: ['Pacific/Majuro', 'Pacific/Kwajalein']
	},
	{
		code: 'mq',
		flag: '🇲🇶',
		timezones: ['America/Martinique']
	},
	{
		code: 'mr',
		flag: '🇲🇦',
		timezones: ['Africa/Nouakchott']
	},
	{
		code: 'mu',
		flag: '🇲🇺',
		timezones: ['Indian/Mauritius']
	},
	{
		code: 'yt',
		flag: '🇾🇹',
		timezones: ['Indian/Mayotte']
	},
	{
		code: 'mx',
		flag: '🇲🇽',
		timezones: [
			'America/Mexico_City',
			'America/Tijuana',
			'America/Monterrey',
			'America/Cancun',
			'America/Merida',
			'America/Matamoros',
			'America/Mazatlan',
			'America/Chihuahua',
			'America/Ojinaga',
			'America/Hermosillo',
			'America/Bahia_Banderas'
		]
	},
	{
		code: 'fm',
		flag: '🇫🇲',
		timezones: ['Pacific/Pohnpei', 'Pacific/Chuuk', 'Pacific/Kosrae']
	},
	{
		code: 'md',
		flag: '🇲🇩',
		timezones: ['Europe/Chisinau']
	},
	{
		code: 'mc',
		flag: '🇲🇨',
		timezones: ['Europe/Monaco']
	},
	{
		code: 'mn',
		flag: '🇲🇳',
		timezones: ['Asia/Ulaanbaatar', 'Asia/Hovd', 'Asia/Choibalsan']
	},
	{
		code: 'me',
		flag: '🇲🇪',
		timezones: ['Europe/Podgorica']
	},
	{
		code: 'ms',
		flag: '🇲🇸',
		timezones: ['America/Montserrat']
	},
	{
		code: 'ma',
		flag: '🇲🇦',
		timezones: ['Africa/Casablanca']
	},
	{
		code: 'mz',
		flag: '🇲🇿',
		timezones: ['Africa/Maputo']
	},
	{
		code: 'mm',
		flag: '🇲🇲',
		timezones: ['Asia/Yangon']
	},
	{
		code: 'na',
		flag: '🇳🇦',
		timezones: ['Africa/Windhoek']
	},
	{
		code: 'nr',
		flag: '🇳🇷',
		timezones: ['Pacific/Nauru']
	},
	{
		code: 'np',
		flag: '🇳🇵',
		timezones: ['Asia/Kathmandu']
	},
	{
		code: 'nl',
		flag: '🇳🇱',
		timezones: ['Europe/Amsterdam']
	},
	{
		code: 'nc',
		flag: '🇳🇨',
		timezones: ['Pacific/Noumea']
	},
	{
		code: 'nz',
		flag: '🇳🇿',
		timezones: ['Pacific/Auckland', 'Pacific/Chatham']
	},
	{
		code: 'ni',
		flag: '🇳🇮',
		timezones: ['America/Managua']
	},
	{
		code: 'ne',
		flag: '🇳🇪',
		timezones: ['Africa/Niamey']
	},
	{
		code: 'ng',
		flag: '🇳🇬',
		timezones: ['Africa/Lagos']
	},
	{
		code: 'nu',
		flag: '🇳🇺',
		timezones: ['Pacific/Niue']
	},
	{
		code: 'nf',
		flag: '🇳🇫',
		timezones: ['Pacific/Norfolk']
	},
	{
		code: 'mk',
		flag: '🇲🇰',
		timezones: ['Europe/Skopje']
	},
	{
		code: 'mp',
		flag: '🇲🇵',
		timezones: ['Pacific/Saipan']
	},
	{
		code: 'no',
		flag: '🇳🇴',
		timezones: ['Europe/Oslo']
	},
	{
		code: 'om',
		flag: '🇴🇲',
		timezones: ['Asia/Muscat']
	},
	{
		code: 'pk',
		flag: '🇵🇰',
		timezones: ['Asia/Karachi']
	},
	{
		code: 'pw',
		flag: '🇵🇼',
		timezones: ['Pacific/Palau']
	},
	{
		code: 'ps',
		flag: '🇵🇸',
		timezones: ['Asia/Gaza', 'Asia/Hebron']
	},
	{
		code: 'pa',
		flag: '🇵🇦',
		timezones: ['America/Panama']
	},
	{
		code: 'pg',
		flag: '🇵🇬',
		timezones: ['Pacific/Port_Moresby', 'Pacific/Bougainville']
	},
	{
		code: 'py',
		flag: '🇵🇾',
		timezones: ['America/Asuncion']
	},
	{
		code: 'pe',
		flag: '🇵🇪',
		timezones: ['America/Lima']
	},
	{
		code: 'ph',
		flag: '🇵🇭',
		timezones: ['Asia/Manila']
	},
	{
		code: 'pn',
		flag: '🇵🇳',
		timezones: ['Pacific/Pitcairn']
	},
	{
		code: 'pl',
		flag: '🇵🇱',
		timezones: ['Europe/Warsaw']
	},
	{
		code: 'pt',
		flag: '🇵🇹',
		timezones: ['Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores']
	},
	{
		code: 'pr',
		flag: '🇵🇷',
		timezones: ['America/Puerto_Rico']
	},
	{
		code: 'qa',
		flag: '🇶🇦',
		timezones: ['Asia/Qatar']
	},
	{
		code: 'ro',
		flag: '🇷🇴',
		timezones: ['Europe/Bucharest']
	},
	{
		code: 'ru',
		flag: '🇷🇺',
		timezones: [
			'Europe/Moscow',
			'Europe/Kaliningrad',
			'Europe/Simferopol',
			'Europe/Kirov',
			'Europe/Volgograd',
			'Europe/Astrakhan',
			'Europe/Saratov',
			'Europe/Ulyanovsk',
			'Europe/Samara',
			'Asia/Yekaterinburg',
			'Asia/Omsk',
			'Asia/Novosibirsk',
			'Asia/Barnaul',
			'Asia/Tomsk',
			'Asia/Novokuznetsk',
			'Asia/Krasnoyarsk',
			'Asia/Irkutsk',
			'Asia/Chita',
			'Asia/Yakutsk',
			'Asia/Khandyga',
			'Asia/Vladivostok',
			'Asia/Ust-Nera',
			'Asia/Magadan',
			'Asia/Sakhalin',
			'Asia/Srednekolymsk',
			'Asia/Kamchatka',
			'Asia/Anadyr'
		]
	},
	{
		code: 'rw',
		flag: '🇷🇼',
		timezones: ['Africa/Kigali']
	},
	{
		code: 're',
		flag: '🇷🇪',
		timezones: ['Indian/Reunion']
	},
	{
		code: 'bl',
		flag: '🇧🇱',
		timezones: ['America/St_Barthelemy']
	},
	{
		code: 'sh',
		flag: '🇸🇭',
		timezones: ['Atlantic/St_Helena']
	},
	{
		code: 'kn',
		flag: '🇰🇳',
		timezones: ['America/St_Kitts']
	},
	{
		code: 'lc',
		flag: '🇱🇨',
		timezones: ['America/St_Lucia']
	},
	{
		code: 'mf',
		flag: '🇲🇫',
		timezones: ['America/Marigot']
	},
	{
		code: 'pm',
		flag: '🇵🇲',
		timezones: ['America/Miquelon']
	},
	{
		code: 'vc',
		flag: '🇻🇨',
		timezones: ['America/St_Vincent']
	},
	{
		code: 'ws',
		flag: '🇼🇸',
		timezones: ['Pacific/Apia']
	},
	{
		code: 'sm',
		flag: '🇸🇲',
		timezones: ['Europe/San_Marino']
	},
	{
		code: 'st',
		flag: '🇸🇹',
		timezones: ['Africa/Sao_Tome']
	},
	{
		code: 'sa',
		flag: '🇸🇦',
		timezones: ['Asia/Riyadh']
	},
	{
		code: 'sn',
		flag: '🇸🇳',
		timezones: ['Africa/Dakar']
	},
	{
		code: 'rs',
		flag: '🇷🇸',
		timezones: ['Europe/Belgrade']
	},
	{
		code: 'sc',
		flag: '🇸🇨',
		timezones: ['Indian/Mahe']
	},
	{
		code: 'sl',
		flag: '🇸🇱',
		timezones: ['Africa/Freetown']
	},
	{
		code: 'sg',
		flag: '🇸🇬',
		timezones: ['Asia/Singapore']
	},
	{
		code: 'sx',
		flag: '🇸🇽',
		timezones: ['America/Lower_Princes']
	},
	{
		code: 'sk',
		flag: '🇸🇰',
		timezones: ['Europe/Bratislava']
	},
	{
		code: 'si',
		flag: '🇸🇮',
		timezones: ['Europe/Ljubljana']
	},
	{
		code: 'sb',
		flag: '🇸🇧',
		timezones: ['Pacific/Guadalcanal']
	},
	{
		code: 'so',
		flag: '🇸🇴',
		timezones: ['Africa/Mogadishu']
	},
	{
		code: 'za',
		flag: '🇿🇦',
		timezones: ['Africa/Johannesburg']
	},
	{
		code: 'gs',
		flag: '🇬🇸',
		timezones: ['Atlantic/South_Georgia']
	},
	{
		code: 'ss',
		flag: '🇸🇸',
		timezones: ['Africa/Juba']
	},
	{
		code: 'es',
		flag: '🇪🇸',
		timezones: ['Europe/Madrid', 'Africa/Ceuta', 'Atlantic/Canary']
	},
	{
		code: 'lk',
		flag: '🇱🇰',
		timezones: ['Asia/Colombo']
	},
	{
		code: 'sd',
		flag: '🇸🇩',
		timezones: ['Africa/Khartoum']
	},
	{
		code: 'sr',
		flag: '🇸🇷',
		timezones: ['America/Paramaribo']
	},
	{
		code: 'sj',
		flag: '🇸🇯',
		timezones: ['Arctic/Longyearbyen']
	},
	{
		code: 'se',
		flag: '🇸🇪',
		timezones: ['Europe/Stockholm']
	},
	{
		code: 'ch',
		flag: '🇨🇭',
		timezones: ['Europe/Zurich']
	},
	{
		code: 'sy',
		flag: '🇸🇾',
		timezones: ['Asia/Damascus']
	},
	{
		code: 'tw',
		flag: '🇹🇼',
		timezones: ['Asia/Taipei']
	},
	{
		code: 'tj',
		flag: '🇹🇯',
		timezones: ['Asia/Dushanbe']
	},
	{
		code: 'tz',
		flag: '🇹🇿',
		timezones: ['Africa/Dar_es_Salaam']
	},
	{
		code: 'th',
		flag: '🇹🇭',
		timezones: ['Asia/Bangkok']
	},
	{
		code: 'tl',
		flag: '🇹🇱',
		timezones: ['Asia/Dili']
	},
	{
		code: 'tg',
		flag: '🇹🇬',
		timezones: ['Africa/Lome']
	},
	{
		code: 'tk',
		flag: '🇹🇰',
		timezones: ['Pacific/Fakaofo']
	},
	{
		code: 'to',
		flag: '🇹🇴',
		timezones: ['Pacific/Tongatapu']
	},
	{
		code: 'tt',
		flag: '🇹🇹',
		timezones: ['America/Port_of_Spain']
	},
	{
		code: 'tn',
		flag: '🇹🇳',
		timezones: ['Africa/Tunis']
	},
	{
		code: 'tm',
		flag: '🇹🇲',
		timezones: ['Asia/Ashgabat']
	},
	{
		code: 'tc',
		flag: '🇹🇨',
		timezones: ['America/Grand_Turk']
	},
	{
		code: 'tv',
		flag: '🇹🇻',
		timezones: ['Pacific/Funafuti']
	},
	{
		code: 'tr',
		flag: '🇹🇷',
		timezones: ['Europe/Istanbul']
	},
	{
		code: 'ug',
		flag: '🇺🇬',
		timezones: ['Africa/Kampala']
	},
	{
		code: 'ua',
		flag: '🇺🇦',
		timezones: ['Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye']
	},
	{
		code: 'ae',
		flag: '🇦🇪',
		timezones: ['Asia/Dubai']
	},
	{
		code: 'gb',
		flag: '🇬🇧',
		timezones: ['Europe/London']
	},
	{
		code: 'um',
		flag: '🇺🇲',
		timezones: ['Pacific/Wake', 'Pacific/Midway', 'Pacific/Johnston']
	},
	{
		code: 'us',
		flag: '🇺🇸',
		timezones: [
			'America/New_York',
			'America/Chicago',
			'America/Denver',
			'America/Los_Angeles',
			'America/Anchorage',
			'Pacific/Honolulu',
			'America/Phoenix',
			'America/Detroit',
			'America/Kentucky/Louisville',
			'America/Kentucky/Monticello',
			'America/Indiana/Indianapolis',
			'America/Indiana/Vincennes',
			'America/Indiana/Winamac',
			'America/Indiana/Marengo',
			'America/Indiana/Petersburg',
			'America/Indiana/Vevay',
			'America/Indiana/Tell_City',
			'America/Indiana/Knox',
			'America/Menominee',
			'America/North_Dakota/Center',
			'America/North_Dakota/New_Salem',
			'America/North_Dakota/Beulah',
			'America/Boise',
			'America/Juneau',
			'America/Sitka',
			'America/Metlakatla',
			'America/Yakutat',
			'America/Nome',
			'America/Adak'
		]
	},
	{
		code: 'uy',
		flag: '🇺🇾',
		timezones: ['America/Montevideo']
	},
	{
		code: 'uz',
		flag: '🇺🇿',
		timezones: ['Asia/Tashkent', 'Asia/Samarkand']
	},
	{
		code: 'vu',
		flag: '🇻🇺',
		timezones: ['Pacific/Efate']
	},
	{
		code: 've',
		flag: '🇻🇪',
		timezones: ['America/Caracas']
	},
	{
		code: 'vn',
		flag: '🇻🇳',
		timezones: ['Asia/Ho_Chi_Minh']
	},
	{
		code: 'vg',
		flag: '🇻🇬',
		timezones: ['America/Tortola']
	},
	{
		code: 'vi',
		flag: '🇻🇮',
		timezones: ['America/St_Thomas']
	},
	{
		code: 'wf',
		flag: '🇼🇫',
		timezones: ['Pacific/Wallis']
	},
	{
		code: 'eh',
		flag: '🇪🇭',
		timezones: ['Africa/El_Aaiun']
	},
	{
		code: 'ye',
		flag: '🇾🇪',
		timezones: ['Asia/Aden']
	},
	{
		code: 'zm',
		flag: '🇿🇲',
		timezones: ['Africa/Lusaka']
	},
	{
		code: 'zw',
		flag: '🇿🇼',
		timezones: ['Africa/Harare']
	},
	{
		code: 'ax',
		flag: '🇦🇽',
		timezones: ['Europe/Mariehamn']
	}
] as const;

export type Country = (typeof countryList)[number];
export type CountryCode = Country['code'];
export type CountryFlag = Country['flag'];
export type CountryTimezones = Country['timezones'];

export const countryCode = countryList.map((c) => c.code);

export function getCountry(code: CountryCode): Country {
	const country = countryList.find((c) => c.code === code);
	if (!country) {
		throw new Error(`Country with code ${code} not found`);
	}
	return country;
}

export function getCountryTimezones(code: CountryCode): readonly string[] {
	return getCountry(code).timezones;
}

export function getDefaultTimezone(code: CountryCode): string {
	return getCountryTimezones(code)[0];
}

export function renderLocalizedCountryName(
	countryCode: CountryCode,
	locale: LanguageCode | undefined
): string {
	const regionNames = new Intl.DisplayNames([locale || 'en'], { type: 'region' });
	const country = regionNames.of(countryCode.toUpperCase());
	if (country) {
		return country;
	} else {
		// Fallback to the country code if the name is not found
		return countryCode;
	}
}
