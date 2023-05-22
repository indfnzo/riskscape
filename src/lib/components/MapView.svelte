<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl, { Map } from 'mapbox-gl';

	export let fullscreen = false;

	let container: HTMLElement;
	let map: Map;

	onMount(() => {
		mapboxgl.accessToken = 'pk.eyJ1IjoiamVtaHVudHIiLCJhIjoiY2pna2lsanZoMDNyazJxcGhmY2VmdXMxYyJ9.jxMc5d4I-5Zevyny5tujaw';
		map = new Map({
			container,
			style: 'mapbox://styles/jemhuntr/clhwms7i800ph01pzfjkfdrh6',
		});
	});
</script>

<div bind:this={container} class="map-view" class:fullscreen></div>

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
