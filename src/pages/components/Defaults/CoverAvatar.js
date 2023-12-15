import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, useTheme } from '@mui/material';
import Iconify from '../../../components/iconify';

function CoverAvatar({ icon, avatar }) {

  const getCharAtName = (name) => name && name.charAt(0).toUpperCase();
  const getCharAtSecondName = (name) => name && name.split(' ')[1]?.charAt(0).toUpperCase();
  const charAtName = getCharAtSecondName(avatar)? getCharAtName(avatar) + getCharAtSecondName(avatar): getCharAtName(avatar);

  const getColorByName = (name) => {
    if (['A', 'N', 'H', 'L', 'Q'].includes(getCharAtName(name))) return 'primary';
    if (['F', 'G', 'T', 'I', 'J'].includes(getCharAtName(name))) return 'info';
    if (['K', 'D', 'Y', 'B', 'O'].includes(getCharAtName(name))) return 'success';
    if (['P', 'E', 'R', 'S', 'U'].includes(getCharAtName(name))) return 'warning';
    if (['V', 'W', 'X', 'M', 'Z'].includes(getCharAtName(name))) return 'error';
    return 'info';
  };

  const theme = useTheme();
  const colorByName = getColorByName(avatar);
  const colr = colorByName;

  return (
    <Avatar sx={{
      color: theme.palette[colr]?.contrastText,
      backgroundColor: theme.palette[colr]?.main,
      fontWeight: theme.typography.fontWeightBold,
      border: '2px solid #fff',
      fontSize: '4rem',
      ml: { xs: 3, md: 3 },
      mt: { xs: 1, md: 1 },
      width: { xs: 110, md: 110 },
      height: { xs: 110, md: 110 },
    }}>
      {avatar ? charAtName :<Iconify icon={icon} width='60px' />}
    </Avatar>
  );
}

CoverAvatar.propTypes = {
  icon: PropTypes.string, 
  avatar: PropTypes.string
};

export default CoverAvatar;
