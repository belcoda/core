export const load = async (event) => {
	event.setHeaders({
		'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
	});
	return {};
};
