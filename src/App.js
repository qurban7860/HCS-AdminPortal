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
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
// Error Boundry
import ErrorBoundary from './utils/ErrorBoundary';

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
import DialogManager from './components/Dialog/DialogManager';

// Check our docs
// https://docs.minimals.cc/authentication/js-version

import Page500 from './pages/Page500';
import { AuthProvider } from './auth/JwtContext';
import { WebSocketProvider } from './auth/WebSocketContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <HelmetProvider>
          <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SettingsProvider>
                  <BrowserRouter>
                    <MotionLazyContainer>
                      <ThemeProvider>
                        <ThemeSettings>
                          <ErrorBoundary fallback={<Page500 />}>
                            <ScrollToTop />
                            <ThemeLocalization>
                              <SnackbarProvider>
                                <Router />
                                <StyledChart />
                                <IdleManager />
                                <DialogManager />
                              </SnackbarProvider>
                            </ThemeLocalization>
                          </ErrorBoundary>
                        </ThemeSettings>
                      </ThemeProvider>
                    </MotionLazyContainer>
                  </BrowserRouter>
                </SettingsProvider>
              </LocalizationProvider>
            </PersistGate>
          </ReduxProvider>
        </HelmetProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}
