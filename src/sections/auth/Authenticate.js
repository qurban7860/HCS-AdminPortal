// @mui
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthenticateForm from './AuthenticateForm';
import { CONFIG } from '../../config-global';
// ----------------------------------------------------------------------

export default function Login(){
return (
  <LoginLayout title={CONFIG.MESSAGE_LOGIN_USER}>
    
    <AuthenticateForm />

    
  </LoginLayout>
);
}
