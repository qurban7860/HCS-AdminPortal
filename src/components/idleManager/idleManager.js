import { useState, useEffect} from 'react';
import { LoadingButton } from '@mui/lab';

import { useAuthContext } from '../../auth/useAuthContext';
import { CONFIG } from '../../config-global';

import useIdleTimeout from '../../utils/useIdleTimeout';
import ConfirmDialog from '../confirm-dialog';

// ----------------------------------------------------------------------

const IdleManager = () => {
  const [openModal, setOpenModal] = useState(false);
  const { logout, isAuthenticated } = useAuthContext();
  const [showStay, setShowStay] = useState(true);
  const [countdown, setCountdown] = useState(10);

  const handleIdle = () => {
      setOpenModal(true);
  }

  const idleTimer = useIdleTimeout({
    onIdle: handleIdle,
    idleTime: CONFIG.IDLE_TIME,
    isAuthenticated
  });

  /* eslint-disable */
  useEffect(() => {
    if (openModal && showStay) {
      const timer = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          setShowStay(false);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [openModal, showStay, countdown]);
 /* eslint-enable */


  const resetCountdown = () => {
    setShowStay(true)
    setCountdown(10);
  }

  const stay = () => {
    setOpenModal(false);
    resetCountdown();
    if (idleTimer) {
      idleTimer.reset();
    }
  };
  const handleLogout = () => {
      logout()
      setOpenModal(false);
      resetCountdown();
  }

  return (    
      <ConfirmDialog
        open={openModal}
        onClose={handleLogout}
        title="Session Inactivity"
        content={`You are about to be logged out! ${
          showStay ? `Please stay or you'll be logged out in ${countdown} seconds.` : ''
        }`}
        SubButton="Logout"
        action={
          showStay ? (
            <LoadingButton variant="contained" color="primary" onClick={stay}>
              Stay
            </LoadingButton>
          ) : null
        }
      />
  );
}

export default IdleManager;
