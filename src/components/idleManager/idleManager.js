import { useState, useEffect} from 'react';
import { LoadingButton } from '@mui/lab';
import { useIdleTimer } from 'react-idle-timer'

import { useAuthContext } from '../../auth/useAuthContext';
import { CONFIG } from '../../config-global';

// import useIdleTimeout from '../../utils/useIdleTimeout';
import ConfirmDialog from '../confirm-dialog';

// ----------------------------------------------------------------------

const IdleManager = () => {
  const [openModal, setOpenModal] = useState(false);
  const { logout, isAuthenticated } = useAuthContext();
  const [showStay, setShowStay] = useState(true);
  const [countdown, setCountdown] = useState(10);
  
  const idleTimeout = 1000 * CONFIG.IDLE_TIME;

  const handleIdle = () => {
      setOpenModal(true);
  }

  const { activate } = useIdleTimer({
    timeout: idleTimeout,
    promptBeforeIdle: CONFIG.IDLE_TIME,
    onPrompt: handleIdle,
    debounce: 500,
    disabled: !isAuthenticated,
});

  /* eslint-disable */
  useEffect(() => {
    if (openModal && showStay) {
      const timer = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          setShowStay(false);
          setOpenModal(false);
          logout()
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


  
  const handleStillHere = () => {
    setOpenModal(false);
    resetCountdown();
    activate()
  }

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
            <LoadingButton variant="contained" color="primary" onClick={handleStillHere}>
              Stay
            </LoadingButton>
          ) : null
        }
      />
  );
}

export default IdleManager;
