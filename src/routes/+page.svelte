<script lang="ts">
	import { MapView, LogoSection, BuildingsSection, ActionsSection } from "$lib/components";
</script>

<MapView fullscreen />
<LogoSection />
<BuildingsSection />
<ActionsSection />

<div class="map-overlay"></div>

<style>
    .map-overlay {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 12rem;
        background: linear-gradient(
            to top,
            rgb(26 26 26 / 75%),
            rgb(26 26 26 / 0%)
        );
        z-index: -1;
        pointer-events: none;
    }
</style>
