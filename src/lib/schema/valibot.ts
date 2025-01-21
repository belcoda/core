import * as v from 'valibot';

import {
	SUPPORTED_LANGUAGES,
	SUPPORTED_COUNTRIES,
	DEFAULT_COUNTRY,
	DEFAULT_LANGUAGE
} from '$lib/i18n';

import * as m from '$lib/paraglide/messages';

export const SHORT_STRING_MAX_LENGTH = 100;
export const MEDIUM_STRING_MAX_LENGTH = 1000;
export const LONG_STRING_MAX_LENGTH = 100000;
export const SLUG_REGEXP = new RegExp('^[a-z0-9_]+(?:-[a-z0-9]+)*$');

export const shortString = v.pipe(
	v.string(),
	v.minLength(0),
	v.maxLength(
		SHORT_STRING_MAX_LENGTH,
		m.proud_house_thrush_shine({ maxLength: SHORT_STRING_MAX_LENGTH })
	)
);
export const shortStringNotEmpty = v.pipe(
	v.string(),
	v.minLength(1, m.slimy_sleek_goldfish_hope()),
	v.maxLength(
		SHORT_STRING_MAX_LENGTH,
		m.proud_house_thrush_shine({ maxLength: SHORT_STRING_MAX_LENGTH })
	)
);
export const mediumString = v.pipe(
	v.string(),
	v.minLength(0),
	v.maxLength(
		MEDIUM_STRING_MAX_LENGTH,
		m.proud_house_thrush_shine({ maxLength: MEDIUM_STRING_MAX_LENGTH })
	)
);
export const mediumStringNotEmpty = v.pipe(
	v.string(),
	v.minLength(1, m.slimy_sleek_goldfish_hope()),
	v.maxLength(
		MEDIUM_STRING_MAX_LENGTH,
		m.proud_house_thrush_shine({ maxLength: MEDIUM_STRING_MAX_LENGTH })
	)
);
export const longString = v.pipe(
	v.string(),
	v.minLength(0),
	v.maxLength(
		LONG_STRING_MAX_LENGTH,
		m.proud_house_thrush_shine({ maxLength: LONG_STRING_MAX_LENGTH })
	)
);
export const longStringNotEmpty = v.pipe(
	v.string(),
	v.minLength(1, m.slimy_sleek_goldfish_hope()),
	v.maxLength(
		LONG_STRING_MAX_LENGTH,
		m.proud_house_thrush_shine({ maxLength: LONG_STRING_MAX_LENGTH })
	)
);
export const integer = v.pipe(v.number(), v.integer(m.salty_mad_polecat_pray()));
export const id = v.pipe(v.number(), v.integer(m.salty_mad_polecat_pray()), v.minValue(1));
export const count = v.pipe(v.number(), v.integer(m.salty_mad_polecat_pray()), v.minValue(0));
export const timestamp = v.union([
	v.optional(v.date(), new Date()),
	v.pipe(
		v.string(),
		v.isoTimestamp(m.bad_actual_mouse_bless()),
		v.transform((input) => new Date(input))
	)
]);
export const date = v.union([
	v.pipe(
		v.union([
			v.pipe(
				v.string(),
				v.isoTimestamp(m.bad_actual_mouse_bless()),
				v.transform((input) => new Date(input)),
				v.date()
			),
			v.date()
		])
	)
]);
export type DateType = v.InferOutput<typeof date>;
export const isoTimestamp = v.pipe(v.string(), v.isoTimestamp(m.bad_actual_mouse_bless()));
export const language = v.picklist(
	SUPPORTED_LANGUAGES,
	m.super_tired_giraffe_clasp({ supportedLanguages: SUPPORTED_LANGUAGES.join(', ') })
);
export const country = v.picklist(
	SUPPORTED_COUNTRIES,
	m.teal_cozy_ox_nudge({ supportedCountries: SUPPORTED_COUNTRIES.join(', ') })
);
export type Country = v.InferOutput<typeof country>;
export const slug = v.pipe(
	v.string(),
	v.minLength(1, m.slimy_sleek_goldfish_hope()),
	v.maxLength(
		SHORT_STRING_MAX_LENGTH,
		m.proud_house_thrush_shine({ maxLength: SHORT_STRING_MAX_LENGTH })
	),
	v.regex(SLUG_REGEXP, m.deft_legal_platypus_zap())
);
//taken from https://github.com/fabian-hiller/valibot/pull/907/commits/27efeef44cd8f1e7e7ee37ea65e4d8c3836ab2fd
export const domainName = v.pipe(
	v.string(),
	v.regex(/^(?!-)([a-z0-9-]{1,63}(?<!-)\.)+[a-z]{2,6}$/iu, m.legal_antsy_alpaca_drip())
);

