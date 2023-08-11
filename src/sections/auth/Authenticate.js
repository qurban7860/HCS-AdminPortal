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
import AuthenticateForm from './AuthenticateForm';
import AuthWithSocial from './AuthWithSocial';
import Logo from '../../components/logo';
import { CONFIG } from '../../config-global';
// ----------------------------------------------------------------------

export default function Login(){
return (
  <LoginLayout title={CONFIG.MESSAGE_LOGIN_USER}>
    
    <AuthenticateForm />

    
  </LoginLayout>
);
}
