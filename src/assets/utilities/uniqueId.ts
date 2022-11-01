let id = 0;

const uniqueId = (prefix?: string): string => {
	id++;
	return `${prefix ? prefix : ''}${id}`;
}

export default uniqueId;
