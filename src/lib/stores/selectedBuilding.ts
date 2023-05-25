import { writable } from 'svelte/store';
import type { Building } from '@prisma/client';

export type SelectedBuilding = {
    loading: boolean;
    building: Building;
};

/**
 * Storage for currently selected building.
 */
export const selectedBuilding = writable<SelectedBuilding | null>(null);

/**
 * Activate a building and load its full data from the DB.
 */
export const selectBuilding = async (building: Building | null) => {
    if (building === null) {
        selectedBuilding.set(null);
        return;
    }

    selectedBuilding.set({
        loading: true,
        building,
    });

    const response = await fetch(`/buildings/${building.id}`);
    if (!response.ok) {
        selectedBuilding.set(null);
        return;
    }

    const full = await response.json();
    selectedBuilding.set({
        loading: false,
        building: full,
    });
}
