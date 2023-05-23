<script lang="ts" context="module">
	import type { Writable } from 'svelte/store';
	import type { LngLat } from 'mapbox-gl';
	export type MapContext = {
		map: Writable<Map>;
		promptLocation: (currentLocation?: LngLat) => Promise<LngLat | void>;
	};
</script>

<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import mapboxgl, { Map, Marker, Popup } from 'mapbox-gl';
	import { writable } from 'svelte/store';
	import { buildings } from '$lib/stores';

	export let fullscreen = false;

	let container: HTMLElement;
	let map = writable<Map>();
	let buildingMarkers: { id: number, marker: Marker, popup: Popup }[] = [];

	// set up map view
	onMount(() => {
		// init map
		mapboxgl.accessToken = 'pk.eyJ1IjoiamVtaHVudHIiLCJhIjoiY2pna2lsanZoMDNyazJxcGhmY2VmdXMxYyJ9.jxMc5d4I-5Zevyny5tujaw';
		$map = new Map({
			container,
			style: 'mapbox://styles/jemhuntr/clhwms7i800ph01pzfjkfdrh6',
			attributionControl: false,
		});

		// add all building markers & popups
		for (const bldg of $buildings) {
			const popup = new Popup({ offset: 16, className: 'building-popup' }).setHTML(`
				<div class="content">
					<div class="name">${bldg.name}</div>
					<div class="address">${bldg.address}</div>
				</div>
				<div class="meta">
					<strong class="zone zone-${bldg.seismicZone}">Zone ${bldg.seismicZone}</strong>
					(${bldg.distanceFromFaultLine}km)
				</div>
			`);

			const el = document.createElement('div');
			el.className = 'building-marker zone-' + bldg.seismicZone;
			el.title = bldg.name;
			const center = { lat: bldg.lat, lng: bldg.lng };
			const marker = new Marker(el).setLngLat(center).setPopup(popup).addTo($map);

			buildingMarkers.push({ id: bldg.id, marker, popup });
		}
	});

	// hide everything and prompt for a manual location selection
	let promptMode = false;
	let promptLastView: {
		center: LngLat,
		zoom: number,
		pitch: number
	};
	let resolvePrompt: (value: LngLat | void) => void;
	const promptLocation = (currentLocation?: LngLat) => {
		promptMode = true;

		promptLastView = {
			center: $map.getCenter(),
			zoom: $map.getZoom(),
			pitch: $map.getPitch()
		};

		const center = currentLocation || $map.getCenter();
		const zoom = currentLocation ? 18 : 16;
		const pitch = 0;

		$map.flyTo({ center, zoom, pitch });

		return new Promise<LngLat | void>(resolve => {
			resolvePrompt = resolve;
		});
	}

	const cancelPrompt = () => {
		promptMode = false;
		$map.flyTo(promptLastView);
		resolvePrompt();
	}

	const acceptLocation = () => {
		promptMode = false;
		$map.flyTo({ center: $map.getCenter(), zoom: 17, pitch: 45 });
		resolvePrompt($map.getCenter());
	}

	export const mapContext: MapContext = {
		map,
		promptLocation
	};

	setContext('map', mapContext);
</script>

<div bind:this={container} class="map-view" class:fullscreen></div>

<div class="map-elements" class:hide={promptMode}><slot></slot></div>

<div class="map-prompt-controls" class:hide={!promptMode}>
	<div class="prompt-crosshair"></div>
	<button class="prompt-button cancel" on:click={cancelPrompt} title="Cancel Prompt">
		<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6.34326 6.34314L17.657 17.6568" stroke="currentColor" stroke-linecap="square"/>
			<path d="M17.6567 6.34314L6.34303 17.6568" stroke="currentColor" stroke-linecap="square"/>
		</svg>
	</button>
	<button class="prompt-button accept" on:click={acceptLocation} title="Use Location">
		<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M19.3136 6.34322L9.65682 17.6569L4.5 13.5" stroke="currentColor" stroke-linecap="square"/>
		</svg>
	</button>
</div>

