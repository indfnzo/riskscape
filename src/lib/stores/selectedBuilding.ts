import { get, writable } from 'svelte/store';
import type { AssessmentLog, Building } from '@prisma/client';
import type {
    BuildingConditions, BuildingDesignChangeType, BuildingDistressType, BuildingMaterial,
    BuildingStructuralType, BuildingDamageLevel, BuildingDamageIndicatorArea,
    BuildingSafetyEvaluationCondition, BuildingSafetyEvaluationSeverity, BuildingFinalPosting
} from '$lib/helpers';

export type SelectedBuilding = {
    loading: boolean;
    building: Building;
    vulnerabilityAssessmentLogs: VulnerabilityAssessmentLog[];
    damageAssessmentLogs: DamageAssessmentLog[];
};

export type InspectionScope = {
    exterior: 'Partial' | 'All Sides' | 'Aerial';
    interior: 'None' | 'Visible' | 'Entered';
    drawings: {
        structuralPlans: boolean;
        architecturalPlans: boolean;
        other: string;
    }
};

export type AssessmentLogData = {
    id: number,
    buildingId: number,
    type: string,

    inspectionDate: Date,
    inspectorName: string,
    inspectorAffiliation: string,
    inspectorDesignation: string,

    inspectionScope: InspectionScope,

    contactName: string,
    contactPhone: string,
    contactEmail: string,
};

export type VulnerabilityAssessmentLog = AssessmentLogData & {
    inspectionData: {
        general: {
            yearBuilt: number;
            storiesAboveGround: number;
            storiesBelowGround: number;
            approxAreaPerFloor: number;

            estimatedOccupants: string;
            occupancyCategory: string;
        };
        buildingType: {
            material: BuildingMaterial;
            structuralType: BuildingStructuralType;
            buildingTypeCode: string;
        };
        buildingHistory: {
            designChanges: { year: number, type: BuildingDesignChangeType, remarks: string }[];
            pastDistress: { year: number, type: BuildingDistressType, remarks: string }[];
        };
        presentBuildingCondition: {
            adjacency: {
                conditions: BuildingConditions['Adjacency'][];
                remarks: string;
            };
            exteriorFallingHazard: {
                conditions: BuildingConditions['ExteriorFallingHazard'][];
                remarks: string;
            };
            VerticalIrregularities: {
                conditions: BuildingConditions['VerticalIrregularities'][];
                remarks: string;
            };
            PlanIrregularities: {
                conditions: BuildingConditions['PlanIrregularities'][];
                remarks: string;
            };
            ColumnDamages: {
                conditions: BuildingConditions['ColumnDamages'][];
                remarks: string;
            };
            BeamDamages: {
                conditions: BuildingConditions['BeamDamages'][];
                remarks: string;
            };
        };
        overallPresentCondition: string;
        generalRemarks: string;
    };
};

export type DamageAssessmentLog = AssessmentLogData & {
    inspectionData: {
        buildingMaterial: BuildingMaterial;
        damageIndicators: Partial<Record<BuildingDamageIndicatorArea, string>>;
        damageLevel: BuildingDamageLevel;
        safetyEvaluation: Record<BuildingSafetyEvaluationCondition, BuildingSafetyEvaluationSeverity>;
        finalPosting: BuildingFinalPosting;
        recommendations: {
            barricadesRecommended: boolean;
            barricadesRemarks: string;

            detailedEvaluationsRecommended: {
                structural: boolean;
                geotechnical: boolean;
                other: string;
            }
        };
        generalRemarks: string;
    }
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

    if (building.id === get(selectedBuilding)?.building.id) {
        return;
    }

    selectedBuilding.set({
        loading: true,
        building,
        vulnerabilityAssessmentLogs: [],
        damageAssessmentLogs: [],
    });

    const response = await fetch(`/buildings/${building.id}`);
    if (!response.ok) {
        selectedBuilding.set(null);
        return;
    }

    const data = await response.json();
    selectedBuilding.set({
        loading: false,
        building: data,
        vulnerabilityAssessmentLogs: parseVulnerabilityAssessmentLogs(data.assessmentLogs),
        damageAssessmentLogs: parseDamageAssessmentLogs(data.assessmentLogs),
    });
}

const parseVulnerabilityAssessmentLogs = (logs: AssessmentLog[]): VulnerabilityAssessmentLog[] => {
    return logs
        .filter(log => log.type === 'pre')
        .map(log => JSON.parse(log.inspectionData));
}

const parseDamageAssessmentLogs = (logs: AssessmentLog[]): DamageAssessmentLog[] => {
    return logs
        .filter(log => log.type === 'post')
        .map(log => JSON.parse(log.inspectionData));
}
