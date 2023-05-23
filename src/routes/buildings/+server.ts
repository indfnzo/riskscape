import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server';

export async function GET() {
    try {
        const buildings = await prisma.building.findMany();
        return new Response(JSON.stringify(buildings), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch {
        throw error(400, 'beep boop');
    } finally {
        await prisma.$disconnect();
    }
}
