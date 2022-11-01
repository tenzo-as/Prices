import { useState, SyntheticEvent } from 'react';
import { SnackbarCloseReason } from '@mui/material/Snackbar/Snackbar';
import { AlertColor } from '@mui/material/Alert/Alert';

type UseSnackbarMessage = {
	status: AlertColor,
	value: string,
} | null;

const useSnackbar = (reasonsToNotClose?: SnackbarCloseReason[]) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [message, setMessage] = useState<UseSnackbarMessage>(null);

	const open = (message: UseSnackbarMessage) => {
		setMessage(message);
		setIsOpen(true);
	};

	const handleClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
		if (reasonsToNotClose && reason && reasonsToNotClose.includes(reason)) {
			return;
		}

		setMessage(null);
		setIsOpen(false);
	};

	return {
		isOpen,
		setIsOpen,
		message,
		setMessage,
		open,
		handleClose,
	};
};

export default useSnackbar;