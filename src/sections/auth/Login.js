// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';
import { CONFIG } from '../../config-global';
// ----------------------------------------------------------------------

export default function Login(){
return (
  <LoginLayout title="CLOUD SERVICES">
    <AuthLoginForm />
  </LoginLayout>
);
}
