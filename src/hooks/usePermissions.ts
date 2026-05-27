import { useState, useEffect } from 'react';
import { requestBluetoothPermissions } from '../bluetooth/permissions';

export const usePermissions = () => {
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkAndRequest = async () => {
    setIsChecking(true);
    const granted = await requestBluetoothPermissions();
    setHasPermissions(granted);
    setIsChecking(false);
    return granted;
  };

  useEffect(() => {
    checkAndRequest();
  }, []);

  return { hasPermissions, isChecking, requestPermissions: checkAndRequest };
};
