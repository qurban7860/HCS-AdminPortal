import { Helmet } from 'react-helmet-async';
// sections
import Login from '../../sections/auth/Login';
// import Login from '../../sections/auth/LoginAuth0';

import { CONFIG } from '../../config-global';
// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | {CONFIG.APP_TITLE} </title>
      </Helmet>

      <Login/>
    </>
  );
}
