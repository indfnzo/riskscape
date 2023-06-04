import { get, writable } from 'svelte/store';
import type { AssessmentLog, Building } from '@prisma/client';
import type {
    BuildingDamageLevel, BuildingDamageIndicatorArea,
    BuildingSafetyEvaluationCondition, BuildingSafetyEvaluationSeverity, BuildingFinalPosting
} from '$lib/helpers';

export type SelectedBuilding = {
    loading: boolean;
    building: Building;
    images: ImageData[];
    vulnerabilityAssessmentLogs: VulnerabilityAssessmentLog[];
    damageAssessmentLogs: DamageAssessmentLog[];
};

export type InspectionScope = {
    exterior: 'Partial' | 'All Sides' | 'Aerial' | '';
    interior: 'None' | 'Visible' | 'Entered' | '';
    drawings: {
        structuralPlans: boolean;
        architecturalPlans: boolean;
        other: string;
    }
};

export const defaultInspectionScope: InspectionScope = {
    exterior: '',
    interior: '',
    drawings: {
        structuralPlans: false,
        architecturalPlans: false,
        other: ''
    }
};

export type ImageData = {
    id: number;
    fileName: string;
    mimeType: string;
    fileSize: number;
    url: string;
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

    formCompletionDuration: number,

    images: ImageData[], // receive
    imageIds: number[], // send
};

export type VulnerabilityAssessmentLogData = {
    general: {
        yearBuilt: number;
        storiesAboveGround: number;
        storiesBelowGround: number;
        approxAreaPerFloor: number;

        estimatedOccupants: string;
        occupancyCategory: string;
    };
    buildingType: {
        material: string;
        structuralType: string;
        buildingTypeCode: string;
    };
    buildingHistory: {
        designChanges: { year: number, type: string, remarks: string }[];
        pastDistress: { year: number, type: string, remarks: string }[];
    };
    presentBuildingCondition: {
        adjacency: {
            conditions: string[];
            remarks: string;
        };
        exteriorFallingHazard: {
            conditions: string[];
            remarks: string;
        };
        verticalIrregularities: {
            conditions: string[];
            remarks: string;
        };
        planIrregularities: {
            conditions: string[];
            remarks: string;
        };
        columnDamages: {
            conditions: string[];
            remarks: string;
        };
        beamDamages: {
            conditions: string[];
            remarks: string;
        };
    };
    overallPresentCondition: string;
    generalRemarks: string;
};

export const defaultVulnerabilityAssessmentLogData: VulnerabilityAssessmentLogData = {
    general: {
        yearBuilt: new Date().getFullYear(),
        storiesAboveGround: 0,
        storiesBelowGround: 0,
        approxAreaPerFloor: 0,

        estimatedOccupants: '',
        occupancyCategory: '',
    },
    buildingType: {
        material: '',
        structuralType: '',
        buildingTypeCode: '',
    },
    buildingHistory: {
        designChanges: [],
        pastDistress: [],
    },
    presentBuildingCondition: {
        adjacency: {
            conditions: [],
            remarks: '',
        },
        exteriorFallingHazard: {
            conditions: [],
            remarks: '',
        },
        verticalIrregularities: {
            conditions: [],
            remarks: '',
        },
        planIrregularities: {
            conditions: [],
            remarks: '',
        },
        columnDamages: {
            conditions: [],
            remarks: '',
        },
        beamDamages: {
            conditions: [],
            remarks: '',
        },
    },
    overallPresentCondition: '',
    generalRemarks: '',
};

export type VulnerabilityAssessmentLog = AssessmentLogData & { inspectionData: VulnerabilityAssessmentLogData };

export type DamageAssessmentLogData = {
    buildingMaterial: string;
    buildingStructuralType: string;
    damageIndicators: Partial<Record<BuildingDamageIndicatorArea, string>>;
    damageLevel: BuildingDamageLevel | '';
    safetyEvaluation: Record<BuildingSafetyEvaluationCondition | string, BuildingSafetyEvaluationSeverity | ''>;
    finalPosting: BuildingFinalPosting | '';
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
};

export const defaultDamageAssessmentLogData: DamageAssessmentLogData = {
    buildingMaterial: '',
    buildingStructuralType: '',
    damageIndicators: {},
    damageLevel: '',
    safetyEvaluation: {
        collapsed: '',
        leaning: '',
        racking_damage: '',
        falling_hazard: '',
        slope_movement_cracking: '',
    },
    finalPosting: '',
    recommendations: {
        barricadesRecommended: false,
        barricadesRemarks: '',
        detailedEvaluationsRecommended: {
            structural: false,
            geotechnical: false,
            other: '',
        },
    },
    generalRemarks: '',
};

export type DamageAssessmentLog = AssessmentLogData & { inspectionData: DamageAssessmentLogData };

/**
 * Storage for currently selected building.
 */
export const selectedBuilding = writable<SelectedBuilding | null>(null);

/**
 * Activate a building and load its full data from the DB.
 */
export const selectBuilding = async (building: Building | null, forceReload = false) => {
    if (building === null) {
        selectedBuilding.set(null);
        return;
    }

    if (!forceReload && building.id === get(selectedBuilding)?.building.id) {
        return;
    }

    selectedBuilding.set({
        loading: true,
        building,
        images: [],
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
        images: parseBuildingImages(data.assessmentLogs),
        vulnerabilityAssessmentLogs: parseVulnerabilityAssessmentLogs(data.assessmentLogs),
        damageAssessmentLogs: parseDamageAssessmentLogs(data.assessmentLogs),
    });
}

type AssessmentLogWithImages = AssessmentLog & { images: ImageData[] };

const parseVulnerabilityAssessmentLogs = (logs: AssessmentLogWithImages[]): VulnerabilityAssessmentLog[] => {
    return logs
        .filter(log => log.type === 'pre')
        .map(log => {
            const data: VulnerabilityAssessmentLog = {
                ...log,
                inspectionDate: new Date(log.inspectionDate),
                inspectionScope: JSON.parse(log.inspectionScope),
                inspectionData: JSON.parse(log.inspectionData),
                imageIds: log.images.map(img => img.id)
            };

            return data;
        });
}

const parseDamageAssessmentLogs = (logs: AssessmentLogWithImages[]): DamageAssessmentLog[] => {
    return logs
        .filter(log => log.type === 'post')
        .map(log => {
            const data: DamageAssessmentLog = {
                ...log,
                inspectionDate: new Date(log.inspectionDate),
                inspectionScope: JSON.parse(log.inspectionScope),
                inspectionData: JSON.parse(log.inspectionData),
                imageIds: log.images.map(img => img.id)
            };

            return data;
        });
}

const parseBuildingImages = (logs: AssessmentLogWithImages[]): ImageData[] => {
    let images: ImageData[] = [];
    for (const log of logs) images = [...images, ...log.images];
    return images;
}
