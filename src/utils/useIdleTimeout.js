import { useContext, useState } from "react"
import { useIdleTimer } from "react-idle-timer"
import { useAuthContext } from '../auth/useAuthContext';
import { CONFIG } from '../config-global';
import { convertTimeToMilliseconds } from './formatTime';
 

/**
 * @param onIdle - function to notify user when idle timeout is close
 * @param idleTime - number of seconds to wait before user is logged out
 */
const useIdleTimeout = ({ onIdle, idleTime = 1, isAuthenticated }) => {
    const idleTimeout = 1000 * idleTime;
    // console.log('idle time----------->', convertTimeToMilliseconds(CONFIG.IDLE_TIME));
    // console.log('env time----------->', CONFIG.IDLE_TIME);

    const [isIdle, setIdle] = useState(false)
    // const { logout } = useAuthContext();
    const handleIdle = () => {
        console.log('idle working');
        setIdle(true)
        // logout()
    }
    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        promptTimeout: idleTimeout,
        onPrompt: onIdle,
        onIdle: handleIdle,
        debounce: 500,
        disabled: !isAuthenticated
    });

    return {
        isIdle,
        setIdle,
        idleTimer
    }
}
export default useIdleTimeout;