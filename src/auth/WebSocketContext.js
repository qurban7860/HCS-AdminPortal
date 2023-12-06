import PropTypes from 'prop-types';
import useWebSocket from 'react-use-websocket';
import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { CONFIG } from '../config-global';
import { useAuthContext } from './useAuthContext';

const WebSocketContext = createContext();

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}

WebSocketProvider.propTypes = {
  children: PropTypes.node,
};

export function WebSocketProvider({ children }) {
  const { isAuthenticated, clearAllPersistedStates } = useAuthContext();
  const [token, setToken] = useState(null);
  const WS_URL = token ? `${CONFIG.SOCKET_URL}/?accessToken=${token}` : null;
  const { sendMessage, readyState } = useWebSocket(WS_URL, {
    onMessage: (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = ()=> {
          const blobData = JSON.parse(reader.result);
          if (blobData.eventName === 'logout') {
            clearAllPersistedStates()
          }
        };
        reader.readAsText(event.data);
      } else {
        try {
          // const data = JSON.parse(event.data);
          // console.log('WebSocket JSON message:', data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      }
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (isAuthenticated) {
      const accessToken = localStorage.getItem('accessToken');
      setToken(accessToken);
    }
  }, [isAuthenticated]); 

  const contextValue = useMemo(() => ({ sendMessage, readyState }), [sendMessage, readyState]);

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
}
