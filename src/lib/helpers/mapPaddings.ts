import type { PaddingOptions } from 'mapbox-gl';

/**
 * Use a generic full-width padding setup.
 */
export const getStandardPadding = (): PaddingOptions => {
	// get the current size of 1 rem
	const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
	
	const p = window.innerHeight < 8*rem || window.innerWidth < 8*rem ? 0 : 2*rem;

	return {
		top: p,
		bottom: p,
		left: p,
		right: p
	};
};

/**
 * Calculates the appropriate padding values for map navigation to correctly take into account visible elements in the view.
 */
export const getSidebarAwareMapPadding = (): PaddingOptions => {
	// get the current size of 1 rem
	const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

	let top = 0;
	let bottom = 0;

	// apply vertical breakpoints
	// - top: logo bar + search field
	// - bottom: add building icon
	if (window.innerHeight > 8*rem) {
		top = 2*rem;
		bottom = 2*rem;
	}
	if (window.innerHeight > 32*rem) {
		top = 16*rem;
		bottom = 8*rem;
	}
	if (window.innerHeight > 64*rem) {
		top = 16*rem;
		bottom = 16*rem;
	}

	let left = 0;
	let right = 0;

	// apply horizontal breakpoints
	// - left: sidebar
	if (window.innerWidth > 8*rem) {
		left = 2*rem;
		right = 2*rem;
	}
	if (window.innerWidth > 16*rem) {
		left = 4*rem;
		right = 4*rem;
	}
	if (window.innerWidth > 48*rem) {
		left = 36*rem;
		right = 4*rem;
	}

	return { top, bottom, left, right };
};
