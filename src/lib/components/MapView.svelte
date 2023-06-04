<script lang="ts" context="module">
	import type { Writable } from 'svelte/store';
	import type { LngLat, PaddingOptions } from 'mapbox-gl';
	export type MapContext = {
		map: Writable<Map>;
		promptLocation: (currentLocation?: LngLat) => Promise<LngLat | void>;
	};
</script>

<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import mapboxgl, { Map, Marker, Popup } from 'mapbox-gl';
	import { writable } from 'svelte/store';
	import { buildings, buildingsSearchState, selectBuilding } from '$lib/stores';
	import type { Building } from '@prisma/client';
	import { getSidebarAwareMapPadding, getStandardPadding, isTouchDevice } from '$lib/helpers';

	export let fullscreen = false;

	let container: HTMLElement;
	let map = writable<Map>();
	let buildingMarkers: Record<number, { marker: Marker, popup: Popup }> = {};

	// rerender all building markers & popups
	const updateMarkers = (bldgs: Building[]) => {
		// remove all existing markers and truncate the registry
		for (const [id, entry] of Object.entries(buildingMarkers)) entry.marker.remove();
		buildingMarkers = {};

		// rerender markers & popups
		for (const bldg of bldgs) {
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

			const el = document.createElement('button');
			el.className = 'building-marker zone-' + bldg.seismicZone;
			el.title = bldg.name;

			const pinEl = document.createElement('div');
			pinEl.className = 'marker-pin';
			el.appendChild(pinEl);

			const center = { lat: bldg.lat, lng: bldg.lng };
			const marker = new Marker(el).setLngLat(center).setPopup(popup).addTo($map);

			// show popup on hover
			if (!isTouchDevice()) {
				el.addEventListener('mouseenter', () => popup.addTo($map));
				el.addEventListener('mouseleave', () => popup.remove());
			}

			// disable double click to zoom
			el.addEventListener('dblclick', (evt) => {
				evt.preventDefault();
				evt.stopPropagation();
			});

			// activate on click
			el.addEventListener('click', (evt) => {
				selectBuilding(bldg);
				evt.preventDefault();
			});

			buildingMarkers[bldg.id] = { marker, popup };
		}
	}

	// go through all markers & update hidden state based on search
	const updateBuildingSearchState = () => {
		const filteredBuildings = $buildingsSearchState.results;
		const filteredBuildingIds = filteredBuildings.map(bldg => bldg.building.id);

		// set marker hidden states
		for (const [id, entry] of Object.entries(buildingMarkers)) {
			const el = entry.marker.getElement();
			if ($buildingsSearchState.active && !filteredBuildingIds.includes(parseInt(id))) el.classList.add('hidden');
			else el.classList.remove('hidden');
		}

		// if singular result, fly to it on the map
		if (filteredBuildingIds.length === 1) {
			const center = {
				lat: filteredBuildings[0].building.lat,
				lng: filteredBuildings[0].building.lng,
			};
			$map.flyTo({
				center,
				pitch: 0,
				zoom: 16,
				padding: getSidebarAwareMapPadding()
			});
		}

		// if more than 1 result, fit map to all active markers
		if (filteredBuildingIds.length >= 2) {
			let minLng = Infinity, maxLng = 0, minLat = Infinity, maxLat = 0;

			for (const { building } of filteredBuildings) {
				if (building.lng < minLng) minLng = building.lng;
				if (building.lng > maxLng) maxLng = building.lng;
				if (building.lat < minLat) minLat = building.lat;
				if (building.lat > maxLat) maxLat = building.lat;
			}

			/**
			 * Note: We can't pass the padding options to `fitBounds` since it doesn't persist that value (or even use the global option)
			 * like `flyTo` does. So we set the padding globally first, then we use `fitBounds` to apply the view.
			 * See: https://github.com/mapbox/mapbox-gl-js/issues/12498
			 */
			$map.setPadding(getSidebarAwareMapPadding());
			$map.fitBounds([
				[maxLng, minLat],
				[minLng, maxLat]
			], {
				animate: true,
				pitch: 0,
			});
		}
	}

	// set up map view
	onMount(() => {
		// init map
		mapboxgl.accessToken = 'pk.eyJ1IjoiamVtaHVudHIiLCJhIjoiY2pna2lsanZoMDNyazJxcGhmY2VmdXMxYyJ9.jxMc5d4I-5Zevyny5tujaw';
		$map = new Map({
			container,
			style: 'mapbox://styles/jemhuntr/clhwms7i800ph01pzfjkfdrh6',
			attributionControl: false,
		});

		// render markers & rerender when buildings are re-fetched
		updateMarkers($buildings);
		buildings.subscribe(updateMarkers);
		buildingsSearchState.subscribe(updateBuildingSearchState);

		// set default padding & zoom to fit whole Quezon City by default
		$map.setPadding(getStandardPadding());
		$map.fitBounds([
			[121.134974, 14.588430],
			[120.988718, 14.778065]
		], {
			animate: false,
			pitch: 0,
			center: [121.04932076975197, 14.651491937004637]
		});
		$map.zoomIn({ animate: false });

		// disable satellite view
		$map.once('styledata', () => {
			$map.setLayoutProperty('mapbox-satellite', 'visibility', 'none');
		});
	});

	// hide everything and prompt for a manual location selection
	let promptMode = false;
	let promptLastView: {
		center: LngLat,
		zoom: number,
		pitch: number,
		padding: PaddingOptions,
	};
	let resolvePrompt: (value: LngLat | void) => void;
	const promptLocation = (currentLocation?: LngLat) => {
		promptMode = true;

		promptLastView = {
			center: $map.getCenter(),
			zoom: $map.getZoom(),
			pitch: $map.getPitch(),
			padding: $map.getPadding(),
		};

		const center = currentLocation || $map.getCenter();
		const zoom = currentLocation ? 18 : 16;
		const pitch = 0;

		$map.flyTo({ center, zoom, pitch, padding: getStandardPadding() });

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
		$map.flyTo({ center: $map.getCenter(), zoom: 17, pitch: 45, padding: getStandardPadding() });
		resolvePrompt($map.getCenter());
	}

	export const mapContext: MapContext = {
		map,
		promptLocation
	};

	setContext('map', mapContext);
