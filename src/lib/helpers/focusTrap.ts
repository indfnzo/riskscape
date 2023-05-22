import { createFocusTrap } from 'focus-trap';
import type { Options } from 'focus-trap';

export type FocusTrapOptions = {
	enabled?: boolean;
	options?: Options
};

/**
 * Tiny wrapper for the comprehensive focus-trap library, designed for svelte's use directives.
 * See: https://github.com/focus-trap/focus-trap
 */
export const focusTrap = (node: HTMLElement, options?: FocusTrapOptions) => {
	const trap = createFocusTrap(node, options?.options || {});

	// auto-activate the focus trap on mount
	if (options?.enabled !== false) trap.activate();

	return {
		destroy: () => {
			if (options?.enabled !== false) trap.deactivate();
		}
	};
};
