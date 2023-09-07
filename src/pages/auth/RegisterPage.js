// import { Helmet } from 'react-helmet-async';
// sections
import Register from '../../sections/auth/Register';

// ----------------------------------------------------------------------
// import { CONFIG } from '../../config-global';

export default function RegisterPage() {
  return (
    <>
      {/* <Helmet>
        <title> Register | {CONFIG.APP_TITLE} </title>
      </Helmet> */}

      <Register />
    </>
  );
}
