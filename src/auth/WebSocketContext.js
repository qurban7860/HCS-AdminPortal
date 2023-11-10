// WebSocketContext.js
import PropTypes from 'prop-types';
import useWebSocket from 'react-use-websocket';
import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { CONFIG } from '../config-global';
import { useAuthContext } from './useAuthContext';
import ConfirmDialog from '../components/confirm-dialog';
import LoadingButton from '../theme/overrides/LoadingButton';

const WebSocketContext = createContext();

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}

WebSocketProvider.propTypes = {
children: PropTypes.node,
};

export function WebSocketProvider({ children }) {
  const { isAuthenticated } = useAuthContext();
  const [token, setToken] = useState(null);
  const WS_URL = token ? `${CONFIG.SOCKET_URL}/?accessToken=${token}` : null;
  const { sendMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    onClose: () => {
      console.log('WebSocket connection closed.');
    },
    onMessage: (event) => {
      if (event.data instanceof Blob) {
        // Handle Blob data here, for example, you can use FileReader to read its content
        const reader = new FileReader();
        reader.onload = function() {
          const blobData = JSON.parse(reader.result);
          if(blobData.eventName==="logout"){          
            window.location.reload();  
          }
          // Now you can work with the blobData
        };
        reader.readAsText(event.data);
      } else {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket JSON message:', data);
          // Now 'data' contains the parsed JavaScript object representing the received message
          // You can use 'data' to update your state or perform any other actions
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      }
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => false
  });

  useEffect(() => {
    if(isAuthenticated){
      const accessToken = localStorage.getItem('accessToken');
      setToken(accessToken);
    }
  }, [isAuthenticated]); // Empty dependency array ensures this effect runs once on mount
  
  const contextValue = useMemo(() => ({ sendMessage, readyState }), [sendMessage, readyState]);

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}