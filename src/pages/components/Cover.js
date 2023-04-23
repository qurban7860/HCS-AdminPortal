import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography ,Button, Grid, Link} from '@mui/material';

// utils
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { bgBlur } from '../../utils/cssStyles';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Image from '../../components/image';
import { CustomAvatar } from '../../components/custom-avatar';
import Iconify from '../../components/iconify';
import { PATH_DASHBOARD, PATH_MACHINE } from '../../routes/paths';
import LogoAvatar from '../../components/logo-avatar/LogoAvatar';
import useResponsive from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({
      color: theme.palette.primary.dark,
    }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: 'calc(100% - 50px)',
    position: 'absolute',
  },
}));

const StyledInfo = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));



// ----------------------------------------------------------------------

Cover.propTypes = {
  tradingName: PropTypes.string,
  cover: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
  setting: PropTypes.string,
  photoURL:PropTypes.string,
  icon: PropTypes.string,
  serialNo: PropTypes.string,
  backLink: PropTypes.string,
};
export function Cover({ tradingName, cover, name, serialNo, role, setting, photoURL, icon, backLink }) {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(PATH_MACHINE.general.app);
  };
  const handleBacklink = () => {
    navigate(backLink);
  };

  const isMobile = useResponsive('down', 'sm');

  // this will be used to determine the category of the page
  const CategoryArr = [ 'Machines', 'Customers', 'Users'];
  // this will only display the main category names
  const Category = CategoryArr.includes(name) ? name : null;

  return (
    <StyledRoot
      style={{
        p: { xs: 0, md: 0 },
      }}
    >
      <StyledInfo
        style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'space-between' }}
      >
        {photoURL ? (
          <CustomAvatar
            name={name !== 'HOWICK LTD.' ? name : ''}
            alt={name}
            // name={icon === undefined ? name : ''}
            sx={{
              // mx: {xs:'auto', md:0},
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: 'common.white',
              color: '#fff',
              fontSize: '4rem',
              ml: { xs: 3, md: 3 },
              mt: { xs: 1, md: 1 },
              width: { xs: 110, md: 110 },
              height: { xs: 110, md: 110 },
            }}
          >
          {/* if the page is Howick, will show the howick logo */}
            {name !== 'HOWICK LTD.' ? null : <LogoAvatar />}
          </CustomAvatar>
        ) : (
          ''
        )}

        {serialNo ? (
          <Typography
            variant="h2"
            sx={{
              px: 3,
              color: 'common.white',
              mt: { xs: 5, md: 5 },
              mb: 0,
              display: { xs: 'flex', md: 'block' },
            }}
          >
            {serialNo} {name ? ` / ${name}` : ''}
          </Typography>
        ) : (
          <Typography
            variant={photoURL ? 'h3' : 'h2'}
            sx={{
              px: 3,
              color: 'common.white',
              mt: { xs: 6, md: 5 },
              display: { xs: 'flex', md: 'block' },
            }}
            >
            {/* if in mobile/device, only the avatar will show up */}
            {isMobile && name !== Category ? null : name}
          </Typography>
        )}

        <div style={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
          {backLink ? (
            <Link
              title="Go Back"
              sx={{
                ml: 'auto',
                mt: 'auto',
                color: 'common.white',
                mb: 3,
              }}
              component="button"
              variant="body2"
              onClick={handleBacklink}
            >
              <Iconify icon="material-symbols:arrow-back-rounded" />
            </Link>
          ) : (
            ' '
          )}
          {setting ? (
            <Link
              title="Machine Setting"
              sx={{
                cursor: 'hover',
                mt: 'auto',
                color: 'common.white',
                mb: 3,
                mx: 2,
              }}
              component="button"
              variant="body2"
              onClick={handleNavigate}
            >
              <Iconify icon="eva:settings-2-outline" />
            </Link>
          ) : (
            ' '
          )}
        </div>
      </StyledInfo>
    </StyledRoot>
  );
}
