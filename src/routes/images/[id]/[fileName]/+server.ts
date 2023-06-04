import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server';

export async function GET({ params }) {
    const id = parseInt(params.id);
    if (isNaN(id)) throw error(404);

    const img = await prisma.image.findFirst({
        where: { id, fileName: params.fileName }
    });
    if (!img) throw error(404);

    return new Response(img.data, {
        headers: {
            'Content-Type': img.mimeType
        }
    });
}
