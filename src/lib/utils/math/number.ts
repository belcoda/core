export function isBigger(a: number, b: number): boolean {
	// Handle NaN cases
	if (isNaN(a) || isNaN(b)) return false;

	// Handle Infinity and -Infinity
	if (!isFinite(a) || !isFinite(b)) {
		return a > b;
	}

	// Handle normal comparisons
	return a > b;
}
