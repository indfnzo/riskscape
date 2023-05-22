export type PortalTarget = undefined | string | HTMLElement;

/**
 * Helper method for coercing nodes into a target location/portal.
 * Implemented for svelte's use: directive.
 * - Default usage (will coerce node as a child of body):
 *   <div use:portal />
 * - Target via selector:
 *   <div use:portal=".target-element" />
 * - Target specific referenced node:
 *   <div use:portal={ref} />
 */
export const portal = (node: HTMLElement, defaultTarget?: PortalTarget) => {
	let targetNode: HTMLElement | null = null;
	let portal: HTMLElement | null = null;

	const mount = (target: PortalTarget) => {
		if (target) {
			if (typeof target === 'string') targetNode = document.querySelector(target);
			else targetNode = target;
		}
		if (!targetNode) targetNode = document.body;

		portal = document.createElement('div');
		portal.className = 'portal-target';
		targetNode.appendChild(portal);
		portal.appendChild(node);
	};

	mount(defaultTarget);

	return {
		update: (target: PortalTarget) => {
			if (portal) targetNode?.removeChild(portal);
			mount(target);
		},
		destroy: () => {
			if (portal) targetNode?.removeChild(portal);
		}
	};
};
