/**
 * Get the vintage type of a building.
 */
export const getVintage = (year: number) => {
	if (year < 1972) return 'Pre-code';
	else if (year < 2015) return 'Low code';
	else return 'High code';
};

/**
 * Get the rise type of a building.
 */
export const getRise = (stories: number) => {
	if (stories < 3) return 'Low Rise';
	else if (stories < 8) return 'Mid Rise';
	else return 'High Rise';
};

/**
 * Get the rise type code of a building (for use in building type code).
 */
export const getRiseCode = (stories: number) => {
	if (stories < 3) return 'L';
	else if (stories < 8) return 'M';
	else return 'H';
};