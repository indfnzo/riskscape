import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server';
import type { ImageData } from '$lib/stores';
import type { AssessmentLog, Building } from '@prisma/client';

export async function GET({ params }) {
    const id = parseInt(params.id);
    if (isNaN(id)) throw error(404);

    const building = await prisma.building.findUnique({
        where: { id },
        include: {
            assessmentLogs: {
                orderBy: [{ inspectionDate: 'desc' }],
                include: {
                    assessmentLogImages: {
                        include: {
                            image: true
                        }
                    }
                }
            }
        },
    });
    if (!building) throw error(404);

    // map output to include images inline & remove image buffer data
    type Output = (Building & {
        assessmentLogs: (AssessmentLog & {
            images: ImageData[];
        })[];
    });
    const output: Output = {
        ...building,
        assessmentLogs: building.assessmentLogs.map(log => {
            const { assessmentLogImages, ...rest } = log;
            return {
                ...rest,
                images: assessmentLogImages.map(img => {
                    return {
                        id: img.image.id,
                        fileName: img.image.fileName,
                        fileSize: img.image.fileSize,
                        mimeType: img.image.mimeType,
                        url: `/images/${img.image.id}/${img.image.fileName}`
                    } as ImageData;
                })
            };
        }),
    };

    return new Response(JSON.stringify(output), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export async function POST({ params, request }) {
    const id = parseInt(params.id);
    if (isNaN(id)) throw error(400, 'Invalid building ID.');

    const building = await prisma.building.findFirst({ where: { id } });
    if (!building) throw error(400, 'Building not found.');

    const data: Partial<Building> = await request.json();

    try {
        const building = await prisma.building.update({
            where: {
                id: id
            },
            data: {
                zipCode: data.zipCode,
                distanceFromFaultLine: data.distanceFromFaultLine,
                soilType: data.soilType
            }
        });
        return new Response(JSON.stringify(building), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch(err) {
        if (err instanceof Error) throw error(400, err.message);
        throw error(400, 'Failed to update building record.');
    }
}
