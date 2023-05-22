<script lang="ts" context="module">
	import type { Writable } from 'svelte/store';

	export type ModalContext = {
		isOpen: Writable<boolean>;
		actionRequired: boolean;
		open: () => void;
		_opened: () => void;
		close: () => void;
		_closed: () => void;
		toggle: () => void;
	};
</script>

<script lang="ts">
	import { setContext, createEventDispatcher, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	/**
	 * Should this modal context be opened by default?
	 */
	export let open = false;

	/**
	 * Forcibly plays the intro animation even if the modal spawns as already-visible on first render.
	 * This is done by spoofing the isOpen state behind the scenes to be false on pre-mount.
	 */
	export let forceIntro = false;

	/**
	 * Should this modal disallow ambient close (by clicking outside the content or on Escape key)?
	 */
	export let actionRequired = false;

	// set up modal isOpen state based on several factors
	const defaultIsOpen = open && !forceIntro;
	const isOpen = writable(defaultIsOpen);

	if (open && forceIntro) {
		onMount(() => {
			$isOpen = true;
		});
	}

	const dispatch = createEventDispatcher<{ open: void; opened: void; close: void; closed: void }>();

	export const modal: ModalContext = {
		isOpen,
		actionRequired,
		open: () => {
			$isOpen = true;
			dispatch('open');
		},
		_opened: () => {
			dispatch('opened');
		},
		close: () => {
			$isOpen = false;
			dispatch('close');
		},
		_closed: () => {
			dispatch('closed');
		},
		toggle: () => {
			if ($isOpen) {
				$isOpen = true;
				dispatch('open');
			} else {
				$isOpen = false;
				dispatch('close');
			}
		}
	};

	setContext('modal', modal);
</script>

<slot {modal} />
