import { useState } from 'react';

const useBackdrop = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleToggle = () => {
		setIsOpen(prevState => !prevState);
	};

	return {
		isOpen,
		setIsOpen,
		handleClose,
		handleToggle,
	};
};

export default useBackdrop;