/**
 * Simple function debouncer.
 */
export const debounce = (fn: (...args: any[]) => void, timeout = 500) => {
	let timer: number | undefined;
	return (...args: any[]) => {
		clearTimeout(timer);
		timer = window.setTimeout(() => fn(args), timeout);
	};
};