</script>

<div bind:this={container} class="map-view" class:fullscreen></div>

<div class="map-elements" class:hide={promptMode}><slot map={map}></slot></div>

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
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		padding: 0;
		appearance: none;
		width: 3rem;
		height: 3rem;
		background: none;
		border: none;
		cursor: pointer;
	}

	:global(.building-marker .marker-pin) {
		width: 1rem;
		height: 1rem;
		border: 2px solid rgb(255 255 255 / 50%);
		background: black;
		border-radius: 50%;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 25%) inset, 0 3px 5px rgb(0 0 0 / 50%);
		
		transition-property: width, height, border, background, box-shadow;
		transition-duration: 100ms;
		transition-timing-function: ease-out;
	}

	:global(.building-marker.zone-2 .marker-pin) {
		background: var(--theme-seismic-zone-2);
	}

	:global(.building-marker.zone-4 .marker-pin) {
		background: var(--theme-seismic-zone-4);
	}

	:global(.building-marker.hidden) {
		pointer-events: none !important;
	}

	:global(.building-marker.hidden .marker-pin) {
		width: 0.25rem;
		height: 0.25rem;
		border: none;
		background: rgb(255 255 255 / 50%);
		box-shadow: none;
	}

	/* building popups */

	:global(.building-popup) {
		font-family: 'Manrope', sans-serif;
		font-size: 1rem;
		animation: popup-in 100ms ease-out forwards;
	}

	@keyframes popup-in {
		from {
			opacity: 0;
			top: 0.5rem;
		}

		to {
			opacity: 1;
			top: 0;
		}
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
		display: none;
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
