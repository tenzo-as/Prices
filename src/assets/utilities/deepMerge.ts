const deepMerge = (first: any, second: any): any => {
	if (typeof first === 'string' && typeof second === 'string') return second;
	if (Array.isArray(first) && Array.isArray(second)) return second;

	if (typeof first === 'string' || Array.isArray(first)) throw new Error('typeof first !== typeof second');
	if (typeof second === 'string' || Array.isArray(second)) throw new Error('typeof second !== typeof first');

	const out: any = {};

	const keys: string[] = [], allKeys: string[] = [...Object.keys(first), ...Object.keys(second)];
	allKeys.forEach(key => !keys.includes(key) ? keys.push(key) : 0);
	keys.forEach(key => out[key] = first[key] ? (second[key] ? deepMerge(first[key], second[key]) : first[key]) : second[key]);

	return out;
};

export default deepMerge;
