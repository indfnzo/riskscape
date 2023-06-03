export const SEISMIC_ZONES: Record<string, { name: string, description: string, icon: string, color: string }> = {
	'2': {
		name: 'Zone 2',
		description: 'Low to moderate probability of damaging ground motion.',
		icon: `
			<svg class="icon seismic-zone" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M37.7846 55.2983C48.2451 52.7097 56 43.2605 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 43.1205 15.5634 52.4746 25.8267 55.1986L32 41L21 32L35 13.5L29 28L43 39L37.7846 55.2983Z" fill="#D4A52B"/>
			</svg>
		`,
		color: '#D4A52B',
	},
	'4': {
		name: 'Zone 4',
		description: 'High probability of damaging ground motion.',
		icon: `
			<svg class="icon seismic-zone" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M37.7846 55.2983C48.2451 52.7097 56 43.2605 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 43.1205 15.5634 52.4746 25.8267 55.1986L32 41L21 32L35 13.5L29 28L43 39L37.7846 55.2983Z" fill="#C53333"/>
			</svg>
		`,
		color: '#C53333',
	}
};

export const SOIL_TYPES: Record<string, string> = {
	'SA': 'SA (Hard rock)',
	'SB': 'SB (Rock)',
	'SC': 'SC (Very dense soil and soft rock)',
	'SD': 'SD (Stiff soil profile)',
	'SE': 'SE (Soft soil profile)',
	'SF': 'SF (Soil requiring site-specific evaluation)',
};

export const BUILDING_MATERIALS: Record<string, { name: string, structuralTypes: Record<string, string>}> = {
	'wood': {
		name: 'Wood',
		structuralTypes: {
			'W1': 'Wood, light frame',
			'W3': 'Bamboo',
			'N': 'Makeshift',
		}
	},
	'masonry': {
		name: 'Masonry',
		structuralTypes: {
			'MWS': 'Concrete hollow blocks with wood or light metal',
			'CHB': 'Concrete hollow blocks',
			'URA': 'Adobe',
			'URM': 'Unreinforced masonry bearing walls',
		}
	},
	'concrete': {
		name: 'Concrete',
		structuralTypes: {
			'CWS': 'Reinforced concrete moment frames with wood or light metal',
			'C1': 'Reinforced concrete moment frames',
			'C4': 'Concrete shear walls and frames',
			'PC2': 'Precast Frame',
		}
	},
	'steel': {
		name: 'Steel',
		structuralTypes: {
			'S1': 'Steel moment frame',
			'S3': 'Light metal frame',
			'S4': 'Steel frame with cast-in-place concrete shear walls',
		}
	},
};

export const BUILDING_DESIGN_CHANGE_TYPES = {
	'renovation': 'Renovation',
	'repair': 'Repair',
	'addition': 'Add\'l construction/Building additions',
};
export type BuildingDesignChangeType = keyof typeof BUILDING_DESIGN_CHANGE_TYPES;

export const BUILDING_DISTRESS_TYPES = {
	'fire': 'Fire',
	'flood': 'Flood',
	'blast': 'Blast',
	'earthquake': 'Earthquake',
	'typhoon': 'Typhoon',
	'subsidence': 'Subsidence',
};
export type BuildingDistressType = keyof typeof BUILDING_DISTRESS_TYPES;

