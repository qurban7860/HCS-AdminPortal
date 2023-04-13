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
    <>
    
    <LoginLayout title={CONFIG.MESSAGE_LOGIN_USER}>
        <Stack  sx={{ display: 'flex',justifyContent: 'center',alignItems: 'center',whiteSpace: 'nowrap'}}>
            <Typography variant="h3" sx={{mb:5}}>CLOUD SERVICES</Typography>
        </Stack>
        <AuthLoginForm />
      
      {/* <Stack direction="row" spacing={0.5} sx={{mt:2}}>
          <Typography variant="body2">New user?</Typography>
          <Link component={RouterLink} to={PATH_AUTH.register} variant="subtitle2">
            Create an account
          </Link>
        </Stack> */}

      {/* <AuthWithSocial /> */}
    </LoginLayout>
    
    </>
  );
}
