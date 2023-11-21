// import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Link, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Logo from '../../components/logo';
// sections
import AuthResetPasswordForm from '../../sections/auth/AuthResetPasswordForm';
// assets
import { PasswordIcon } from '../../assets/icons';
import { MotionContainer } from '../../components/animate';
import { TITLES } from '../../constants/default-constants';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
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
        <PasswordIcon sx={{ position: 'absolute', width: '10%', top: '100px', right: '100px', transform: 'rotate(30deg)'}}/>
      </Box>
      <Typography variant="h3" paragraph>
        {TITLES.FORGOT_PASSWORD}
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>{TITLES.FORGOT_DESC}</Typography>
      <AuthResetPasswordForm />

      <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        {TITLES.FORGOT_RETURN}
      </Link>
    </MotionContainer>
  );
}
