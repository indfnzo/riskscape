<script lang="ts" context="module">
	import type { Writable } from 'svelte/store';
	export type MapContext = {
		map: Writable<Map>;
	};
</script>

<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import mapboxgl, { Map } from 'mapbox-gl';
	import { writable } from 'svelte/store';

	export let fullscreen = false;

	let container: HTMLElement;
	let map = writable<Map>();

	onMount(() => {
		mapboxgl.accessToken = 'pk.eyJ1IjoiamVtaHVudHIiLCJhIjoiY2pna2lsanZoMDNyazJxcGhmY2VmdXMxYyJ9.jxMc5d4I-5Zevyny5tujaw';
		$map = new Map({
			container,
			style: 'mapbox://styles/jemhuntr/clhwms7i800ph01pzfjkfdrh6',
			attributionControl: false,
		});
	});

	export const mapContext: MapContext = {
		map,
	};

	setContext('map', mapContext);
</script>

<div bind:this={container} class="map-view" class:fullscreen></div>

<slot></slot>

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
</style>
