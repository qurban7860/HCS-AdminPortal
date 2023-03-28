import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography ,Button, Grid} from '@mui/material';

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

Cover.propTypes = {
  cover: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
  setting: PropTypes.string,
  photoURL:PropTypes.string,
  icon: PropTypes.string,
};

export function Cover({ cover, name, role, setting , photoURL , icon }) {
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate(PATH_MACHINE.general.app);
    // console.log('navigate')
  };
    // const [selectedOption, setSelectedOption] = useState('Option 1');
    // const [selectedOption2, setSelectedOption2] = useState('Option 1');
    // const [selectedOption3, setSelectedOption3] = useState('Option 1');
//   cMachine } = useAuthContext();

  return (
    <StyledRoot >
      <StyledInfo style={{width: '100%'}}>
        <CustomAvatar
          src={photoURL}
          alt={name}
          name={icon === undefined ? name : ""}
          sx={{
            mx: {xs:'auto', md:0},
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.black',
            color: 'black',
            background: 'orange',
            // background: '#2065d1',
            ml: {xs: 2, md:0},
            width: { xs: 80, md: 110 },
            height: { xs: 80, md: 110 },
          }}
        >
            {/* <ListAltIcon sx={{
                 width: {xs: 32, md: 48 }, 
                 height: {xs: 32, md: 48},
                 color: 'black',
                }}  
            /> */}
            <Iconify icon={icon} sx={{
                 width: {xs: 32, md: 48 }, 
                 height: {xs: 32, md: 48},
                 color: 'black',
                }}/>
        </CustomAvatar>

        
        {/* <Box
          sx={{
            // ml: { md: 3 },
            // mt: { xs: 1, md: 0 },
            // color: 'common.white',
            // textAlign: { xs: 'center', md: 'left' },
          }}
        > */}
        <Typography variant="h4" 
        sx={{ ml:3,
        color: 'common.white' ,
        mb: { xs: -3, md: 0},
        display: { xs: 'none', md: 'block' },
        }}
        >{name}</Typography>
        
          {setting ? 
          <Button variant="h4" 
          sx={{ ml: {md:'auto', xs:5}, 
          pr: 5,
          color: {xs: 'common.black' ,md: 'common.white'},
          display: { xs: 'flex-end', md: 'block'},
          mb: { xs: 5, md: -2},
          }} 
          onClick={handleNavigate}
           ><Iconify icon="eva:settings-2-outline" /></Button>
           : " "}

        {/* </Box> */}
      
        

      </StyledInfo>
      {/* <Image
        alt="cover"
        // src={cover}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
        }}
      /> */}
      
        
    </StyledRoot>
  );
}
