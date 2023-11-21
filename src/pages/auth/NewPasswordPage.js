// import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Typography, Box} from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Logo from '../../components/logo'
// sections
import AuthNewPasswordForm from '../../sections/auth/AuthNewPasswordForm';
// assets
import { SentIcon } from '../../assets/icons';
import { MotionContainer } from '../../components/animate';

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  return (
    <MotionContainer>
     <Box sx={{ position: 'relative'}}>
      <Logo
          width={450}
          sx={{
            margin: 'auto',
            filter: 'grayscale(100%) opacity(30%)',
            pointerEvents: 'none',
            padding: '3rem 0'
          }}
        />
        <SentIcon sx={{ position: 'absolute', width: '10%', top: '100px', right: '100px', transform: 'rotate(20deg)'}}/>
      </Box>

      <Typography variant="h4" paragraph>
         Enter New Password
      </Typography>

      <AuthNewPasswordForm />

      {/* <Typography variant="body2" sx={{ my: 3 }}>
        Don’t have a code? &nbsp;
        <Link variant="subtitle2">Resend code</Link>
      </Typography> */}

      <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 2,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Return to sign in
      </Link>
    </MotionContainer>
  );
}
