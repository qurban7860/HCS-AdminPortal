import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Alert, Container, Tooltip, Stack, Typography, Link, Box, Card , Grid} from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// routes
import { PATH_AUTH } from '../../routes/paths';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';
import AuthWithSocial from './AuthWithSocial';
import Logo from '../../components/logo';
import { CONFIG } from '../../config-global';
// ----------------------------------------------------------------------

export default function Login(){
return (
  <LoginLayout title={CONFIG.MESSAGE_LOGIN_USER}>
    <Stack
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', whiteSpace: 'nowrap' }}
    >
      <Typography variant="h2" sx={{ mb: 5 }}>
        CLOUD SERVICES
      </Typography>
    </Stack>
    <Grid item xs={6}>
      <Typography
        sx={{
          backgroundColor: CONFIG.Background_Color,
          borderRadius: '2px',
          textAlign: 'center',
          fontWeight: 'bold',
          p: 1,
          py: 0.1,
        }}
      >
        {CONFIG.ENV}
        {'  '}
        {CONFIG.Version}
      </Typography>
    </Grid>
    <AuthLoginForm />

    {/* <Stack direction="row" spacing={0.5} sx={{mt:2}}>
          <Typography variant="body2">New user?</Typography>
          <Link component={RouterLink} to={PATH_AUTH.register} variant="subtitle2">
            Create an account
          </Link>
        </Stack> */}

    {/* <AuthWithSocial /> */}
  </LoginLayout>
);
}
