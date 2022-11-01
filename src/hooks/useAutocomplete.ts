import { SyntheticEvent, useState } from 'react';

export type UseAutocompleteOption = {
	id: number | string,
	name: string,
};

const useAutocomplete = (isClearable: boolean = true) => {
	const [value, setValue] = useState<UseAutocompleteOption | null>(null);
	const [options, setOptions] = useState<UseAutocompleteOption[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleChange = (event: SyntheticEvent, value: UseAutocompleteOption | null) => {
		if (!isClearable && !value) return;

		setValue(value);
	};

	return {
		value,
		setValue,
		options,
		setOptions,
		handleChange,
		isLoading,
		setIsLoading,
	};
};

export default useAutocomplete;