/**
 * Simple promisified setTimeout helper.
 */
export const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
