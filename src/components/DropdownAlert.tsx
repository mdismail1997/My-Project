import React from 'react';
import { Snackbar } from 'react-native-advance-components';

export interface DropdownAlertProps {
  isVisible: Snackbar['props']['isVisible'];
  status: Snackbar['props']['status'];
  message: Snackbar['props']['message'];
  autoClose?: Snackbar['props']['autoClose'];
  autoHideDuration?: Snackbar['props']['autoHideDuration'];
  anchorOrigin?: Snackbar['props']['anchorOrigin'];
  onClose?: Snackbar['props']['onClose'];
}
export const DropdownAlert: React.FC<DropdownAlertProps> = ({
  isVisible,
  message,
  status,
  autoClose,
  autoHideDuration = 3000,
  onClose,
  anchorOrigin = 'top',
}) => {
  return (
    <Snackbar
      isVisible={isVisible}
      message={message}
      status={status}
      anchorOrigin={anchorOrigin}
      autoClose={autoClose}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      variant="left-accent"
    />
  );
};
