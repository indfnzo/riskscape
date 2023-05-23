import { writable } from 'svelte/store';
import type { Building } from '@prisma/client';

export const buildings = writable<Building[]>([]);

export const fetchBuildings = async () => {
    const response = await fetch('/buildings');
    if (!response.ok) return;

    const data = await response.json();
    buildings.set(data || []);
}