export const BUILDING_CONDITION_FLAGS = {
	ADJACENCY: {
		'separation_gap': {
			description: 'The actual gap is less than the minimum separation gap.',
			note: 'According to FEMA P-154, in High seismicity regions, the minimum gap is 1.5 inches per story. On the other hand, in Moderate and Low seismicity regions, the minimum gap is 1/2 inch per story.',
			image: 'adjacency/Pounding-0.png'
		},
		'floor_separation': {
			description: 'Floors are separated vertically by more than two feet.',
			image: 'adjacency/Pounding-1.png'
		},
		'relative_elevation': {
			description: 'One building is two or more stories taller than the adjacent building.',
			image: 'adjacency/Pounding-2.png'
		},
		'row_adjacency': {
			description: 'The building is at the end of a row of three or more buildings.',
			image: 'adjacency/Pounding-3.png'
		},
	},

	EXTERIOR_FALLING_HAZARDS: {
		'unbraced_chimneys': 'Unbraced chimneys',
		'parapets': 'Parapets',
		'heavy_cladding': 'Heavy cladding/veneer',
		'appendages': 'Appendages'
	},

	VERTICAL_IRREGULARITIES: {
		'soft_story': {
			name: 'Soft Story',
			description: 'Stiffness of one story is less than 70% of that in the story above or less than 80% of the average stiffness of the 3 stories above.',
			image: 'vertical_irregularities/VI-0-Soft.png',
		},
		'vertical_geometric_irregularity': {
			name: 'Vertical Geometric Irregularity',
			description: 'The horizontal dimension of the lateral force resisting system in any story is more than 130% of that in an adjacent story. (Penthouses need not be considered)',
			image: 'vertical_irregularities/VI-1-VGI.png',
		},
		'weight_irregularity': {
			name: 'Weight Irregularity',
			description: 'Effective mass of any story is more that 150% of the effective mass of the adjacent story. (roof need not be considered)',
			image: 'vertical_irregularities/VI-2-WI.png',
		},
		'sloped_walls': {
			name: 'Sloped/Inclined Walls',
			description: 'Walls having an out of plane slope greater than 1 foot per 3 stories.',
			image: 'vertical_irregularities/VI-3-SIW.png',
		},
		'in_plane_discontinuity': {
			name: 'In-Plane Discontinuity in Vetrical Lateral Force-Resisting Element',
			description: 'An in-plane offset of the lateral-load-resisting elements greater than the length of those elements.',
			image: 'vertical_irregularities/VI-4-IPD.png',
		},
		'one_story_slope': {
			name: 'Uneven Column Heights',
			description: 'Slope across building rises at least one story (FEMA 154).',
			image: 'vertical_irregularities/VI-5-UCH-1.png',
		},
		'uneven_effective_heights': {
			name: 'Uneven Column Heights',
			description: 'Lateral load-carrying columns which have an effective height substantially less than the full story or columns of mixed heights.',
			image: 'vertical_irregularities/VI-5-UCH-2.png',
		},
		'split_level': {
			name: 'Split Level',
			description: 'When the floor levels have a vertical offset and are staggered.',
			image: 'vertical_irregularities/VI-6-SL.png',
		},
		// 'weak_story': {
		// 	name: 'Weak Story',
		// 	description: 'The story strength is <80% of that in the story above. The story strength is the total strength of all seismic-resisting elemets sharing the story for the direction under consideration.',
		// 	image: 'vertical_irregularities/VI-0-Soft.png',
		// }
	},

	PLAN_IRREGULARITIES: {
		'torsional_irregularity': {
			name: 'Torsional Irregularity',
			description: 'Maximum story drift (computed including accidental torsion) greater than 1.2 times the average story drifts of the two ends of the structure.',
			image: 'plan_irregularities/PI-0-TI.png',
		},
		'reentrant_corner_irregularity': {
			name: 'Re-entrant Corner Irregularity',
			description: 'Both projections of the structure beyond a re-entrant corner are greater than 15% of the plan dimension of the structure in the given direction.',
			image: 'plan_irregularities/PI-1-RCI.png',
		},
		'diaphragm_discontinuity': {
			name: 'Diaphragm Discontinuity',
			description: 'Cut-out or open areas greater than 50% of the gross enclosed area or deviation of 50%of the effective diaphragm stiffness from one story to the next.',
			image: 'plan_irregularities/PI-2-DD.png',
		},
		'out_of_plane_offsets_irregularity': {
			name: 'Out of Plane Offsets Irregularity ',
			description: 'Out-of-plane offsets of the vertical elements',
			image: 'plan_irregularities/PI-3-OOPOI.png',
		},
		'nonparallel_systems_irregularity': {
			name: 'Nonparallel Systems Irregularity',
			description: 'The vertical lateral-load-resisting elements are not parallel to or symmetric about the major orthogonal axes of the lateral force-resisting systems.',
			image: 'plan_irregularities/PI-4-NSI.png',
		},
		'torsion_based_on_building_shape': {
			name: 'Torsion based on Building Shape',
			description: 'Building has less than or greater than 90 deg corners.',
			image: 'plan_irregularities/PI-5-TBBS.png',
		},
	},

	COLUMN_DAMAGES: {
		'minimal': {
			name: 'No-Slight Damage',
			description: 'No damage/visibly narrow shear cracks (Crack width < 0.2mm)',
			image: 'column_damages/DC-0-NS.png',
		},
		'moderate': {
			name: 'Light-Moderate Damage',
			description: 'Wide cracks (0.2mm < Crack width < 2mm)"',
			image: 'column_damages/DC-1-LMD.png',
		},
		'heavy_spalling': {
			name: 'Heavy Damage-Collapse (Massive spalling)',
			description: 'Big cracks (Crack width > 2mm)',
			image: 'column_damages/DC-2-HDC.png',
		},
		'heavy_crush': {
			name: 'Heavy Damage-Collapse (Visible settlement of floor)',
			description: 'Big cracks (Crack width > 2mm)',
			image: 'column_damages/DC-3-HDC.png',
		},
	},

	BEAM_DAMAGES: {
		'minimal': {
			name: 'No-Slight Damage',
			description: '(Crack width < 0.2mm)',
			image: 'beam_damages/DB-0-NS.png',
		},
		'moderate': {
			name: 'Light-Moderate Damage',
			description: 'Visibly clear shear cracks (0.2mm < Crack width < 1mm)',
			image: 'beam_damages/DB-1-LM-0.png',
		},
		'moderate_local_crush': {
			name: 'Light-Moderate Damage (Local crush)',
			description: 'Wide or big shear cracks (1mm < Crack width < 5mm)',
			image: 'beam_damages/DB-1-LM-1.png',
		},
		'heavy_spalling': {
			name: 'Heavy Damage-Collapse (Extensive spalling)',
			description: 'Big shear cracks (Crack width > 5mm)',
			image: 'beam_damages/DB-2-HDC-0.png',
		},
		'heavy_crush': {
			name: 'Heavy Damage-Collapse (Crush)',
			description: 'Visible settlement and/or inclination of floor',
			image: 'beam_damages/DB-2-HDC-1.png',
		},
	},
};
export interface BuildingConditions {
	Adjacency: keyof (typeof BUILDING_CONDITION_FLAGS)['ADJACENCY'];
	ExteriorFallingHazard: keyof (typeof BUILDING_CONDITION_FLAGS)['EXTERIOR_FALLING_HAZARDS'];
	VerticalIrregularities: keyof (typeof BUILDING_CONDITION_FLAGS)['VERTICAL_IRREGULARITIES'];
	PlanIrregularities: keyof (typeof BUILDING_CONDITION_FLAGS)['PLAN_IRREGULARITIES'];
	ColumnDamages: keyof (typeof BUILDING_CONDITION_FLAGS)['COLUMN_DAMAGES'];
	BeamDamages: keyof (typeof BUILDING_CONDITION_FLAGS)['BEAM_DAMAGES'];
};


