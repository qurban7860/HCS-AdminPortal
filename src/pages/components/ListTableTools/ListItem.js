import React from 'react';
import PropTypes from 'prop-types';
import { ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
import Iconify from '../../../components/iconify';

ListItem.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string,
  content: PropTypes.string,
};

export default function ListItem({ onClick, icon, content }) {
  return (
    <ListItemButton onClick={onClick}>
      <ListItemIcon>
        <Iconify icon={icon} />
      </ListItemIcon>
      <ListItemText primary={content} />
    </ListItemButton>
  );
}
