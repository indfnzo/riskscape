import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server';
import type { DamageAssessmentLog } from '$lib/stores/selectedBuilding.js';

export async function POST({ params, request }) {
    const id = parseInt(params.id);
    if (isNaN(id)) throw error(400, 'Invalid building ID.');

    const building = await prisma.building.findFirst({ where: { id } });
    if (!building) throw error(400, 'Building not found.');

    const data: Partial<DamageAssessmentLog> = await request.json();

    // validate generic assessment log data
    if (!data.inspectorName) throw error(400, 'Please specify inspector name.');
    if (!data.inspectorAffiliation || !data.inspectorDesignation) throw error(400, 'Please specify inspector affiliation and designation.');    
    if (!data.inspectionScope?.exterior || !data.inspectionScope?.interior) throw error(400, 'Please specify inspection scopes (exterior/interior extents of review).');
    if (!data.contactName || !data.contactPhone || !data.contactEmail) throw error(400, 'Please specify complete contact details.');

    // validate dmg. assessment log fields
    if (!data.inspectionData) throw error(400, 'Invalid inspection data.');
    const v = data.inspectionData;

    if (!v.buildingMaterial || !v.buildingStructuralType) throw error(400, 'Please specify building type.');
    if (!v.damageIndicators || !v.damageLevel) throw error(400, 'Please specify damage indicators & estimated level');
    if (!v.safetyEvaluation) throw error(400, 'Please specify safety evaluation options.');
    if (!v.finalPosting) throw error(400, 'Please indicate final posting.');


    try {
        const log = await prisma.assessmentLog.create({
            data: {
                buildingId: building.id,
                type: 'pre',

                inspectionDate: new Date(),
                inspectorName: data.inspectorName,
                inspectorAffiliation: data.inspectorAffiliation,
                inspectorDesignation: data.inspectorDesignation,

                inspectionScope: JSON.stringify(data.inspectionScope, null, 2),
                inspectionData: JSON.stringify(v, null, 2),

                contactName: data.contactName,
                contactPhone: data.contactPhone,
                contactEmail: data.contactEmail,

                formCompletionDuration: data.formCompletionDuration || 0,
            }
        });
        return new Response(JSON.stringify(log), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch(err) {
        if (err instanceof Error) throw error(400, err.message);
        throw error(400, 'Failed to submit damage assessment data.');
    }
}
