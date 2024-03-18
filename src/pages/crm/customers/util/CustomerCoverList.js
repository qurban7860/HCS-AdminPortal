import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// utils
import PersonIcon from '@mui/icons-material/Person';
import { bgBlur } from '../../../../utils/cssStyles';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import Image from '../../../../components/image';
import { CustomAvatar } from '../../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({
      color: theme.palette.primary.darker,
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
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

CustomerCoverList.propTypes = {
  cover: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
};

export function CustomerCoverList({ name, role, cover }) {
//   const { customer } = useAuthContext();

  return (
    <StyledRoot>
      <StyledInfo>
        <CustomAvatar
        //   src={customer?.photoURL}
        //   alt={name}
        //   name={name}Ï
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            background: '#2065d1',
            width: { xs: 80, md: 110 },
            height: { xs: 80, md: 110 },
          }}
        >
            <PersonIcon sx={{
                 width: {xs: 32, md: 48 },
                 height: {xs: 32, md: 48},
                 color: 'white'
                }}
            />
        </CustomAvatar>


        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h4">{name}</Typography>

          {/* <Typography sx={{ opacity: 0.72 }}>{role}</Typography> */}
        </Box>
      </StyledInfo>

      <Image
        alt="cover"
        // src={cover}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
        }}
      />

    </StyledRoot>
  );
}
