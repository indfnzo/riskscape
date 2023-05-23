<script lang="ts" context="module">
	import type { ModalContext } from './ModalContext.svelte';

	const globalFocusStack: ModalContext[] = [];

	const addToFocusStack = (ctx: ModalContext) => {
		globalFocusStack.push(ctx);
	};

	const removeFromFocusStack = (ctx: ModalContext) => {
		const index = globalFocusStack.indexOf(ctx);
		if (index >= 0) globalFocusStack.splice(index, 1);
	};
</script>

<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicIn, quintOut } from 'svelte/easing';
	import { getContext } from 'svelte';
	import { portal, focusTrap } from '$lib/helpers';
	import type { PortalTarget } from '$lib/helpers';

	/**
	 * Which element or target should the modal be rendered into?
	 * (optional, will default to document.body)
	 */
	export let target: PortalTarget = undefined;

	/**
	 * Should the modal content be absolutely positioned rather than fixed?
	 */
	export let absolute = false;

	/**
	 * Manually specify which ModalContext to link with.
	 */
	export let context: ModalContext | null = null;

	// resolve active context
	$: resolvedContext = context || getContext<ModalContext>('modal');
	$: ({ isOpen, actionRequired, _opened, close, _closed } = resolvedContext);

	$: {
		if ($isOpen) addToFocusStack(resolvedContext);
		else removeFromFocusStack(resolvedContext);
	}

	const ambientClose = () => {
		if (actionRequired) return;
		close();
	};

	// handle Esc to close modal
	const handleKeyup: svelte.JSX.KeyboardEventHandler<Window> = (evt) => {
		if (actionRequired || !$isOpen || evt.key !== 'Escape') return;

		const fs = globalFocusStack;
		const ctx = fs.length > 0 ? fs[fs.length - 1] : null;
		if (ctx) {
			ctx.close();
			evt.preventDefault();
			evt.stopImmediatePropagation();
		}
	};

	const handleIntroEnd = () => {
		_opened();
	};

	const handleOutroEnd = () => {
		close();
		_closed();
	};
</script>

<svelte:window on:keyup|capture={handleKeyup} />

{#if $isOpen}
	<!--
		NOTE: on:outroend ensures that the modal is detached from the DOM even if the modal root is unmounted before exit.
		To replicate with no on:outroend:
		- open a bunch of modals
		- use tab-navigation to move out of the current route
		- portal-targets still exist on body root
		For more info, see: https://github.com/sveltejs/svelte/issues/5268#issuecomment-835863002
	-->
	<div
		class="modal-root"
		class:fixed={!absolute}
		class:absolute
		on:mousedown|self={ambientClose}
		in:fade|local={{ duration: 250 }}
		out:fade|local={{ duration: 250, delay: 250 }}
		on:introend={handleIntroEnd}
		on:outroend={handleOutroEnd}
		use:portal={target}
		use:focusTrap
		tabindex="-1"
	>
		<button
			class="close-button"
			class:hidden={actionRequired}
			in:scale|local={{ duration: 500, easing: quintOut, delay: 250 }}
			out:scale|local={{ duration: 250, easing: cubicIn }}
			on:click={ambientClose}
		>
			<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M6.34326 6.34314L17.657 17.6568" stroke="currentColor" stroke-linecap="square"/>
				<path d="M17.6567 6.34314L6.34303 17.6568" stroke="currentColor" stroke-linecap="square"/>
			</svg>
		</button>
		<div class="frame-wrapper" in:fly|local={{ duration: 500, y: 20, easing: quintOut, delay: 250 }} out:fly|local={{ duration: 250, y: -20, easing: cubicIn }}>
			<div class="modal-frame {$$props.class || ''}">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.modal-root {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		min-height: 100vh;

		overflow: auto;
		background: rgb(0 0 0 / 50%);
	}

	.frame-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		position: relative;
		margin: 8rem auto 4rem;
		width: 64rem;
		max-width: calc(100% - 4rem);
		min-height: calc(100% - 12rem);
	}

	.modal-frame {
		width: 100%;
		background: white;
		color: black;
		overflow: hidden;
		border-radius: 0.5rem;
	}

	.close-button {
		position: fixed;
		top: 2rem;
		right: 2rem;
		padding: 1rem;
		background: rgb(0 0 0 / 80%);
		color: white;
		border: none;
		border-radius: 2rem;
		outline: none;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon {
		width: 2rem;
		height: 2rem;
	}
</style>