export const email = v.pipe(v.string(), v.email(m.actual_early_anteater_endure()));
export const url = v.pipe(
	v.string(),
	v.maxLength(
		LONG_STRING_MAX_LENGTH,
		m.proud_house_thrush_shine({ maxLength: LONG_STRING_MAX_LENGTH })
	)
); //currently JSON schema library doesn't support URL verification
export const uuid = v.pipe(v.string(), v.uuid(m.suave_weird_meerkat_imagine()));

export const address = v.object({
	address_line_1: v.nullable(
		v.pipe(
			v.string(),
			v.maxLength(
				SHORT_STRING_MAX_LENGTH,
				m.proud_house_thrush_shine({ maxLength: SHORT_STRING_MAX_LENGTH })
			)
		)
	),
	address_line_2: v.nullable(
		v.pipe(
			v.string(),
			v.maxLength(
				SHORT_STRING_MAX_LENGTH,
				m.proud_house_thrush_shine({ maxLength: SHORT_STRING_MAX_LENGTH })
			)
		)
	),
	address_line_3: v.nullable(
		v.pipe(
			v.string(),
			v.maxLength(
				SHORT_STRING_MAX_LENGTH,
				m.proud_house_thrush_shine({ maxLength: SHORT_STRING_MAX_LENGTH })
			)
		)
	),
	address_line_4: v.nullable(
		v.pipe(
			v.string(),
			v.maxLength(
				SHORT_STRING_MAX_LENGTH,
				m.proud_house_thrush_shine({ maxLength: SHORT_STRING_MAX_LENGTH })
			)
		)
	),
	locality: v.nullable(
		v.pipe(
			v.string(),
			v.maxLength(
				SHORT_STRING_MAX_LENGTH,
				m.proud_house_thrush_shine({ maxLength: SHORT_STRING_MAX_LENGTH })
			)
		)
	),
	state: v.nullable(
		v.pipe(
			v.string(),
			v.maxLength(
				SHORT_STRING_MAX_LENGTH,
				m.proud_house_thrush_shine({ maxLength: SHORT_STRING_MAX_LENGTH })
			)
		)
	),
	postcode: v.nullable(
		v.pipe(
			v.string(),
			v.maxLength(
				SHORT_STRING_MAX_LENGTH,
				m.proud_house_thrush_shine({ maxLength: SHORT_STRING_MAX_LENGTH })
			)
		)
	),
	latlng: v.nullable(
		v.tuple(
			[
				v.pipe(v.number(), v.maxValue(180), v.minValue(-180)),
				v.pipe(v.number(), v.maxValue(180), v.minValue(-180))
			],
			m.spare_great_cowfish_jolt()
		)
	),
	country: country
});
export type Address = v.InferOutput<typeof address>;

export const customCode = v.object({
	custom_html_head: v.optional(v.nullable(longString), null),
	custom_html_body: v.optional(v.nullable(longString), null),
	custom_css: v.optional(v.nullable(longString), null),
	custom_js: v.optional(v.nullable(longString), null)
});
export const DEFAULT_CUSTOM_CODE: CustomCode = {
	custom_html_head: null,
	custom_html_body: null,
	custom_css: null,
	custom_js: null
};
export type CustomCode = v.InferOutput<typeof customCode>;

