import { writable } from 'svelte/store';
import type { Building } from '@prisma/client';

export const buildings = writable<Building[]>([]);

/**
 * Update local copy of all buildings from the DB.
 */
export const fetchBuildings = async () => {
    const response = await fetch('/buildings');
    if (!response.ok) return;

    const data = await response.json();
    buildings.set(data || []);
}
