import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper } from '@mui/material';

const SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Google test key

const ReCaptcha = ({ onVerify }) => {
  const captchaRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const scriptId = 'recaptcha-script';

    const loadScript = () =>
      new Promise((resolve, reject) => {
        if (document.getElementById(scriptId)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

    loadScript()
      .then(() => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            if (captchaRef.current && widgetIdRef.current === null) {
              widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
                sitekey: SITE_KEY,
                callback: (token) => onVerify(token),
                'expired-callback': () => onVerify(null),
              });
            }
          });
        } else {
          console.error('grecaptcha.ready is not available');
        }
      })
      .catch(() => {
        console.error('Failed to load reCAPTCHA script');
      });
  }, [onVerify]);

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        textAlign: 'left',
        bgcolor: 'transparent',
        boxShadow: 'none',
        width: { xs: '100%', sm: '95%', md: '90%', lg: '85%' },
        p: 0,
      }}
    >
      <Box
        ref={captchaRef}
        sx={{
          display: 'inline-block',
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '100%',
          bgcolor: 'transparent',
          border: 'none',
        }}
      />
    </Paper>
  );
};

ReCaptcha.propTypes = {
  onVerify: PropTypes.func.isRequired,
};

export default ReCaptcha;
