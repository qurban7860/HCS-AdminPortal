// i18n
import './locales/i18n';

// scroll bar
import 'simplebar/src/simplebar.css';
// lightbox
/* eslint-disable import/no-unresolved */
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// map
import './utils/mapboxgl';
import 'mapbox-gl/dist/mapbox-gl.css';

// editor

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-quill/dist/quill.snow.css';
// ----------------------------------------------------------------------
import useWebSocket from 'react-use-websocket';
import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
// Error Boundry
import ErrorBoundary from './utils/ErrorBoundary'

// redux
import { store, persistor } from './redux/store';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// locales
import ThemeLocalization from './locales';
// components
import { StyledChart } from './components/chart';
import SnackbarProvider from './components/snackbar';
import ScrollToTop from './components/scroll-to-top';
import { MotionLazyContainer } from './components/animate';
import { ThemeSettings, SettingsProvider } from './components/settings';
import IdleManager from './components/idleManager';

// Check our docs
// https://docs.minimals.cc/authentication/js-version

import { AuthProvider } from './auth/JwtContext';
import Page500 from './pages/Page500';
import { CONFIG } from './config-global';

// ----------------------------------------------------------------------

export default function App() {

  const token = localStorage.getItem('accessToken');
  const WS_URL = token ? `${CONFIG.SOCKET_URL}/?accessToken=${token}` : null;
  const { sendMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    onClose: () => {
      console.log('WebSocket connection closed.');
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true
  });
  
  return (
    <AuthProvider>
        <HelmetProvider>
          <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SettingsProvider>
                  <BrowserRouter>
                    <ErrorBoundary fallback={<Page500 /> } >
                      <ScrollToTop />
                      <MotionLazyContainer>
                        <ThemeProvider>
                          <ThemeSettings>
                            <ThemeLocalization>
                              <SnackbarProvider>
                                <StyledChart />
                                <IdleManager/>
                                  <Router />
                              </SnackbarProvider>
                            </ThemeLocalization>
                          </ThemeSettings>
                        </ThemeProvider>
                      </MotionLazyContainer>
                   </ErrorBoundary>
                  </BrowserRouter>
                </SettingsProvider>
              </LocalizationProvider>
            </PersistGate>
          </ReduxProvider>
        </HelmetProvider>
      </AuthProvider>
  );
}