export const BUILDING_DAMAGE_INDICATORS = {
	'wood': {
		'entire_outside': {
			area: 'Entire outside',
			indicators: [
				'large permanent lateral displacement',
				'partial-total collapse and/or imminent danger of collapse due to cripple wall failue of lateral load resisting system',
			],
		},
		'soft_story_configurations': {
			area: 'Soft-story configurations',
			indicators: [
				'partial-total collapse'
			],
		},
		'masonry_chimneys': {
			area: 'Masonry chimneys',
			indicators: [
				'small-large cracks',
				'toppling',
			],
		},
		'masonry_veneers': {
			area: 'Masonry veneers',
			indicators: [
				'small cracks',
			],
		},
		'floors_roofs': {
			area: 'Floors and roof',
			indicators: [
				'permanent lateral movement',
			],
		},
		'shear_wall_panels': {
			area: 'Shear wall panels',
			indicators: [
				'small-large diagonal cracks in stucco and/or gypsum wall panels',
			],
		},
		'foundation': {
			area: 'Foundation',
			indicators: [
				'small-large cracks',
				'slippage of structure over foundation due to splitting of sill plates',
			],
		},
		'door_corners': {
			area: 'Door corners',
			indicators: [
				'small-large cracks',
			],
		},
		'window_openings': {
			area: 'Window openings',
			indicators: [
				'small-large cracks',
			],
		},
		'wall_ceiling_intersections': {
			area: 'Wall-ceiling intersections',
			indicators: [
				'small cracks',
			],
		},
		'plywood_joints': {
			area: 'Plywood joints',
			indicators: [
				'large diagonal cracks',
			],
		},
	},
	'masonry': {
		'entire_outside': {
			area: 'Entire outside',
			indicators: [
				'fall of small-large pieces of plaster, loose stones, masonry from walls/parapets',
				'movement of beams and/or trusses',
				'serious failure of walls (in-plane or out of plane)',
				'near, partial, or total collapse of structure',
			],
		},
		'chimneys': {
			area: 'Chimneys',
			indicators: [
				'partial-total collapse',
			],
		},
		'parapets': {
			area: 'Parapets',
			indicators: [
				'cracks at the base',
				'significant cracking on wall surface',
			],
		},
		'roof': {
			area: 'Roof',
			indicators: [
				'detachment of roof tiles',
				'structural failure of roof',
			],
		},
		'doors': {
			area: 'Doors',
			indicators: [
				'large cracks',
			],
		},
		'window_openings': {
			area: 'Window openings',
			indicators: [
				'large cracks (for walls with large proportion of openings)',
			],
		},
		'wall_surfaces': {
			area: 'Wall surfaces',
			indicators: [
				'hair-line cracks',
				'small, large, or extensive diagonal cracks',
				'separation of masonry walls from diaphragms',
				'failure of partitions, parapets, gable walls',
			],
		},
		'lintels': {
			area: 'Lintels',
			indicators: [
				'movement',
			],
		},
	},
	'concrete': {
		'entire_outside': {
			area: 'Entire outside',
			indicators: [
				'imminent, partial, or total collapse',
				'rotation of narrow walls with inadequate foundations',
			],
		},
		'wall_surfaces': {
			area: 'Wall surfaces',
			indicators: [
				'diagonal hairline cracks in shear wall surfaces',
				'concrete spalling in wall surfaces and/or wall ends',
				'large through the wall diagonal cracks in walls',
				'extensive spalling around cracks',
				'rotation of narrow walls with inadequate foundations',
			],
		},
		'beams_columns': {
			area: 'Beams and columns',
			indicators: [
				'flexural or shear type hairline cracks near or within joints',
				'broken ties or buckled main reinforcements in columns',
			],
		},
		'frame_elements': {
			area: 'Frame elements',
			indicators: [
				'large flexural cracks',
				'shear cracks and spalling in non-ductile frames',
			],
		},
		'reinforcements': {
			area: 'Reinforcements',
			indicators: [
				'buckling in main reinforcements and/or wall reinforcements',
				'shear or bond failures at reinforcement splices',
			],
		},
		'connections': {
			area: 'Connections',
			indicators: [
				'concrete spalling at the connections of precast members',
				'distress or movement at connections of pre-cast frame connections',
				'failure in some critical precast frame connections',
			],
		},
	},
	'steel': {
		'entire_outside': {
			area: 'Entire outside',
			indicators: [
				'permanent lateral deformation/displacement of the whole structure',
				'buckling at flanges and wall reinforcements',
				'imminent, partial, or  total collapse',
			],
		},
		'wall_surfaces': {
			area: 'Wall surfaces',
			indicators: [
				'hairline-large diagonal cracks in shear wall surfaces',
				'concrete spalling in wall surfaces and/or wall ends',
			],
		},
		'roof': {
			area: 'Roof',
			indicators: [
				'broken welded attachments of roof and wall siding to steel framing',
			],
		},
		'frame_members': {
			area: 'Frame members',
			indicators: [
				'deformation and/or failure of moment frame elements',
				'broken purlin and girt connections',
			],
		},
		'connections': {
			area: 'Connections',
			indicators: [
				'deformation and/or major/permanent rotation at the connections',
				'broken and/or enlarged bolt holes, bolted connections of moment frames',
				'stretched anchor bolts',
				'hairline-major cracks through welds',
				'sagging-broken rod braces',
				'broken brace connections',
				'failure of critical connections',
				'failure of steel framing to concrete wall connections',
			],
		},
	},
};
export type BuildingDamageMaterialIndicatorAreas = {
	'wood': keyof (typeof BUILDING_DAMAGE_INDICATORS)['wood'],
	'masonry': keyof (typeof BUILDING_DAMAGE_INDICATORS)['masonry'],
	'concrete': keyof (typeof BUILDING_DAMAGE_INDICATORS)['concrete'],
	'steel': keyof (typeof BUILDING_DAMAGE_INDICATORS)['steel'],
};
export type BuildingDamageIndicatorArea = BuildingDamageMaterialIndicatorAreas[keyof BuildingDamageMaterialIndicatorAreas];

