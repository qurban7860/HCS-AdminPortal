import React from 'react'
import { Card } from '@mui/material'
import PropTypes from 'prop-types';

const TableCard = ({children}) => 
    <Card sx={{ mt: 2 }} >
        {children}
    </Card>

TableCard.propTypes = {
    children: PropTypes.node.isRequired, // Validate the children prop
  };
export default TableCard