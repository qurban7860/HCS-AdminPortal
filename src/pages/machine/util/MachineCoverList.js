import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// utils
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { bgBlur } from '../../../utils/cssStyles';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import Image from '../../../components/image';
import { CustomAvatar } from '../../../components/custom-avatar';

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

MachineCoverList.propTypes = {
  cover: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
};

export function MachineCoverList({ name, role, cover }) {

    // const [selectedOption, setSelectedOption] = useState('Option 1');
    // const [selectedOption2, setSelectedOption2] = useState('Option 1');
    // const [selectedOption3, setSelectedOption3] = useState('Option 1');
//   cMachine } = useAuthContext();

  return (
    <StyledRoot>
      <StyledInfo>
        <CustomAvatar
        // Machine?.photoURL}
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
            <ListAltIcon sx={{
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
          {/* Muzna */}
          {/* <Typography sx={{ opacity: 0.72 }}>{role}</Typography> */}
        </Box>
        {/* <Select
          value={selectedOption}
          onChange={(event) => setSelectedOption(event.target.value)}
          sx={{ ml: 2, color: 'common.white' }}
        ><MenuItem value="Option 1">Common Settings </MenuItem>
          <MenuItem value="Option 2">Machine Categories </MenuItem>
          <MenuItem value="Option 3">Machine Models</MenuItem>
          <MenuItem value="Option 4">Machine Suppliers</MenuItem>
          <MenuItem value="Option 5">Machine Status</MenuItem>
        </Select>

        <Select
          value={selectedOption2}
          onChange={(event) => setSelectedOption3(event.target.value)}
          sx={{ ml: 2, color: 'common.white' }}
        > 
        <MenuItem value="Option 1">Technical Settings</MenuItem>
          <MenuItem value="Option 2">Setting Categories</MenuItem>
          <MenuItem value="Option 3">Parameters</MenuItem>
          
        </Select>

        <Select
          value={selectedOption3}
          onChange={(event) => setSelectedOption2(event.target.value)}
          sx={{ ml: 2, color: 'common.white' }}
        >
          <MenuItem value="Option 1">Tools Information</MenuItem>
          <MenuItem value="Option 2">Tools</MenuItem>
          
        </Select> */}

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
