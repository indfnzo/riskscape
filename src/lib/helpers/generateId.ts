const counters: Record<string, number> = {};

export const generateId = (prefix: string) => {
	if (!(prefix in counters)) counters[prefix] = 1;
	return `${prefix}_${counters[prefix]++}`;
};
