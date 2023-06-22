<script lang="ts">
    import { getContext } from 'svelte';
    import { ModalContext, Modal, SectionalForm, Input, NumberInput, Button, Select, SelectList, SelectListItem, type MapContext } from '$lib/components';
	import { LngLat, Marker } from 'mapbox-gl';
	import type { Building } from '@prisma/client';
    import { fetchBuildings, selectBuilding } from '$lib/stores';
	import { SEISMIC_ZONES, getStandardPadding, sleep } from '$lib/helpers';

    export let editBuilding: Building | null = null;
    $: editing = editBuilding != null;

    const mapContext = getContext<MapContext>('map');
    const { map } = mapContext;

    let modalContext: ModalContext;

    let building: Partial<Building> = {};

    $: if (editBuilding && editBuilding.id !== building.id) building = structuredClone(editBuilding);

    const markerEl = document.createElement('div');
    markerEl.className = 'new-building-marker';
    markerEl.title = 'New Building Location';
    let marker = new Marker(markerEl);
    let markerActive = false;

    const setBuildingLocation = (loc: { lat: number, lng: number }) => {
        building.lat = loc.lat;
        building.lng = loc.lng;
        marker.setLngLat(loc);
        if (!markerActive) {
            marker.addTo($map);
            markerActive = true;
        }
    }

    const unsetBuildingLocation = () => {
        building.lat = 0;
        building.lng = 0;
        if (markerActive) {
            marker.remove();
            markerActive = false;
        }
    }

    let gpsLoading = false;

    const useCurrentPosition = () => {
        gpsLoading = true;

        const currentLat = building.lat;
        const currentLng = building.lng;

        navigator.geolocation.getCurrentPosition(async (position) => {
            gpsLoading = false;
            // prompt location with the current GPS location as the starting point
            setBuildingLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });

            // revert to old value if prompt was not accepted
            if (!(await promptLocation())) {
                if (currentLat && currentLng) setBuildingLocation({ lat: currentLat, lng: currentLng });
                else unsetBuildingLocation();
            }
        }, () => {
            gpsLoading = false;
            alert('Failed to retrieve current location.');
        });
    }

    const promptLocation = async () => {
        modalContext.modal.close();
        await sleep(250);

        const currentLocation = building.lat && building.lng ? new LngLat(building.lng, building.lat) : undefined;

        const location = await mapContext.promptLocation(currentLocation);
        if (location) setBuildingLocation(location);

        modalContext.modal.open();
        return location;
    }

    const resetForm = () => {
        unsetBuildingLocation();
        building = editBuilding ? structuredClone(editBuilding) : {};
    }

    let saving = false;
    let error = '';

    const createBuildingRecord = async () => {
        if (saving) return;
        saving = true;

        const url = editBuilding ? `/buildings/${editBuilding.id}` : '/buildings/new';

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(building),
        });

        const data = await response.json();

        if (response.ok) {
            const center = { lat: building.lat as number, lng: building.lng as number };

            resetForm();
            modalContext.modal.close();
            if (editing) {
                selectBuilding(editBuilding, true);
            } else {
                $map.flyTo({ center, zoom: 19, pitch: 45, padding: getStandardPadding() })
                fetchBuildings();
            }
        } else {
            error = data.message || 'Failed to create building record.';
        }

        saving = false;
    }
</script>

<ModalContext bind:this={modalContext} let:modal on:close={() => { if (editing) resetForm(); }}>
    <slot {modal}></slot>

    <Modal context={modal}>
        <SectionalForm onSubmit={createBuildingRecord} editMode={editing}>
            <section>
                <aside></aside>
                <main><h2>
                    {#if editing}
                        Edit Building Record
                    {:else}
                        Submit Building Record
                    {/if}
                </h2></main>
            </section>
            <section>
                <aside><h3>Basic Details</h3></aside>
                <main>
                    <Input label="Building Name" bind:value={building.name} placeholder="Building Name" required disabled={editing || saving} />
                    <div class="control-group">
                        <Input label="Full Address" bind:value={building.address} placeholder="Street, Barangay, City/Municipality" required disabled={editing || saving} />
                        <div style="flex-basis: 10rem;">
                            <Input label="Zip Code" bind:value={building.zipCode} placeholder="0000" disabled={saving} />
                        </div>
                    </div>
                    <div class="control-group">
                        <Input label="Contact Person" bind:value={building.contactName} placeholder="Contact Person" required disabled={editing || saving} />
                        <Input label="Contact Phone" bind:value={building.contactPhone} placeholder="+63 9XX XXX XXXX" required disabled={editing || saving} />
                    </div>
                </main>
            </section>
            <section>
                <aside><h3>Building Location</h3></aside>
                <main>
                    <div class="control-group">
                        <NumberInput label="Latitude" bind:value={building.lat} step="0.000000000001" disabled />
                        <NumberInput label="Longitude" bind:value={building.lng} step="0.000000000001" disabled />
                        {#if !editing}
                            <Button onClick={useCurrentPosition} disabled={gpsLoading}>
                                {gpsLoading ? 'Please wait...' : 'Use Current Location'}
                            </Button>
                        {/if}
                    </div>
                    {#if !editing}
                        <!-- svelte-ignore a11y-invalid-attribute -->
                        <a class="link" style="margin-top: -0.5rem;" href="javascript:void(0)" on:click={promptLocation}>Set location manually</a>
                    {/if}
                </main>
            </section>
            <section>
                <aside><h3>Seismic Zone & Soil Type</h3></aside>
                <main>
                    <SelectList label="Seismic Zone" bind:value={building.seismicZone} required disabled={editing || saving}>
                        {#each Object.entries(SEISMIC_ZONES) as [id, zone]}
                            <SelectListItem value={id} title={zone.name}>
                                <div slot="image">{@html zone.icon}</div>
                                {zone.description}
                            </SelectListItem>
                        {/each}
                    </SelectList>
                    <hr />
                    <div class="control-group">
                        <NumberInput label="Distance from Fault Line (km)" placeholder="0.00" step="0.001" bind:value={building.distanceFromFaultLine} disabled={saving} />
                        <div style="width: 100%;">
                            <Select label="Soil Type" bind:value={building.soilType} disabled={saving}>
                                <option value="SA">SA (Hard rock)</option>
                                <option value="SB">SB (Rock)</option>
                                <option value="SC">SC (Very dense soil and soft rock)</option>
                                <option value="SD">SD (Stiff soil profile)</option>
                                <option value="SE">SE (Soft soil profile)</option>
                                <option value="SF">SF (Soil requiring site-specific evaluation)</option>
                            </Select>
                            <p class="field-note">If soil type is unknown, select SD.</p>
                        </div>
                    </div>
                </main>
            </section>
            <section>
                <aside></aside>
                <main>
                    {#if error}
                        <div class="error">{error}</div>
                    {/if}
                    {#if editing}
                        <div class="button-group space-between">
                            <Button secondary disabled={saving} onClick={modal.close}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving}>
                                Save Changes
                            </Button>
                        </div>
                    {:else}
                        <Button type="submit" disabled={saving}>
                            Submit Building Record
                        </Button>
                    {/if}
                </main>
            </section>
        </SectionalForm>
    </Modal>
</ModalContext>

<style>
    :global(.new-building-marker) {
        width: 0.5rem;
        height: 0.5rem;
        border: 2px solid rgb(255 255 255 / 50%);
        border-radius: 50%;
        box-shadow: 0 3px 5px rgb(0 0 0 / 50%);
        cursor: default;
    }

    .error {
        color: var(--theme-error);
        font-weight: 700;
    }
</style>