export const BUILDING_DAMAGE_LEVELS: Record<string, Partial<Record<'default' | string, BuildingDamageLevelIndicators>>> = {
	'wood': {
		'default': {
			'Negligible-Slight': 'Small plaster or gypsum-board cracks at corners of door and window openings and wall-ceiling intersections; small cracks in masonry chimneys and masonry veneer.',
			'Moderate': 'Large plaster or gypsum-board cracks at corners of door and window openings; small diagonal cracks across shear wall panels exhibited by small cracks in stucco and gypsum wall panels; large cracks in brick chimneys; toppling of tall masonry chimneys.',
			'Extensive': 'Large diagonal cracks across shear wall panels or large cracks at plywood joints; permanent lateral movement of floors and roof; toppling of most brick chimneys; cracks in foundations; splitting of wood sill plates and/or slippage of structure over foundations; partial collapse of “room-over-garage” or other “soft-story” configurations; small foundations cracks.',
			'Complete': 'Structure may have large permanent lateral displacement, may collapse, or be in imminent danger of collapse due to cripple wall failure or the failure of the lateral load resisting system; some structures may slip and fall off the foundations; large foundation cracks. Approximately 3% of the total area of W1 buildings with Complete damage is expected to be collapsed.',
		},
	},
	'masonry': {
		'default': {
			'Negligible-Slight': 'Hair-line cracks in very few walls. Fall of small pieces of plaster only. Fall of loose stones from upper parts of buildings in very few cases.',
			'Moderate': 'Cracks in many walls. Fall of fairly large pieces of plaster. Partial collapse of chimneys.',
			'Extensive': 'Large and extensive cracks in most walls. Roof tiles detach. Chimneys fracture at the roof line; failure of individual non-structural elements (partitions, gable walls)',
			'Complete': 'Serious failure of walls; partial structural failure of roofs and floors, total or near total collapse.',
		},
		'URM': {
			'Negligible-Slight': 'Diagonal, stair-step hairline cracks on masonry wall surfaces; larger cracks around door and window openings in walls with large proportion of openings; movements of lintels; cracks at the base of parapets.',
			'Moderate': 'Most wall surfaces exhibit diagonal cracks; some of the walls exhibit larger diagonal cracks; masonry walls may have visible separation from diaphragms; significant cracking of parapets; some masonry may fall from walls or parapets. ',
			'Extensive': 'In buildings with relatively large area of wall openings most walls have suffered extensive cracking. Some parapets and gable end walls have fallen. Beams or trusses may have moved relative to their supports. ',
			'Complete': 'Structure has collapsed or is in imminent danger of collapse due to in-plane or out-of-plane failure of the walls. Approximately 15% of the total area of URM buildings with Complete damage is expected to be collapsed. ',
		},
	},
	'concrete': {
		'default': {
			'Negligible-Slight': 'Flexural or shear type hairline cracks in some beams and columns near joints or within joints. ',
			'Moderate': 'Most beams and columns exhibit hairline cracks. In ductile frames some of the frame elements have reached yield capacity indicated by larger flexural cracks and some concrete spalling. Nonductile frames may exhibit larger shear cracks and spalling.',
			'Extensive': 'Some of the frame elements have reached their ultimate capacity indicated in ductile frames by large flexural cracks, spalled concrete and buckled main reinforcement; nonductile frame elements may have suffered shear failures or bond failures at reinforcement splices, or broken ties or buckled main reinforcement in columns which may result in partial collapse.',
			'Complete': 'Structure is collapsed or in imminent danger of collapse due to brittle failure of nonductile frame elements or loss of frame stability. Approximately 13%(low-rise), 10%(mid-rise) or 5%(high-rise) of the total area of C1 buildings with Complete damage is expected to be collapsed.',
		},
		'C4': {
			'Negligible-Slight': 'Diagonal hairline cracks on most concrete shear wall surfaces; minor concrete spalling at few locations.',
			'Moderate': 'Most shear wall surfaces exhibit diagonal cracks; some shear walls have exceeded yield capacity indicated by larger diagonal cracks and concrete spalling at wall ends.',
			'Extensive': 'Most concrete shear walls have exceeded their yield capacities; some walls have exceeded their ultimate capacities indicated by large, through-the-wall diagonal cracks, extensive spalling around the cracks and visibly buckled wall reinforcement or rotation of narrow walls with inadequate foundations. Partial collapse may occur due to failure of nonductile columns not designed to resist lateral loads.',
			'Complete': 'Structure has collapsed or is in imminent danger of collapse due to failure of most of the shear walls and failure of some critical beams or columns. Approximately 13%(low-rise), 10%(mid-rise) or 5%(high-rise) of the total area of C2 buildings with Complete damage is expected to be collapsed.',
		},
		'PC2': {
			'Negligible-Slight': 'Diagonal hairline cracks on most shear wall surfaces; minor concrete spalling at few connections of precast members.',
			'Moderate': 'Most shear wall surfaces exhibit diagonal cracks; some shear walls have exceeded their yield capacities indicated by larger cracks and concrete spalling at wall ends; observable distress or movement at connections of precast frame connections, some failures at metal inserts and welded connections.',
			'Extensive': 'Most concrete shear walls have exceeded their yield capacities; some walls may have reached their ultimate capacities indicated by large, through-the wall diagonal cracks, extensive spalling around the cracks and visibly buckled wall reinforcement. Some critical precast frame connections may have failed resulting partial collapse.',
			'Complete': 'Structure has collapsed or is in imminent danger of collapse due to failure of the shear walls and/or failures at precast frame connections. Approximately 15%(low-rise), 13%(mid-rise) or 10%(high-rise) of the total area of PC2 buildings with Complete damage is expected to be collapsed.',
		},
	},
	'steel': {
		'default': {
			'Negligible-Slight': 'Minor deformations in connections or hairline cracks in few welds.',
			'Moderate': 'Some steel members have yielded exhibiting observable permanent rotations at connections; few welded connections may exhibit major cracks through welds or few bolted connections may exhibit broken bolts or enlarged bolt holes.',
			'Extensive': 'Most steel members have exceeded their yield capacity, resulting in significant permanent lateral deformation of the structure. Some of the structural members or connections may have exceeded their ultimate capacity exhibited by major permanent member rotations at connections, buckled flanges and failed connections. Partial collapse of portions of structure is possible due to failed critical elements and/or connections.',
			'Complete': 'Significant portion of the structural elements have exceeded their ultimate capacities or some critical structural elements or connections have failed resulting in dangerous permanent lateral displacement, partial collapse or collapse of the building. Approximately 8%(low-rise), 5%(mid-rise) or 3%(high-rise) of the total area of S1 buildings with Complete damage is expected to be collapsed.',
		},
		'S3': {
			'Negligible-Slight': 'Few steel rod braces have yielded which may be indicated by minor sagging of rod braces. Minor cracking at welded connections or minor deformations at bolted connections of moment frames may be observed.',
			'Moderate': 'Most steel braces have yielded exhibiting observable significantly sagging rod braces; few brace connections may be broken. Some weld cracking may be observed in the moment frame connections.',
			'Extensive': 'Significant permanent lateral deformation of the structure due to broken brace rods, stretched anchor bolts and permanent deformations at moment frame members. Some screw or welded attachments of roof and wall siding to steel framing may be broken. Some purlin and girt connections may be broken.',
			'Complete': 'Structure is collapsed or in imminent danger of collapse due to broken rod bracing, failed anchor bolts or failed structural members or connections. Approximately 3% of the total area of S3 buildings with Complete damage is expected to be collapsed.',
		},
		'S4': {
			'Negligible-Slight': 'Diagonal hairline cracks on most concrete shear wall surfaces; minor concrete spalling at few locations.',
			'Moderate': 'Most shear wall surfaces exhibit diagonal cracks; some of the shear walls have exceeded their yield capacities exhibited by larger diagonal cracks and concrete spalling at wall ends.',
			'Extensive': 'Most concrete shear walls have exceeded their yield capacities; few walls have reached or exceeded their ultimate capacity exhibited by large through-the wall diagonal cracks, extensive spalling around the cracks and visibly buckled wall reinforcement. Partial collapse may occur due to failed connections of steel framing to concrete walls. Some damage may be observed in steel frame connections.',
			'Complete': 'Structure may be in danger of collapse or collapse due to total failure of shear walls and loss of stability of the steel frames. Approximately 8%(low-rise), 5%(mid-rise) or 3%(high-rise) of the total area of S4 buildings with Complete damage is expected to be collapsed.',
		},
	},
};
export type BuildingDamageLevel = 'Negligible-Slight' | 'Moderate' | 'Extensive' | 'Complete';
export type BuildingDamageLevelIndicators = Record<BuildingDamageLevel, string>;

export const BUILDING_SAFETY_EVALUATION_CONDITIONS = {
	'collapsed': 'Collapse, partial collapse, or building off foundation',
	'leaning': 'Building or story leaning',
	'racking_damage': 'Racking damage to walls, other structural damage',
	'falling_hazard': 'Chimney, parapet, or other falling hazard',
	'slope_movement_cracking': 'Ground slope movement or cracking',
};
export type BuildingSafetyEvaluationCondition = keyof typeof BUILDING_SAFETY_EVALUATION_CONDITIONS;
export type BuildingSafetyEvaluationSeverity = 'Slight' | 'Moderate' | 'Severe';

export type BuildingFinalPosting = 'INSPECTED' | 'RESTRICTED USE' | 'UNSAFE';