<style>
	.map-view {
		width: 100%;
		height: 100%;
	}

	.map-view.fullscreen {
		position: fixed;
		left: 0;
		top: 0;
		z-index: -1;
	}

	/* custom building markers */

	:global(.building-marker) {
		width: 0.5rem;
		height: 0.5rem;
		border: 2px solid rgb(255 255 255 / 50%);
		background: black;
		border-radius: 50%;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 25%) inset, 0 3px 5px rgb(0 0 0 / 50%);
		cursor: pointer;
	}

	:global(.building-marker.zone-2) {
		background: var(--theme-seismic-zone-2);
	}

	:global(.building-marker.zone-4) {
		background: var(--theme-seismic-zone-4);
	}

	/* building popups */

	:global(.building-popup) {
		font-family: 'Manrope', sans-serif;
		font-size: 1rem;
	}

	:global(.building-popup .mapboxgl-popup-content) {
		padding: 0;
		border-radius: 0.33rem;
		overflow: hidden;
		box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 25%);
	}

	:global(.building-popup .content) {
		padding: 0.75rem 1rem;
	}

	:global(.building-popup .name) {
		margin: 0 0 0.5rem;
		font-weight: 600;
	}

	:global(.building-popup .address) {
		font-size: 0.8rem;
		color: #808080;
	}

	:global(.building-popup .meta) {
		padding: 0.75rem 1rem;
		background: #f7f7f7;
		border-top: 1px solid rgb(0 0 0 / 10%);
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-weight: 500;
		font-size: 0.9rem;
		color: #808080;
	}

	:global(.building-popup .zone) {
		font-weight: 700;
	}

	:global(.building-popup .zone.zone-2) {
		color: var(--theme-seismic-zone-2);
	}

	:global(.building-popup .zone.zone-4) {
		color: var(--theme-seismic-zone-4);
	}

	:global(.building-popup .mapboxgl-popup-close-button) {
		padding: 0;
		width: 2rem;
		height: 2rem;
		line-height: 2rem;
		font-size: 1.5rem;
		border-radius: 0;
		outline: none;
	}

	:global(.building-popup .mapboxgl-popup-tip) {
		border: 6px solid transparent;
		border-bottom: none;
	    border-top-color: #f7f7f7;
	}

	/* inner map elements */

	.map-elements {
		transition: all 250ms ease;
	}

	.map-elements.hide {
		opacity: 0;
		pointer-events: none;
	}

	/* controls for prompt mode */

	.map-prompt-controls {
		transition: all 250ms ease;
	}

	.map-prompt-controls.hide {
		opacity: 0;
		pointer-events: none;
	}
	
    .prompt-button {
        position: fixed;
        right: 2rem;
        bottom: 4rem;
        width: 4rem;
        height: 4rem;

        display: flex;
        align-items: center;
        justify-content: center;

        appearance: none;
		background: white;
        color: var(--theme-accent);
        border: none;
        border-radius: 5rem;
        cursor: pointer;
        transition: background 100ms ease;
    }

    .prompt-button:hover {
        background: #f7f7f7;
    }

	.prompt-button.cancel {
		right: 7rem;
	}

	.prompt-button.accept {
        background: var(--theme-accent);
		color: white;
	}

	.prompt-button.accept:hover {
		background: var(--theme-focus);
	}

    .icon {
        width: 2rem;
        height: 2rem;
    }

	.prompt-crosshair {
		position: fixed;
		left: 50%;
		top: 50%;
		width: 4px;
		height: 4px;
		background: white;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	.prompt-crosshair::before,
	.prompt-crosshair::after {
		content: "";
		position: absolute;
		top: calc(50% - 1px);
		left: -2rem;
		width: 1rem;
		height: 2px;
		background: rgb(255 255 255 / 25%);
		animation: crosshair-pulse-left 500ms infinite alternate;
	}

	.prompt-crosshair::after {
		left: auto;
		right: -2rem;
		animation: crosshair-pulse-right 500ms infinite alternate;
	}

	@keyframes crosshair-pulse-left {
		from { transform: translateX(0); }
		to { transform: translateX(-0.5rem); }
	}

	@keyframes crosshair-pulse-right {
		from { transform: translateX(0); }
		to { transform: translateX(0.5rem); }
	}
</style>
