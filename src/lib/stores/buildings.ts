import { writable } from 'svelte/store';
import type { Building } from '@prisma/client';

export const buildings = writable<Building[]>([]);
