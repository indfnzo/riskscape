import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server';

export async function GET({ params }) {
    const id = parseInt(params.id);
    if (isNaN(id)) throw error(404);

    const building = await prisma.building.findUnique({ where: { id } });
    if (!building) throw error(404);

    return new Response(JSON.stringify(building), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