export const emailMessage = v.object({
	from: shortStringNotEmpty,
	reply_to: v.optional(v.nullable(email), null),
	subject: mediumString,
	text: longString,
	html: longString,
	useHtmlAsText: v.optional(v.boolean(), true)
});
export type EmailMessage = v.InferOutput<typeof emailMessage>;

export const htmlMetatags = v.object({
	isManuallySet: v.optional(v.boolean(), false),
	title: v.optional(v.nullable(mediumString), null),
	description: v.optional(v.nullable(mediumString), null),
	subject: v.optional(v.nullable(mediumString), null),
	keywords: v.optional(v.nullable(mediumString), null),
	openGraph: v.object({
		title: v.optional(v.nullable(mediumString), null),
		description: v.optional(v.nullable(mediumString), null),
		image: v.optional(v.nullable(url), null),
		image_alt: v.optional(v.nullable(mediumString), null)
	}),
	twitter: v.object({
		title: v.optional(v.nullable(mediumString), null),
		description: v.optional(v.nullable(mediumString), null),
		card: v.optional(
			v.nullable(
				v.picklist(
					['summary', 'summary_large_image', 'app', 'player'],
					m.extra_large_marlin_dream({ cardList: 'summary, summary_large_image, app, player' })
				)
			),
			'summary'
		),
		image: v.optional(v.nullable(url), null),
		image_alt: v.optional(v.nullable(mediumString), null)
	})
});
export type HtmlMetatags = v.InferOutput<typeof htmlMetatags>;
export const DEFAULT_HTML_METATAGS: HtmlMetatags = {
	isManuallySet: false,
	title: null,
	description: null,
	subject: null,
	keywords: null,
	openGraph: {
		title: null,
		description: null,
		image: null,
		image_alt: null
	},
	twitter: {
		title: null,
		description: null,
		card: 'summary',
		image: null,
		image_alt: null
	}
};

export const phoneNumber = v.pipe(
	v.string(),
	v.maxLength(100),
	v.regex(/^[\+\(\s.\-\/\d\)]{5,30}$/, m.dark_small_deer_win())
);

export { DEFAULT_COUNTRY, DEFAULT_LANGUAGE };

export const parse = v.parse;
export const safeParse = v.safeParse;
export const parseAsync = v.parseAsync;
export const safeParseAsync = v.safeParseAsync;

export function renderValiError(err: unknown):
	| {
			isValiError: true;
			issues: string[];
			message: string;
			name: string;
			errorMessage: string;
			stack: string | undefined;
	  }
	| { isValiError: false } {
	if (v.isValiError(err)) {
		let issuesMap: string[] = [];
		let messageArr: string[] = [];
		err.issues.forEach((issue) => {
			const dotPath = issue.path?.map((item) => item.key).join('.');
			const paths =
				issue.path?.map((p) => {
					return `type: ${p.type} - origin: ${JSON.stringify(p.origin)} - input: ${'JSON.stringify(p.input)'} - path: ${dotPath} -  value: ${p.value}`;
				}) ?? [];

			issuesMap.push(
				`[${issue.kind.toUpperCase()} at ${issue.type.toUpperCase()}: (${issue.input})] Expected ${issue.expected}; received ${issue.received}: ${issue.message} [${paths.join(' __')}]`
			);
			messageArr.push(issue.message);
		});
		return {
			isValiError: true,
			issues: issuesMap,
			message: messageArr.join('; '),
			errorMessage: err.message,
			name: err.name,
			stack: err.stack
		};
	} else {
		return { isValiError: false };
	}
}

export const templateGlobals = v.object({
	url: url,
	encoded_url: mediumString
});
export type TemplateGlobals = v.InferOutput<typeof templateGlobals>;

export { v };
