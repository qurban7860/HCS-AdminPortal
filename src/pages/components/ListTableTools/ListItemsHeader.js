import React from 'react';
import PropTypes from 'prop-types';
import { ListSubheader } from '@mui/material';

ListItemsHeader.propTypes = {
  header: PropTypes.string,
};

export default function ListItemsHeader({ header }) {
  return (
    <ListSubheader component="div" id="nested-list-subheader">
      {header}
    </ListSubheader>
  );
}
