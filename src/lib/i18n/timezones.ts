export function isValidIANATimezone(timezone: string): boolean {
	try {
		// Using Intl.DateTimeFormat to validate the timezone
		Intl.DateTimeFormat(undefined, { timeZone: timezone });
		return true;
	} catch (error) {
		return false;
	}
}
